<?php

namespace App\Services;

use App\Models\Order;
use App\Models\PaymentTransaction;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use RuntimeException;
use Throwable;

class SslCommerzService
{
    public function initiate(Order $order): PaymentTransaction
    {
        $this->ensureConfigured();

        if ($order->payment_status === 'paid') {
            throw new RuntimeException('This order is already paid.');
        }

        $attemptNo = (int) $order->paymentTransactions()
            ->where('gateway', 'sslcommerz')
            ->max('attempt_no') + 1;

        $transaction = PaymentTransaction::query()->create([
            'order_id' => $order->id,
            'gateway' => 'sslcommerz',
            'attempt_no' => $attemptNo,
            'transaction_id' => $this->newTransactionId(),
            'amount' => $order->total,
            'currency' => config('payments.sslcommerz.currency', 'BDT'),
            'status' => 'initiated',
            'initiated_at' => now(),
        ]);

        $payload = $this->sessionPayload($order, $transaction);

        try {
            $response = Http::asForm()
                ->acceptJson()
                ->connectTimeout(10)
                ->timeout(config('payments.sslcommerz.timeout', 30))
                ->retry(2, 300, throw: false)
                ->post($this->baseUrl() . '/gwprocess/v4/api.php', $payload);
        } catch (ConnectionException $exception) {
            $this->failInitiation($transaction, $payload, $exception->getMessage());

            throw new RuntimeException(
                'Unable to connect to SSLCommerz. Please try again.'
            );
        }

        $body = $response->json();
        $gatewayUrl = is_array($body)
            ? ($body['GatewayPageURL'] ?? null)
            : null;

        $success = $response->successful() && filled($gatewayUrl);

        $transaction->update([
            'request_payload' => $this->redact($payload),
            'response_payload' => is_array($body)
                ? $body
                : ['raw' => Str::limit($response->body(), 4000)],
            'session_key' => is_array($body)
                ? ($body['sessionkey'] ?? null)
                : null,
            'gateway_url' => $gatewayUrl,
            'status' => $success ? 'pending' : 'failed',
            'failure_reason' => $success
                ? null
                : (
                    is_array($body)
                        ? ($body['failedreason'] ?? 'Gateway session creation failed.')
                        : 'Invalid gateway response.'
                ),
            'failed_at' => $success ? null : now(),
        ]);

        if (! $success) {
            throw new RuntimeException(
                $transaction->failure_reason ?: 'Unable to start online payment.'
            );
        }

        $order->forceFill([
            'payment_method' => 'sslcommerz',
            'payment_status' => 'pending',
        ])->save();

        return $transaction->fresh();
    }

    public function validateAndMarkPaid(array $payload): PaymentTransaction
    {
        $transactionId = trim((string) ($payload['tran_id'] ?? ''));
        $validationId = trim((string) ($payload['val_id'] ?? ''));

        if ($transactionId === '' || $validationId === '') {
            throw new RuntimeException('Missing payment validation information.');
        }

        $transaction = PaymentTransaction::query()
            ->with('order')
            ->where('gateway', 'sslcommerz')
            ->where('transaction_id', $transactionId)
            ->firstOrFail();

        $this->recordCallback($transaction, $payload);

        if ($transaction->status === 'paid') {
            return $transaction;
        }

        $validation = Http::acceptJson()
            ->connectTimeout(10)
            ->timeout(config('payments.sslcommerz.timeout', 30))
            ->retry(2, 300, throw: false)
            ->get(
                $this->baseUrl() . '/validator/api/validationserverAPI.php',
                [
                    'val_id' => $validationId,
                    'store_id' => config('payments.sslcommerz.store_id'),
                    'store_passwd' => config('payments.sslcommerz.store_password'),
                    'v' => 1,
                    'format' => 'json',
                ]
            );

        if (! $validation->successful()) {
            throw new RuntimeException(
                'Payment validation service is unavailable.'
            );
        }

        $result = $validation->json();

        if (! is_array($result)) {
            throw new RuntimeException('Invalid validation response.');
        }

        $status = strtoupper((string) ($result['status'] ?? ''));
        $amount = round((float) ($result['amount'] ?? 0), 2);
        $currency = strtoupper((string) ($result['currency'] ?? ''));
        $gatewayTransactionId = (string) ($result['tran_id'] ?? $transactionId);

        $matches = in_array($status, ['VALID', 'VALIDATED'], true)
            && hash_equals($transaction->transaction_id, $gatewayTransactionId)
            && abs($amount - (float) $transaction->amount) <= 0.01
            && $currency === strtoupper((string) $transaction->currency);

        if (! $matches) {
            $transaction->update([
                'response_payload' => $result,
                'status' => 'failed',
                'failure_reason' => 'Gateway validation mismatch.',
                'failed_at' => now(),
                'last_verified_at' => now(),
            ]);

            throw new RuntimeException('Payment could not be verified.');
        }

        return DB::transaction(function () use (
            $transaction,
            $payload,
            $result,
            $validationId
        ) {
            $locked = PaymentTransaction::query()
                ->with('order')
                ->lockForUpdate()
                ->findOrFail($transaction->id);

            if ($locked->status === 'paid') {
                return $locked;
            }

            if ($locked->order->payment_status === 'paid') {
                $locked->update([
                    'status' => 'paid',
                    'validation_id' => $validationId,
                    'last_verified_at' => now(),
                    'paid_at' => $locked->paid_at ?: now(),
                    'failure_reason' => null,
                ]);

                return $locked->fresh(['order']);
            }

            $locked->update([
                'validation_id' => $validationId,
                'bank_transaction_id' => $result['bank_tran_id']
                    ?? ($payload['bank_tran_id'] ?? null),
                'callback_payload' => $this->redactCallback($payload),
                'response_payload' => $result,
                'status' => 'paid',
                'risk_level' => isset($result['risk_level'])
                    ? (int) $result['risk_level']
                    : null,
                'paid_at' => now(),
                'last_verified_at' => now(),
                'failure_reason' => null,
                'failed_at' => null,
            ]);

            $order = $locked->order;

            $order->forceFill([
                'payment_status' => 'paid',
                'payment_reference' => $locked->bank_transaction_id
                    ?: $locked->transaction_id,
                'status' => $order->status === 'pending'
                    ? 'confirmed'
                    : $order->status,
            ])->save();

            return $locked->fresh(['order']);
        });
    }

    public function markFailed(
        array $payload,
        string $status
    ): ?PaymentTransaction {
        $allowed = ['failed', 'cancelled'];

        if (! in_array($status, $allowed, true)) {
            throw new RuntimeException('Invalid payment status.');
        }

        $transaction = PaymentTransaction::query()
            ->where('gateway', 'sslcommerz')
            ->where(
                'transaction_id',
                trim((string) ($payload['tran_id'] ?? ''))
            )
            ->first();

        if (! $transaction) {
            return null;
        }

        $this->recordCallback($transaction, $payload);

        if ($transaction->status === 'paid') {
            return $transaction;
        }

        DB::transaction(function () use ($transaction, $payload, $status) {
            $locked = PaymentTransaction::query()
                ->with('order')
                ->lockForUpdate()
                ->findOrFail($transaction->id);

            if ($locked->status === 'paid') {
                return;
            }

            $locked->update([
                'status' => $status,
                'callback_payload' => $this->redactCallback($payload),
                'failure_reason' => $payload['error']
                    ?? $payload['failedreason']
                    ?? ucfirst($status),
                'failed_at' => now(),
            ]);

            if ($locked->order->payment_status !== 'paid') {
                $locked->order->forceFill([
                    'payment_status' => 'failed',
                ])->save();
            }
        });

        return $transaction->fresh();
    }

    public function retry(Order $order): PaymentTransaction
    {
        if ($order->payment_status === 'paid') {
            throw new RuntimeException('This order is already paid.');
        }

        if (in_array($order->status, ['cancelled', 'delivered'], true)) {
            throw new RuntimeException(
                'Payment cannot be retried for this order.'
            );
        }

        return $this->initiate($order);
    }

    private function recordCallback(
        PaymentTransaction $transaction,
        array $payload
    ): void {
        $transaction->forceFill([
            'callback_count' => $transaction->callback_count + 1,
            'last_callback_at' => now(),
            'callback_payload' => $this->redactCallback($payload),
        ])->save();
    }

    private function sessionPayload(
        Order $order,
        PaymentTransaction $transaction
    ): array {
        $shippingRequired = $order->shipping_method !== 'store_pickup';

        return [
            'store_id' => config('payments.sslcommerz.store_id'),
            'store_passwd' => config('payments.sslcommerz.store_password'),
            'total_amount' => number_format(
                (float) $order->total,
                2,
                '.',
                ''
            ),
            'currency' => $transaction->currency,
            'tran_id' => $transaction->transaction_id,
            'success_url' => route('payments.sslcommerz.success'),
            'fail_url' => route('payments.sslcommerz.fail'),
            'cancel_url' => route('payments.sslcommerz.cancel'),
            'ipn_url' => route('payments.sslcommerz.ipn'),

            'cus_name' => $order->customer_name,
            'cus_email' => $order->customer_email
                ?: 'customer@nuhamart.local',
            'cus_add1' => $order->address ?: 'Store pickup',
            'cus_city' => $order->district ?: 'Dhaka',
            'cus_state' => $order->division ?: 'Dhaka',
            'cus_postcode' => '1000',
            'cus_country' => 'Bangladesh',
            'cus_phone' => $order->customer_phone,

            'shipping_method' => $shippingRequired ? 'YES' : 'NO',
            'ship_name' => $order->customer_name,
            'ship_add1' => $order->address ?: 'Store pickup',
            'ship_city' => $order->district ?: 'Dhaka',
            'ship_state' => $order->division ?: 'Dhaka',
            'ship_postcode' => '1000',
            'ship_country' => 'Bangladesh',

            'product_name' => \App\Models\BusinessSetting::current()->company_name . ' Order ' . $order->order_no,
            'product_category' => 'Ecommerce',
            'product_profile' => 'general',
            'value_a' => $order->order_no,
            'value_b' => (string) $order->id,
            'value_c' => (string) $transaction->attempt_no,
        ];
    }

    private function ensureConfigured(): void
    {
        if (
            ! config('payments.sslcommerz.enabled')
            || blank(config('payments.sslcommerz.store_id'))
            || blank(config('payments.sslcommerz.store_password'))
        ) {
            throw new RuntimeException('SSLCommerz is not configured.');
        }
    }

    private function baseUrl(): string
    {
        return rtrim(
            config('payments.sslcommerz.mode') === 'live'
                ? config('payments.sslcommerz.live_base_url')
                : config('payments.sslcommerz.sandbox_base_url'),
            '/'
        );
    }

    private function newTransactionId(): string
    {
        return 'NMSSL-'
            . now()->format('ymdHis')
            . '-'
            . strtoupper(Str::random(10));
    }

    private function failInitiation(
        PaymentTransaction $transaction,
        array $payload,
        string $reason
    ): void {
        $transaction->update([
            'status' => 'failed',
            'failure_reason' => $reason,
            'failed_at' => now(),
            'request_payload' => $this->redact($payload),
        ]);
    }

    private function redact(array $payload): array
    {
        foreach (['store_passwd', 'store_password'] as $key) {
            if (array_key_exists($key, $payload)) {
                $payload[$key] = '***';
            }
        }

        return $payload;
    }

    private function redactCallback(array $payload): array
    {
        foreach (
            ['card_no', 'card_issuer', 'card_brand', 'card_type']
            as $key
        ) {
            if (isset($payload[$key])) {
                $payload[$key] = Str::mask(
                    (string) $payload[$key],
                    '*',
                    4
                );
            }
        }

        return $payload;
    }
}

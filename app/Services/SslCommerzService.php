<?php

namespace App\Services;

use App\Models\Order;
use App\Models\PaymentTransaction;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use RuntimeException;

class SslCommerzService
{
    public function initiate(Order $order): PaymentTransaction
    {
        $this->ensureConfigured();

        $transaction = PaymentTransaction::create([
            'order_id' => $order->id,
            'gateway' => 'sslcommerz',
            'transaction_id' => 'NMSSL-' . now()->format('ymdHis') . '-' . strtoupper(Str::random(8)),
            'amount' => $order->total,
            'currency' => config('payments.sslcommerz.currency', 'BDT'),
            'status' => 'initiated',
            'initiated_at' => now(),
        ]);

        $payload = $this->sessionPayload($order, $transaction);

        try {
            $response = Http::asForm()
                ->acceptJson()
                ->timeout(config('payments.sslcommerz.timeout', 30))
                ->post($this->baseUrl() . '/gwprocess/v4/api.php', $payload);
        } catch (ConnectionException $exception) {
            $transaction->update(['status' => 'failed', 'failure_reason' => $exception->getMessage(), 'failed_at' => now(), 'request_payload' => $this->redact($payload)]);
            throw new RuntimeException('Unable to connect to SSLCommerz. Please try again.');
        }

        $body = $response->json();
        $gatewayUrl = is_array($body) ? ($body['GatewayPageURL'] ?? null) : null;

        $transaction->update([
            'request_payload' => $this->redact($payload),
            'response_payload' => is_array($body) ? $body : ['raw' => $response->body()],
            'session_key' => is_array($body) ? ($body['sessionkey'] ?? null) : null,
            'gateway_url' => $gatewayUrl,
            'status' => $response->successful() && $gatewayUrl ? 'pending' : 'failed',
            'failure_reason' => $response->successful() && $gatewayUrl ? null : (is_array($body) ? ($body['failedreason'] ?? 'Gateway session creation failed.') : 'Invalid gateway response.'),
            'failed_at' => $response->successful() && $gatewayUrl ? null : now(),
        ]);

        if (! $response->successful() || ! $gatewayUrl) {
            throw new RuntimeException($transaction->failure_reason ?: 'Unable to start online payment.');
        }

        return $transaction->fresh();
    }

    public function validateAndMarkPaid(array $payload): PaymentTransaction
    {
        $transactionId = (string) ($payload['tran_id'] ?? '');
        $validationId = (string) ($payload['val_id'] ?? '');

        if ($transactionId === '' || $validationId === '') {
            throw new RuntimeException('Missing payment validation information.');
        }

        $transaction = PaymentTransaction::query()->with('order')->where('transaction_id', $transactionId)->firstOrFail();

        if ($transaction->status === 'paid') {
            return $transaction;
        }

        $validation = Http::acceptJson()
            ->timeout(config('payments.sslcommerz.timeout', 30))
            ->get($this->baseUrl() . '/validator/api/validationserverAPI.php', [
                'val_id' => $validationId,
                'store_id' => config('payments.sslcommerz.store_id'),
                'store_passwd' => config('payments.sslcommerz.store_password'),
                'v' => 1,
                'format' => 'json',
            ]);

        if (! $validation->successful()) {
            throw new RuntimeException('Payment validation service is unavailable.');
        }

        $result = $validation->json();
        $status = strtoupper((string) ($result['status'] ?? ''));
        $amount = round((float) ($result['amount'] ?? 0), 2);
        $currency = strtoupper((string) ($result['currency'] ?? ''));

        if (! in_array($status, ['VALID', 'VALIDATED'], true)
            || abs($amount - (float) $transaction->amount) > 0.01
            || $currency !== strtoupper($transaction->currency)) {
            $transaction->update([
                'callback_payload' => $payload,
                'response_payload' => $result,
                'status' => 'failed',
                'failure_reason' => 'Gateway validation mismatch.',
                'failed_at' => now(),
                'last_verified_at' => now(),
            ]);
            throw new RuntimeException('Payment could not be verified.');
        }

        return DB::transaction(function () use ($transaction, $payload, $result, $validationId) {
            $locked = PaymentTransaction::query()->lockForUpdate()->findOrFail($transaction->id);
            if ($locked->status === 'paid') {
                return $locked;
            }

            $locked->update([
                'validation_id' => $validationId,
                'bank_transaction_id' => $result['bank_tran_id'] ?? ($payload['bank_tran_id'] ?? null),
                'callback_payload' => $payload,
                'response_payload' => $result,
                'status' => 'paid',
                'risk_level' => isset($result['risk_level']) ? (int) $result['risk_level'] : null,
                'paid_at' => now(),
                'last_verified_at' => now(),
                'failure_reason' => null,
            ]);

            $locked->order()->update([
                'payment_status' => 'paid',
                'payment_reference' => $locked->bank_transaction_id ?: $locked->transaction_id,
                'status' => $locked->order->status === 'pending' ? 'confirmed' : $locked->order->status,
            ]);

            return $locked->fresh(['order']);
        });
    }

    public function markFailed(array $payload, string $status): ?PaymentTransaction
    {
        $transaction = PaymentTransaction::query()->where('transaction_id', (string) ($payload['tran_id'] ?? ''))->first();
        if (! $transaction || $transaction->status === 'paid') {
            return $transaction;
        }

        $transaction->update([
            'status' => $status,
            'callback_payload' => $payload,
            'failure_reason' => $payload['error'] ?? $payload['failedreason'] ?? ucfirst($status),
            'failed_at' => now(),
        ]);
        $transaction->order()->update(['payment_status' => 'failed']);

        return $transaction;
    }

    public function retry(Order $order): PaymentTransaction
    {
        if ($order->payment_status === 'paid') {
            throw new RuntimeException('This order is already paid.');
        }
        return $this->initiate($order);
    }

    private function sessionPayload(Order $order, PaymentTransaction $transaction): array
    {
        return [
            'store_id' => config('payments.sslcommerz.store_id'),
            'store_passwd' => config('payments.sslcommerz.store_password'),
            'total_amount' => number_format((float) $order->total, 2, '.', ''),
            'currency' => $transaction->currency,
            'tran_id' => $transaction->transaction_id,
            'success_url' => route('payments.sslcommerz.success'),
            'fail_url' => route('payments.sslcommerz.fail'),
            'cancel_url' => route('payments.sslcommerz.cancel'),
            'ipn_url' => route('payments.sslcommerz.ipn'),
            'cus_name' => $order->customer_name,
            'cus_email' => $order->customer_email ?: 'customer@nuhamart.local',
            'cus_add1' => $order->address,
            'cus_city' => $order->district,
            'cus_state' => $order->division,
            'cus_postcode' => '1000',
            'cus_country' => 'Bangladesh',
            'cus_phone' => $order->customer_phone,
            'shipping_method' => $order->shipping_method === 'store_pickup' ? 'NO' : 'YES',
            'ship_name' => $order->customer_name,
            'ship_add1' => $order->address,
            'ship_city' => $order->district,
            'ship_state' => $order->division,
            'ship_postcode' => '1000',
            'ship_country' => 'Bangladesh',
            'product_name' => 'Nuha Mart BD Order ' . $order->order_no,
            'product_category' => 'Ecommerce',
            'product_profile' => 'general',
            'value_a' => $order->order_no,
        ];
    }

    private function ensureConfigured(): void
    {
        if (! config('payments.sslcommerz.enabled')
            || blank(config('payments.sslcommerz.store_id'))
            || blank(config('payments.sslcommerz.store_password'))) {
            throw new RuntimeException('SSLCommerz is not configured.');
        }
    }

    private function baseUrl(): string
    {
        return config('payments.sslcommerz.mode') === 'live'
            ? config('payments.sslcommerz.live_base_url')
            : config('payments.sslcommerz.sandbox_base_url');
    }

    private function redact(array $payload): array
    {
        $payload['store_passwd'] = '***';
        return $payload;
    }
}

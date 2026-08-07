<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\PaymentTransaction;
use App\Models\User;
use App\Services\SslCommerzService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class SslCommerzPaymentV2Test extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config()->set('payments.sslcommerz.enabled', true);
        config()->set('payments.sslcommerz.store_id', 'testbox');
        config()->set('payments.sslcommerz.store_password', 'qwerty');
        config()->set('payments.sslcommerz.mode', 'sandbox');
    }

    public function test_each_retry_creates_a_new_numbered_attempt(): void
    {
        Http::fake([
            'sandbox.sslcommerz.com/gwprocess/v4/api.php' => Http::response([
                'status' => 'SUCCESS',
                'sessionkey' => 'abc',
                'GatewayPageURL' => 'https://sandbox.sslcommerz.com/pay/abc',
            ]),
        ]);

        $order = $this->order();

        $first = app(SslCommerzService::class)->initiate($order);
        $second = app(SslCommerzService::class)->retry($order->fresh());

        $this->assertSame(1, $first->attempt_no);
        $this->assertSame(2, $second->attempt_no);
        $this->assertNotSame(
            $first->transaction_id,
            $second->transaction_id
        );
    }

    public function test_duplicate_valid_callbacks_remain_idempotent(): void
    {
        Http::fake([
            'sandbox.sslcommerz.com/validator/api/validationserverAPI.php*'
                => Http::response([
                    'status' => 'VALID',
                    'tran_id' => 'TX-V2',
                    'amount' => '500.00',
                    'currency' => 'BDT',
                    'bank_tran_id' => 'BANK-V2',
                    'risk_level' => 0,
                ]),
        ]);

        $order = $this->order();

        $transaction = $order->paymentTransactions()->create([
            'gateway' => 'sslcommerz',
            'attempt_no' => 1,
            'transaction_id' => 'TX-V2',
            'amount' => 500,
            'currency' => 'BDT',
            'status' => 'pending',
        ]);

        $service = app(SslCommerzService::class);

        $service->validateAndMarkPaid([
            'tran_id' => 'TX-V2',
            'val_id' => 'VAL-V2',
        ]);

        $service->validateAndMarkPaid([
            'tran_id' => 'TX-V2',
            'val_id' => 'VAL-V2',
        ]);

        $transaction->refresh();

        $this->assertSame('paid', $transaction->status);
        $this->assertSame(2, $transaction->callback_count);
        $this->assertSame('paid', $order->fresh()->payment_status);
        $this->assertDatabaseCount('payment_transactions', 1);
    }

    public function test_customer_can_retry_only_their_own_unpaid_order(): void
    {
        Http::fake([
            'sandbox.sslcommerz.com/gwprocess/v4/api.php' => Http::response([
                'status' => 'SUCCESS',
                'sessionkey' => 'retry',
                'GatewayPageURL' => 'https://sandbox.sslcommerz.com/pay/retry',
            ]),
        ]);

        $customer = User::factory()->create();
        $other = User::factory()->create();

        $owned = $this->order(['user_id' => $customer->id]);
        $foreign = $this->order(['user_id' => $other->id]);

        $this->actingAs($customer)
            ->post(route('payments.sslcommerz.retry', $owned))
            ->assertRedirect('https://sandbox.sslcommerz.com/pay/retry');

        $this->actingAs($customer)
            ->post(route('payments.sslcommerz.retry', $foreign))
            ->assertForbidden();
    }

    private function order(array $overrides = []): Order
    {
        return Order::query()->create(array_merge([
            'order_no' => 'NM-PAY-' . uniqid(),
            'customer_name' => 'Test Customer',
            'customer_phone' => '01700000000',
            'customer_email' => 'test@example.com',
            'division' => 'Dhaka',
            'district' => 'Dhaka',
            'area' => 'Dhanmondi',
            'address' => 'Dhaka',
            'subtotal' => 500,
            'shipping_charge' => 0,
            'discount' => 0,
            'total' => 500,
            'payment_method' => 'sslcommerz',
            'payment_status' => 'pending',
            'status' => 'pending',
            'ordered_at' => now(),
        ], $overrides));
    }
}

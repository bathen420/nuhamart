<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Services\SslCommerzService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class SslCommerzPaymentTest extends TestCase
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

    public function test_sslcommerz_callback_routes_are_registered(): void
    {
        foreach (['payments.sslcommerz.success', 'payments.sslcommerz.fail', 'payments.sslcommerz.cancel', 'payments.sslcommerz.ipn'] as $name) {
            $this->assertTrue(\Illuminate\Support\Facades\Route::has($name), $name);
        }
    }

    public function test_gateway_session_is_created_and_logged(): void
    {
        Http::fake(['sandbox.sslcommerz.com/gwprocess/v4/api.php' => Http::response(['status' => 'SUCCESS', 'sessionkey' => 'abc', 'GatewayPageURL' => 'https://sandbox.sslcommerz.com/pay/abc'])]);
        $order = $this->order();

        $transaction = app(SslCommerzService::class)->initiate($order);

        $this->assertSame('pending', $transaction->status);
        $this->assertSame('abc', $transaction->session_key);
        $this->assertDatabaseHas('payment_transactions', ['order_id' => $order->id, 'gateway' => 'sslcommerz']);
    }

    public function test_validated_callback_marks_order_paid_idempotently(): void
    {
        Http::fake(['sandbox.sslcommerz.com/validator/api/validationserverAPI.php*' => Http::response(['status' => 'VALID', 'amount' => '500.00', 'currency' => 'BDT', 'bank_tran_id' => 'BANK123', 'risk_level' => 0])]);
        $order = $this->order();
        $transaction = $order->paymentTransactions()->create(['gateway'=>'sslcommerz','transaction_id'=>'TX123','amount'=>500,'currency'=>'BDT','status'=>'pending']);

        $service = app(SslCommerzService::class);
        $service->validateAndMarkPaid(['tran_id'=>'TX123','val_id'=>'VAL123']);
        $service->validateAndMarkPaid(['tran_id'=>'TX123','val_id'=>'VAL123']);

        $this->assertSame('paid', $order->fresh()->payment_status);
        $this->assertSame('paid', $transaction->fresh()->status);
        $this->assertDatabaseCount('payment_transactions', 1);
    }

    private function order(): Order
    {
        return Order::create([
            'order_no'=>'NM-PAY-'.uniqid(), 'customer_name'=>'Test Customer', 'customer_phone'=>'01700000000',
            'customer_email'=>'test@example.com', 'division'=>'Dhaka', 'district'=>'Dhaka', 'area'=>'Dhanmondi',
            'address'=>'Dhaka', 'subtotal'=>500, 'shipping_charge'=>0, 'discount'=>0, 'total'=>500,
            'payment_method'=>'sslcommerz', 'payment_status'=>'pending', 'status'=>'pending', 'ordered_at'=>now(),
        ]);
    }
}

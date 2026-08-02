<?php

namespace Tests\Feature;

use App\Models\BusinessSetting;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OnePageCheckoutTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_pickup_creates_order_without_delivery_address_or_shipping_charge(): void
    {
        $product = Product::factory()->create([
            'price' => 500,
            'discount_price' => null,
            'stock_quantity' => 10,
            'product_type' => 'physical',
        ]);

        $this->post(route('checkout.store'), [
            'name' => 'Pickup Customer',
            'phone' => '01712345678',
            'shipping_method' => 'store_pickup',
            'payment_method' => 'cod',
            'items' => [['product_id' => $product->id, 'quantity' => 1]],
        ])->assertRedirect();

        $order = Order::firstOrFail();
        $this->assertSame('0.00', $order->shipping_charge);
        $this->assertSame('500.00', $order->total);
        $this->assertSame('Store Pickup', $order->district);
    }

    public function test_free_shipping_threshold_is_enforced_by_server(): void
    {
        BusinessSetting::current()->update([
            'shipping_dhaka' => 60,
            'shipping_outside_dhaka' => 120,
            'free_shipping_threshold' => 1000,
        ]);

        $product = Product::factory()->create([
            'price' => 600,
            'discount_price' => null,
            'stock_quantity' => 10,
            'product_type' => 'physical',
        ]);

        $this->post(route('checkout.store'), [
            'name' => 'Free Shipping Customer',
            'phone' => '01812345678',
            'division' => 'Dhaka',
            'district' => 'Dhaka',
            'area' => 'Uttara',
            'address' => 'House 1',
            'shipping_method' => 'standard',
            'payment_method' => 'cod',
            'items' => [['product_id' => $product->id, 'quantity' => 2]],
        ])->assertRedirect();

        $order = Order::firstOrFail();
        $this->assertSame('0.00', $order->shipping_charge);
        $this->assertSame('1200.00', $order->total);
    }

    public function test_bank_transfer_requires_reference(): void
    {
        config()->set('commerce.payments.bank.enabled', true);
        $product = Product::factory()->create(['stock_quantity' => 5, 'product_type' => 'physical']);

        $this->post(route('checkout.store'), [
            'name' => 'Bank Customer',
            'phone' => '01912345678',
            'division' => 'Dhaka',
            'district' => 'Dhaka',
            'area' => 'Mirpur',
            'address' => 'Test address',
            'shipping_method' => 'standard',
            'payment_method' => 'bank',
            'items' => [['product_id' => $product->id, 'quantity' => 1]],
        ])->assertSessionHasErrors('payment_reference');
    }
}

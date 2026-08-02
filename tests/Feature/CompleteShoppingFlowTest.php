<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class CompleteShoppingFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_shopping_flow_routes_are_registered(): void
    {
        foreach ([
            'cart.index',
            'checkout.index',
            'checkout.store',
            'checkout.success',
            'storefront.products.show',
        ] as $route) {
            $this->assertTrue(Route::has($route), $route);
        }
    }

    public function test_guest_can_place_physical_product_order_with_server_side_price_and_shipping(): void
    {
        $product = Product::factory()->create([
            'price' => 500,
            'discount_price' => 450,
            'stock_quantity' => 10,
            'product_type' => 'physical',
        ]);

        $response = $this->post(route('checkout.store'), [
            'name' => 'Test Customer',
            'phone' => '01712345678',
            'email' => 'buyer@example.com',
            'division' => 'Dhaka',
            'district' => 'Dhaka',
            'area' => 'Uttara',
            'address' => 'House 1, Road 2',
            'shipping_method' => 'standard',
            'payment_method' => 'cod',
            'items' => [['product_id' => $product->id, 'quantity' => 2]],
        ]);

        $order = Order::firstOrFail();
        $response->assertRedirect(route('checkout.success', $order->order_no));
        $this->assertSame('960.00', $order->total);
        $this->assertSame('60.00', $order->shipping_charge);
        $this->assertSame(8, $product->fresh()->stock_quantity);
        $this->assertDatabaseHas('order_items', [
            'order_id' => $order->id,
            'product_id' => $product->id,
            'unit_price' => 450,
            'quantity' => 2,
        ]);
    }

    public function test_digital_only_order_has_no_shipping_and_does_not_reduce_stock(): void
    {
        $product = Product::factory()->create([
            'price' => 300,
            'ebook_price' => 199,
            'stock_quantity' => 0,
            'product_type' => 'ebook',
        ]);

        $this->post(route('checkout.store'), [
            'name' => 'Digital Buyer',
            'phone' => '01812345678',
            'division' => 'Chattogram',
            'district' => 'Chattogram',
            'area' => 'Pahartali',
            'address' => 'Digital delivery order',
            'shipping_method' => 'standard',
            'payment_method' => 'bkash',
            'payment_reference' => 'TRX123456',
            'items' => [['product_id' => $product->id, 'quantity' => 1]],
        ])->assertRedirect();

        $order = Order::firstOrFail();
        $this->assertSame('0.00', $order->shipping_charge);
        $this->assertSame('199.00', $order->total);
        $this->assertSame(0, $product->fresh()->stock_quantity);
    }

    public function test_manual_payment_requires_reference(): void
    {
        $product = Product::factory()->create(['stock_quantity' => 5, 'product_type' => 'physical']);

        $this->post(route('checkout.store'), [
            'name' => 'Test Customer',
            'phone' => '01912345678',
            'division' => 'Dhaka',
            'district' => 'Dhaka',
            'area' => 'Mirpur',
            'address' => 'Test address',
            'shipping_method' => 'standard',
            'payment_method' => 'nagad',
            'items' => [['product_id' => $product->id, 'quantity' => 1]],
        ])->assertSessionHasErrors('payment_reference');
    }
}

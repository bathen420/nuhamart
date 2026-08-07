<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\Schema;

test('customer order list supports status and search filters', function () {
    $user = User::factory()->create();

    Order::factory()->create([
        'user_id' => $user->id,
        'order_no' => 'NM-SEARCH-001',
        'status' => 'processing',
    ]);

    Order::factory()->create([
        'user_id' => $user->id,
        'order_no' => 'NM-OTHER-002',
        'status' => 'delivered',
    ]);

    $this->actingAs($user)
        ->get(route('customer.orders.index', [
            'search' => 'SEARCH',
            'status' => 'processing',
        ]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Customer/Orders/Index')
            ->has('orders.data', 1)
            ->where('orders.data.0.order_no', 'NM-SEARCH-001')
            ->where('filters.status', 'processing')
        );
});

test('customer can download only their own invoice', function () {
    $customer = User::factory()->create();
    $other = User::factory()->create();

    $owned = Order::factory()->create(['user_id' => $customer->id]);
    $foreign = Order::factory()->create(['user_id' => $other->id]);

    $this->actingAs($customer)
        ->get(route('customer.orders.invoice', $owned))
        ->assertOk()
        ->assertHeader('content-type', 'application/pdf');

    $this->actingAs($customer)
        ->get(route('customer.orders.invoice', $foreign))
        ->assertForbidden();
});

test('customer can request cancellation for an eligible order', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'pending',
    ]);

    $this->actingAs($user)
        ->post(route('customer.orders.cancel-request', $order), [
            'reason' => 'I selected the wrong delivery address.',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $order->refresh();

    expect($order->cancellation_requested_at)->not->toBeNull()
        ->and($order->cancellation_reason)->toBe('I selected the wrong delivery address.');

    $this->assertDatabaseHas('order_status_histories', [
        'order_id' => $order->id,
        'title' => 'Cancellation requested',
    ]);
});

test('customer cannot request cancellation for shipped order', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => 'shipped',
    ]);

    $this->actingAs($user)
        ->post(route('customer.orders.cancel-request', $order), [
            'reason' => 'This request should be rejected.',
        ])
        ->assertStatus(422);
});

test('reorder response contains only currently available products', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $user->id]);

    $available = Product::factory()->create([
        'status' => true,
        'stock_quantity' => 5,
        'product_type' => 'physical',
    ]);

    $unavailable = Product::factory()->create([
        'status' => false,
        'stock_quantity' => 5,
        'product_type' => 'physical',
    ]);

    OrderItem::query()->create([
        'order_id' => $order->id,
        'product_id' => $available->id,
        'product_name' => $available->name,
        'sku' => $available->sku,
        'unit_price' => $available->price,
        'quantity' => 2,
        'subtotal' => $available->price * 2,
    ]);

    OrderItem::query()->create([
        'order_id' => $order->id,
        'product_id' => $unavailable->id,
        'product_name' => $unavailable->name,
        'sku' => $unavailable->sku,
        'unit_price' => $unavailable->price,
        'quantity' => 1,
        'subtotal' => $unavailable->price,
    ]);

    $this->actingAs($user)
        ->postJson(route('customer.orders.reorder', $order))
        ->assertOk()
        ->assertJsonPath('items.0.id', $available->id)
        ->assertJsonPath('items.0.quantity', 2)
        ->assertJsonPath('skipped', 1);
});

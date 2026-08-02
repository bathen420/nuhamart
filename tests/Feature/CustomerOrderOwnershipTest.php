<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerOrderOwnershipTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_cannot_view_another_users_order(): void
    {
        $owner = User::factory()->create(['email_verified_at' => now()]);
        $other = User::factory()->create(['email_verified_at' => now()]);

        $order = Order::query()->create([
            'order_no' => 'NM-OWNERSHIP-1',
            'user_id' => $owner->id,
            'customer_name' => $owner->name,
            'customer_phone' => '01700000000',
            'customer_email' => $owner->email,
            'division' => 'Dhaka',
            'district' => 'Dhaka',
            'area' => 'Dhanmondi',
            'address' => 'Test address',
            'subtotal' => 100,
            'shipping_charge' => 60,
            'discount' => 0,
            'total' => 160,
            'payment_method' => 'cod',
            'payment_status' => 'pending',
            'status' => 'pending',
            'ordered_at' => now(),
        ]);

        $this->actingAs($other)->get(route('customer.orders.show', $order))->assertForbidden();
        $this->actingAs($owner)->get(route('customer.orders.show', $order))->assertOk();
    }
}

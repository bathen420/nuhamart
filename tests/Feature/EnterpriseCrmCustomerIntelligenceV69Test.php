<?php

use App\Models\Customer;
use App\Models\User;
use Spatie\Permission\Models\Permission;

function createCrmIntelligenceCustomer(array $overrides = []): Customer
{
    return Customer::query()->create(array_merge([
        'customer_code' => 'INT-' . fake()->unique()->numerify('#####'),
        'name' => 'Intelligence Customer',
        'phone' => fake()->unique()->numerify('01#########'),
        'email' => fake()->unique()->safeEmail(),
        'address' => 'Dhaka, Bangladesh',
        'opening_balance' => 0,
        'current_balance' => 0,
        'status' => true,
        'notes' => null,
    ], $overrides));
}

test('customer 360 exposes customer intelligence and unified activity', function () {
    foreach (['crm.view', 'customers.view'] as $permission) {
        Permission::findOrCreate($permission, 'web');
    }

    $admin = User::factory()->create([
        'is_active' => true,
        'email_verified_at' => now(),
    ]);

    $admin->givePermissionTo(['crm.view', 'customers.view']);

    $customer = createCrmIntelligenceCustomer();

    $this->actingAs($admin)
        ->get(route('admin.crm.show', $customer))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Admin/CRM/Show')
            ->has('customer.statistics.total_transactions')
            ->has('customer.statistics.purchase_frequency')
            ->has('customer.statistics.customer_stage')
            ->has('customer.activity')
            ->has('customer.wallet_transactions')
            ->has('customer.loyalty_transactions'));
});

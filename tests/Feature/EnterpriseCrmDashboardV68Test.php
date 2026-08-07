<?php

use App\Models\Customer;
use App\Models\User;
use Spatie\Permission\Models\Permission;

function createEnterpriseCrmDashboardCustomer(array $overrides = []): Customer
{
    return Customer::query()->create(array_merge([
        'customer_code' => 'CRM-' . fake()->unique()->numerify('#####'),
        'name' => 'CRM Dashboard Customer',
        'phone' => fake()->unique()->numerify('01#########'),
        'email' => fake()->unique()->safeEmail(),
        'address' => 'Dhaka, Bangladesh',
        'opening_balance' => 0,
        'current_balance' => 0,
        'status' => true,
        'notes' => null,
    ], $overrides));
}

test('authorised admin can open crm dashboard', function () {
    Permission::findOrCreate('crm.view', 'web');

    $admin = User::factory()->create([
        'is_active' => true,
        'email_verified_at' => now(),
    ]);

    $admin->givePermissionTo('crm.view');

    createEnterpriseCrmDashboardCustomer();

    $this->actingAs($admin)
        ->get(route('admin.crm.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Admin/CRM/Index')
            ->has('summary')
            ->has('monthly', 6)
            ->has('segments')
            ->has('topCustomers')
            ->has('recentCustomers')
            ->has('recentActivity'));
});

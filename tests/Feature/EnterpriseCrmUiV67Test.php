<?php

use App\Models\Customer;
use App\Models\User;
use Spatie\Permission\Models\Permission;

test('authorised user can open enterprise customers page', function () {
    Permission::findOrCreate('customers.view', 'web');

    $user = User::factory()->create([
        'is_active' => true,
        'email_verified_at' => now(),
    ]);

    $user->givePermissionTo('customers.view');

    $this->actingAs($user)
        ->get(route('admin.customers.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Admin/Customers/Index')
            ->has('customers')
            ->has('summary')
            ->has('filters'));
});

test('authorised user can open customer 360 profile', function () {
    Permission::findOrCreate('customers.view', 'web');

    $user = User::factory()->create([
        'is_active' => true,
        'email_verified_at' => now(),
    ]);

    $customer = Customer::factory()->create();

    $user->givePermissionTo('customers.view');

    $this->actingAs($user)
        ->get(route('admin.crm.show', $customer))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Admin/CRM/Show')
            ->where('customer.id', $customer->id)
            ->has('customer.profile')
            ->has('customer.statistics'));
});

test('loyalty adjustment requires crm permission', function () {
    Permission::findOrCreate('customers.view', 'web');

    $user = User::factory()->create([
        'is_active' => true,
        'email_verified_at' => now(),
    ]);

    $customer = Customer::factory()->create();

    $user->givePermissionTo('customers.view');

    $this->actingAs($user)
        ->post(route('admin.crm.points', $customer), [
            'points' => 100,
            'note' => 'Test adjustment',
        ])
        ->assertForbidden();
});


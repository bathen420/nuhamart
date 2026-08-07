<?php

use App\Models\Customer;
use App\Models\CustomerAddress;
use App\Models\User;
use Spatie\Permission\Models\Permission;

function createCrmTestCustomer(array $overrides = []): Customer
{
    return Customer::query()->create(array_merge([
        'customer_code' => 'CUS-' . fake()->unique()->numerify('#####'),
        'name' => 'CRM Test Customer',
        'phone' => fake()->unique()->numerify('01#########'),
        'email' => fake()->unique()->safeEmail(),
        'address' => 'Dhaka, Bangladesh',
        'opening_balance' => 0,
        'current_balance' => 0,
        'status' => true,
        'notes' => null,
    ], $overrides));
}

function createCrmTestAdmin(): User
{
    foreach (['crm.view', 'customers.view'] as $permission) {
        Permission::findOrCreate($permission, 'web');
    }

    $admin = User::factory()->create([
        'is_active' => true,
        'email_verified_at' => now(),
    ]);

    /*
     * EnforceAdminPermission resolves admin.crm.show to crm.view,
     * while CrmController::show() also explicitly checks customers.view.
     * The test user therefore needs both permissions.
     */
    $admin->givePermissionTo(['crm.view', 'customers.view']);

    return $admin;
}

test('customer 360 profile loads addresses through linked storefront user', function () {
    $admin = createCrmTestAdmin();

    $storefrontUser = User::factory()->create([
        'email' => 'crm-customer@example.com',
        'phone' => '01700123456',
        'is_active' => true,
        'email_verified_at' => now(),
    ]);

    $customer = createCrmTestCustomer([
        'customer_code' => 'CUS-CRM-001',
        'email' => $storefrontUser->email,
        'phone' => $storefrontUser->phone,
    ]);

    CustomerAddress::query()->create([
        'user_id' => $storefrontUser->id,
        'label' => 'Home',
        'name' => $customer->name,
        'phone' => $customer->phone,
        'division' => 'Dhaka',
        'district' => 'Dhaka',
        'area' => 'Uttara',
        'address' => 'Road 1, Sector 3',
        'is_default' => true,
    ]);

    $this->actingAs($admin)
        ->get(route('admin.crm.show', $customer))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Admin/CRM/Show')
            ->has('customer.addresses', 1)
            ->where('customer.addresses.0.user_id', $storefrontUser->id)
            ->where('customer.addresses.0.address', 'Road 1, Sector 3'));
});

test('customer 360 profile loads without a linked storefront user', function () {
    $admin = createCrmTestAdmin();

    $customer = createCrmTestCustomer([
        'customer_code' => 'CUS-CRM-002',
        'email' => 'unlinked@example.com',
        'phone' => '01800999999',
    ]);

    $this->actingAs($admin)
        ->get(route('admin.crm.show', $customer))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Admin/CRM/Show')
            ->has('customer.addresses', 0));
});


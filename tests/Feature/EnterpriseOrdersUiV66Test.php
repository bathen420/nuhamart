<?php

use App\Models\User;
use Spatie\Permission\Models\Permission;

test('authorised user can open enterprise orders page', function () {
    Permission::findOrCreate('orders.view', 'web');

    $user = User::factory()->create([
        'is_active' => true,
        'email_verified_at' => now(),
    ]);

    $user->givePermissionTo('orders.view');

    $this->actingAs($user)
        ->get(route('admin.orders.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Admin/Orders/Index')
            ->has('orders')
            ->has('summary')
            ->has('filters'));
});

test('orders page accepts enterprise filters', function () {
    Permission::findOrCreate('orders.view', 'web');

    $user = User::factory()->create([
        'is_active' => true,
        'email_verified_at' => now(),
    ]);

    $user->givePermissionTo('orders.view');

    $this->actingAs($user)
        ->get(route('admin.orders.index', [
            'status' => 'pending',
            'payment_status' => 'pending',
            'sort' => 'total_high',
        ]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('filters.status', 'pending')
            ->where('filters.payment_status', 'pending')
            ->where('filters.sort', 'total_high'));
});

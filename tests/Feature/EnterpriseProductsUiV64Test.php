<?php

use App\Models\User;
use Spatie\Permission\Models\Permission;

test('authorised active user can open enterprise product pages', function () {
    foreach (['products.view', 'products.create'] as $name) {
        Permission::findOrCreate($name, 'web');
    }

    $user = User::factory()->create([
        'is_active' => true,
        'email_verified_at' => now(),
    ]);

    $user->givePermissionTo(['products.view', 'products.create']);

    $this->actingAs($user)
        ->get(route('admin.products.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('Admin/Products/Index'));

    $this->actingAs($user)
        ->get(route('admin.products.create'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('Admin/Products/Create'));
});

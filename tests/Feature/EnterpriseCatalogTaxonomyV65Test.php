<?php

use App\Models\User;
use Spatie\Permission\Models\Permission;

test('authorised user can open enterprise taxonomy pages', function () {
    $permissions = [
        'categories.view',
        'brands.view',
        'authors.view',
        'publishers.view',
        'units.view',
    ];

    foreach ($permissions as $name) {
        Permission::findOrCreate($name, 'web');
    }

    $user = User::factory()->create([
        'is_active' => true,
        'email_verified_at' => now(),
    ]);

    $user->givePermissionTo($permissions);

    $pages = [
        ['admin.categories.index', 'Admin/Categories/Index'],
        ['admin.brands.index', 'Admin/Brands/Index'],
        ['admin.authors.index', 'Admin/Authors/Index'],
        ['admin.publishers.index', 'Admin/Publishers/Index'],
        ['admin.units.index', 'Admin/Units/Index'],
    ];

    foreach ($pages as [$routeName, $component]) {
        $this->actingAs($user)
            ->get(route($routeName))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component($component));
    }
});

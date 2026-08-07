<?php

use App\Models\Product;
use App\Models\User;
use App\Models\Wishlist;

test('public wishlist page is available to guests', function () {
    $this->get(route('wishlist.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Customer/Wishlist/Index')
            ->where('isAuthenticated', false)
        );
});

test('customer wishlist requires authentication', function () {
    $this->get(route('customer.wishlist.index'))
        ->assertRedirect(route('login'));
});

test('customer can add and remove a product from wishlist', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['status' => true]);

    $this->actingAs($user)
        ->postJson(route('customer.wishlist.store', $product))
        ->assertOk()
        ->assertJsonPath('count', 1)
        ->assertJsonPath('product_ids.0', $product->id);

    $this->assertDatabaseHas('wishlists', [
        'user_id' => $user->id,
        'product_id' => $product->id,
    ]);

    $this->actingAs($user)
        ->deleteJson(route('customer.wishlist.destroy', $product))
        ->assertOk()
        ->assertJsonPath('count', 0);

    $this->assertDatabaseMissing('wishlists', [
        'user_id' => $user->id,
        'product_id' => $product->id,
    ]);
});

test('adding the same product twice does not create duplicates', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['status' => true]);

    $this->actingAs($user)
        ->postJson(route('customer.wishlist.store', $product))
        ->assertOk();

    $this->actingAs($user)
        ->postJson(route('customer.wishlist.store', $product))
        ->assertOk()
        ->assertJsonPath('count', 1);

    expect(Wishlist::query()
        ->where('user_id', $user->id)
        ->where('product_id', $product->id)
        ->count()
    )->toBe(1);
});

test('guest wishlist can be merged into customer wishlist', function () {
    $user = User::factory()->create();
    $products = Product::factory()->count(2)->create(['status' => true]);

    $this->actingAs($user)
        ->postJson(route('customer.wishlist.merge'), [
            'product_ids' => $products->pluck('id')->all(),
        ])
        ->assertOk()
        ->assertJsonPath('count', 2);

    foreach ($products as $product) {
        $this->assertDatabaseHas('wishlists', [
            'user_id' => $user->id,
            'product_id' => $product->id,
        ]);
    }
});

test('deleting a product removes its wishlist records', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['status' => true]);

    Wishlist::query()->create([
        'user_id' => $user->id,
        'product_id' => $product->id,
    ]);

    $product->delete();

    $this->assertDatabaseMissing('wishlists', [
        'user_id' => $user->id,
        'product_id' => $product->id,
    ]);
});

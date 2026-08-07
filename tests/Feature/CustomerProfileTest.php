<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('customer profile page requires authentication', function () {
    $this->get(route('customer.profile.edit'))
        ->assertRedirect(route('login'));
});

test('customer profile page is displayed', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('customer.profile.edit'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Customer/Profile/Edit')
            ->where('profile.name', $user->name)
            ->where('profile.email', $user->email)
        );
});

test('customer can update profile information', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->patch(route('customer.profile.update'), [
            'name' => 'Nuha Customer',
            'email' => 'customer@example.com',
            'phone' => '01700000000',
            'date_of_birth' => '1995-05-10',
            'gender' => 'female',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $user->refresh();

    expect($user->name)->toBe('Nuha Customer')
        ->and($user->email)->toBe('customer@example.com')
        ->and($user->phone)->toBe('01700000000')
        ->and($user->date_of_birth->format('Y-m-d'))->toBe('1995-05-10')
        ->and($user->gender)->toBe('female')
        ->and($user->email_verified_at)->toBeNull();
});

test('customer can upload and remove profile photo', function () {
    Storage::fake('public');

    $user = User::factory()->create();

    $this->actingAs($user)
        ->patch(route('customer.profile.update'), [
            'name' => $user->name,
            'email' => $user->email,
            'avatar' => UploadedFile::fake()->image('avatar.jpg', 300, 300),
        ])
        ->assertSessionHasNoErrors();

    $user->refresh();

    expect($user->avatar)->not->toBeNull();
    Storage::disk('public')->assertExists($user->avatar);

    $path = $user->avatar;

    $this->actingAs($user)
        ->delete(route('customer.profile.avatar.destroy'))
        ->assertSessionHasNoErrors();

    expect($user->refresh()->avatar)->toBeNull();
    Storage::disk('public')->assertMissing($path);
});

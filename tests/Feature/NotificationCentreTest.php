<?php

use App\Models\Notification;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RolesAndPermissionsSeeder::class);
});

it('shows only the signed-in users notifications', function () {
    $user = User::factory()->create(['is_active' => true]);
    $other = User::factory()->create(['is_active' => true]);
    $user->givePermissionTo('notifications.view');

    Notification::query()->create([
        'user_id' => $user->id,
        'title' => 'My notification',
        'message' => 'Visible to me',
        'type' => 'info',
    ]);

    Notification::query()->create([
        'user_id' => $other->id,
        'title' => 'Other notification',
        'message' => 'Must stay private',
        'type' => 'warning',
    ]);

    $this->actingAs($user)
        ->get(route('admin.notifications.index'))
        ->assertOk()
        ->assertSee('My notification')
        ->assertDontSee('Other notification');
});

it('marks an owned notification as read', function () {
    $user = User::factory()->create(['is_active' => true]);
    $user->givePermissionTo('notifications.view');
    $notification = Notification::query()->create([
        'user_id' => $user->id,
        'title' => 'Read me',
        'message' => 'Test message',
        'type' => 'info',
    ]);

    $this->actingAs($user)
        ->patch(route('admin.notifications.read', $notification))
        ->assertRedirect();

    expect($notification->refresh()->is_read)->toBeTrue()
        ->and($notification->read_at)->not->toBeNull();
});

it('prevents a user from changing another users notification', function () {
    $user = User::factory()->create(['is_active' => true]);
    $other = User::factory()->create(['is_active' => true]);
    $user->givePermissionTo('notifications.view');
    $notification = Notification::query()->create([
        'user_id' => $other->id,
        'title' => 'Private',
        'message' => 'Private message',
        'type' => 'danger',
    ]);

    $this->actingAs($user)
        ->patch(route('admin.notifications.read', $notification))
        ->assertNotFound();
});

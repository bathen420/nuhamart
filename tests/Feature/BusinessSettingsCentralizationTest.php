<?php

use App\Models\BusinessSetting;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Permission;

test('business settings are globally shared with inertia', function () {
    $setting = BusinessSetting::current();
    $setting->update([
        'company_name' => 'Central Brand Ltd',
        'phone' => '01700000000',
        'support_email' => 'support@example.com',
        'instagram_url' => 'https://instagram.com/example',
    ]);
    BusinessSetting::clearCache();

    $this->get('/')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('businessSettings.company_name', 'Central Brand Ltd')
            ->where('businessSettings.phone', '01700000000')
            ->where('businessSettings.support_email', 'support@example.com')
            ->where('businessSettings.instagram_url', 'https://instagram.com/example')
        );
});

test('settings cache is cleared after update', function () {
    $setting = BusinessSetting::current();
    $setting->update(['company_name' => 'First Name']);
    BusinessSetting::clearCache();

    expect(BusinessSetting::current()->company_name)->toBe('First Name');

    $setting->fresh()->update(['company_name' => 'Second Name']);
    BusinessSetting::clearCache();

    expect(BusinessSetting::current()->company_name)->toBe('Second Name');
});

test('admin can upload central branding files', function () {
    Storage::fake('public');

    Permission::findOrCreate('settings.edit', 'web');

    $admin = User::factory()->create([
        'is_active' => true,
        'email_verified_at' => now(),
    ]);

    $admin->givePermissionTo('settings.edit');

    $setting = BusinessSetting::current();

    $payload = array_merge($setting->toArray(), [
        'company_name' => 'Central Brand',
        'currency_code' => 'BDT',
        'currency_symbol' => '৳',
        'timezone' => 'Asia/Dhaka',
        'sales_prefix' => 'INV',
        'purchase_prefix' => 'PUR',
        'sales_return_prefix' => 'SRN',
        'purchase_return_prefix' => 'PRN',
        'tax_rate' => 0,
        'shipping_dhaka' => 60,
        'shipping_outside_dhaka' => 120,
        'default_payment_method' => 'Cash',
        'default_courier' => 'steadfast',
        'courier_sync_minutes' => 15,
        'logo' => UploadedFile::fake()->image('logo.png'),
    ]);

    $this->actingAs($admin)
        ->post(route('admin.settings.update'), [...$payload, '_method' => 'patch'])
        ->assertSessionHasNoErrors();

    $path = BusinessSetting::current()->logo;

    expect($path)->not->toBeNull();
    Storage::disk('public')->assertExists($path);
});

<?php

use App\Models\BusinessSetting;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Permission;

test('enterprise branding payload provides surface specific fallbacks', function () {
    $setting = BusinessSetting::current();

    $setting->forceFill([
        'company_name' => 'Enterprise Brand',
        'logo' => 'business/branding/main.png',
        'footer_logo' => null,
        'invoice_logo' => null,
        'pos_logo' => null,
    ])->save();

    BusinessSetting::clearCache();

    $payload = BusinessSetting::current()->publicPayload();

    expect($payload['header_logo'])
        ->toContain('/storage/business/branding/main.png')
        ->and($payload['footer_brand_logo'])
        ->toBe($payload['header_logo'])
        ->and($payload['invoice_brand_logo'])
        ->toBe($payload['header_logo'])
        ->and($payload['pos_brand_logo'])
        ->toBe($payload['header_logo']);
});

test('enterprise settings are globally shared', function () {
    $setting = BusinessSetting::current();

    $setting->forceFill([
        'company_name' => 'Enterprise Brand Ltd',
        'twitter_url' => 'https://x.com/enterprise',
        'receipt_footer' => 'Thank you for shopping with us.',
        'twitter_card' => 'summary_large_image',
    ])->save();

    BusinessSetting::clearCache();

    $this->get('/')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('businessSettings.company_name', 'Enterprise Brand Ltd')
            ->where('businessSettings.twitter_url', 'https://x.com/enterprise')
            ->where('businessSettings.receipt_footer', 'Thank you for shopping with us.')
            ->where('businessSettings.twitter_card', 'summary_large_image')
        );
});

test('active authorised admin can upload dedicated enterprise logos', function () {
    Storage::fake('public');

    Permission::findOrCreate('settings.edit', 'web');

    $admin = User::factory()->create([
        'is_active' => true,
        'email_verified_at' => now(),
    ]);
    $admin->givePermissionTo('settings.edit');

    $setting = BusinessSetting::current();

    $payload = array_merge($setting->toArray(), [
        'company_name' => 'Enterprise Brand',
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
        'admin_logo' => UploadedFile::fake()->image('admin-logo.png'),
        'invoice_logo' => UploadedFile::fake()->image('invoice-logo.png'),
        'pos_logo' => UploadedFile::fake()->image('pos-logo.png'),
    ]);

    $this->actingAs($admin)
        ->post(route('admin.settings.update'), [
            ...$payload,
            '_method' => 'patch',
        ])
        ->assertSessionHasNoErrors();

    $saved = BusinessSetting::current();

    Storage::disk('public')->assertExists($saved->admin_logo);
    Storage::disk('public')->assertExists($saved->invoice_logo);
    Storage::disk('public')->assertExists($saved->pos_logo);
});

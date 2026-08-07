<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;

class BusinessSetting extends Model
{
    public const CACHE_KEY = 'business-settings.current';

    public const LOGO_FIELDS = [
        'logo',
        'dark_logo',
        'white_logo',
        'footer_logo',
        'mobile_logo',
        'admin_logo',
        'login_logo',
        'invoice_logo',
        'pos_logo',
        'email_logo',
        'favicon',
        'og_image',
    ];

    protected $guarded = [];

    protected $casts = [
        'tax_rate' => 'decimal:2',
        'shipping_dhaka' => 'decimal:2',
        'shipping_outside_dhaka' => 'decimal:2',
        'free_shipping_threshold' => 'decimal:2',
        'steadfast_enabled' => 'boolean',
        'courier_sync_minutes' => 'integer',
        'cod_enabled' => 'boolean',
        'bkash_enabled' => 'boolean',
        'nagad_enabled' => 'boolean',
        'bank_enabled' => 'boolean',
        'sslcommerz_enabled' => 'boolean',
        'store_pickup_enabled' => 'boolean',
        'tax_enabled' => 'boolean',
    ];

    public static function current(): self
    {
        if (! Schema::hasTable('business_settings')) {
            return new static(static::defaults());
        }

        return Cache::rememberForever(
            self::CACHE_KEY,
            fn () => static::query()->firstOrCreate([], static::defaults())
        );
    }

    public static function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    public static function defaults(): array
    {
        return [
            'company_name' => 'Nuha Mart BD',
            'short_name' => 'Nuha Mart',
            'company_tagline' => 'Everything You Need, All in One Place',
            'seo_title' => 'Nuha Mart BD',
            'seo_description' => 'Books, e-books, stationery and everyday products in Bangladesh.',
            'twitter_card' => 'summary_large_image',
            'currency_code' => 'BDT',
            'currency_symbol' => '৳',
            'timezone' => 'Asia/Dhaka',
            'sales_prefix' => 'INV',
            'purchase_prefix' => 'PUR',
            'sales_return_prefix' => 'SRN',
            'purchase_return_prefix' => 'PRN',
            'tax_rate' => 0,
            'tax_enabled' => false,
            'default_payment_method' => 'Cash',
            'cod_enabled' => true,
            'store_pickup_enabled' => true,
            'copyright_text' => '© ' . date('Y') . ' Nuha Mart BD. All rights reserved.',
        ];
    }

    public function publicPayload(): array
    {
        $payload = $this->only([
            'company_name', 'short_name', 'company_tagline',
            ...self::LOGO_FIELDS,
            'address', 'google_map_embed', 'phone', 'hotline', 'whatsapp',
            'email', 'support_email', 'reply_to_email', 'support_hours', 'website',
            'facebook_url', 'instagram_url', 'youtube_url', 'linkedin_url',
            'twitter_url', 'tiktok_url', 'telegram_url', 'messenger_url',
            'seo_title', 'seo_description', 'seo_keywords',
            'google_verification', 'bing_verification', 'twitter_card',
            'currency_code', 'currency_symbol', 'timezone', 'tax_rate',
            'tax_enabled', 'shipping_dhaka', 'shipping_outside_dhaka',
            'free_shipping_threshold', 'cod_enabled', 'bkash_enabled',
            'nagad_enabled', 'bank_enabled', 'sslcommerz_enabled',
            'store_pickup_enabled', 'bkash_number', 'nagad_number',
            'bank_payment_instructions', 'invoice_footer', 'receipt_footer',
            'email_footer', 'footer_description', 'copyright_text',
        ]);

        foreach (self::LOGO_FIELDS as $field) {
            $payload[$field] = $this->assetUrl($payload[$field] ?? null);
        }

        $payload['header_logo'] = $payload['logo'];
        $payload['mobile_header_logo'] = $payload['mobile_logo'] ?: $payload['logo'];
        $payload['admin_brand_logo'] = $payload['admin_logo'] ?: $payload['dark_logo'] ?: $payload['logo'];
        $payload['authentication_logo'] = $payload['login_logo'] ?: $payload['logo'];
        $payload['invoice_brand_logo'] = $payload['invoice_logo'] ?: $payload['logo'];
        $payload['pos_brand_logo'] = $payload['pos_logo'] ?: $payload['invoice_logo'] ?: $payload['logo'];
        $payload['email_brand_logo'] = $payload['email_logo'] ?: $payload['logo'];
        $payload['footer_brand_logo'] = $payload['footer_logo'] ?: $payload['white_logo'] ?: $payload['logo'];

        return $payload;
    }

    public function assetUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        if (
            str_starts_with($path, 'http://')
            || str_starts_with($path, 'https://')
            || str_starts_with($path, '/')
        ) {
            return $path;
        }

        return asset('storage/' . ltrim($path, '/'));
    }

    public function localImagePath(string $field, ?string $fallback = 'logo'): ?string
    {
        $path = $this->{$field} ?: ($fallback ? $this->{$fallback} : null);

        if (! $path || str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return null;
        }

        if (str_starts_with($path, '/uploads/')) {
            return public_path(ltrim($path, '/'));
        }

        if (str_starts_with($path, '/storage/')) {
            return storage_path('app/public/' . ltrim(substr($path, strlen('/storage/')), '/'));
        }

        return storage_path('app/public/' . ltrim($path, '/'));
    }
}

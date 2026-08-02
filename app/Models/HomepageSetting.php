<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class HomepageSetting extends Model
{
    protected $fillable = ['key', 'value'];

    protected $casts = [
        'value' => 'array',
    ];

    public static function payload(): array
    {
        return Cache::remember('homepage-cms:settings', now()->addMinutes(30), function (): array {
            $stored = static::query()->pluck('value', 'key')->all();

            return array_replace_recursive(static::defaults(), $stored);
        });
    }

    public static function defaults(): array
    {
        return [
            'general' => [
                'preset' => 'book_store',
                'announcement_enabled' => true,
                'announcement_text' => 'Free delivery on qualifying orders',
                'announcement_text_bn' => 'নির্ধারিত অর্ডারে ফ্রি ডেলিভারি',
                'announcement_url' => '/shop',
                'cache_minutes' => 15,
            ],
            'sections' => [
                'hero' => ['enabled' => true, 'order' => 10],
                'categories' => ['enabled' => true, 'order' => 20],
                'flash_sale' => ['enabled' => true, 'order' => 30],
                'featured' => ['enabled' => true, 'order' => 40],
                'best_sellers' => ['enabled' => true, 'order' => 50],
                'new_arrivals' => ['enabled' => true, 'order' => 60],
                'ebooks' => ['enabled' => true, 'order' => 70],
                'authors_publishers' => ['enabled' => true, 'order' => 80],
                'trust' => ['enabled' => true, 'order' => 90],
            ],
        ];
    }

    public static function savePayload(array $payload): void
    {
        foreach ($payload as $key => $value) {
            static::query()->updateOrCreate(['key' => $key], ['value' => $value]);
        }

        Cache::forget('homepage-cms:settings');
        Cache::forget('storefront:home:'.app()->getLocale());
    }
}

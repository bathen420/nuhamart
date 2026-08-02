<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BusinessSetting extends Model
{
    protected $fillable = [
        'company_name',
        'company_tagline',
        'logo',
        'address',
        'phone',
        'email',
        'website',
        'facebook_url',
        'youtube_url',
        'currency_code',
        'currency_symbol',
        'timezone',
        'sales_prefix',
        'purchase_prefix',
        'sales_return_prefix',
        'purchase_return_prefix',
        'tax_rate',
        'shipping_dhaka',
        'shipping_outside_dhaka',
        'free_shipping_threshold',
        'default_payment_method',
        'bkash_number',
        'nagad_number',
        'bank_payment_instructions',
        'invoice_footer',
    ];

    protected $casts = [
        'tax_rate' => 'decimal:2',
        'shipping_dhaka' => 'decimal:2',
        'shipping_outside_dhaka' => 'decimal:2',
        'free_shipping_threshold' => 'decimal:2',
    ];

    public static function current(): self
    {
        return static::query()->firstOrCreate([], [
            'company_name' => 'Nuha Mart BD',
            'company_tagline' => 'Books, E-books & Everyday Shopping',
            'currency_code' => 'BDT',
            'currency_symbol' => '৳',
            'timezone' => 'Asia/Dhaka',
            'sales_prefix' => 'INV',
            'purchase_prefix' => 'PUR',
            'sales_return_prefix' => 'SRN',
            'purchase_return_prefix' => 'PRN',
            'tax_rate' => 0,
            'default_payment_method' => 'Cash',
        ]);
    }
}

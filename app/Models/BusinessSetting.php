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
        'currency_code',
        'currency_symbol',
        'timezone',
        'sales_prefix',
        'purchase_prefix',
        'sales_return_prefix',
        'purchase_return_prefix',
        'tax_rate',
        'default_payment_method',
        'invoice_footer',
    ];

    protected $casts = [
        'tax_rate' => 'decimal:2',
    ];

    public static function current(): self
    {
        return static::query()->firstOrCreate([], [
            'company_name' => 'NuhaMart',
            'company_tagline' => 'Inventory & POS System',
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

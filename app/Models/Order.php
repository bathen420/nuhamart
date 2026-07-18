<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [

        'order_number',

        'customer_name',
        'customer_phone',
        'customer_email',
        'customer_address',

        'subtotal',
        'discount',
        'shipping_charge',
        'grand_total',

        'payment_method',
        'payment_status',
        'order_status',

        'notes',
    ];
}
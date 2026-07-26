<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'order_no',
        'customer_id',
        'customer_name',
        'customer_phone',
        'customer_email',
        'division',
        'district',
        'area',
        'address',
        'note',
        'subtotal',
        'shipping_charge',
        'discount',
        'total',
        'payment_method',
        'payment_status',
        'status',
        'ordered_at',
    ];

    protected $casts = [
        'ordered_at' => 'datetime',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    protected $fillable = [
        'sale_number',
        'customer_id',
        'user_id',
        'subtotal',
        'discount',
        'tax',
        'shipping',
        'total',
        'paid_amount',
        'due_amount',
        'payment_method',
        'payment_status',
        'sale_status',
        'note',
    ];

    /**
     * Customer
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Sale Items
     */
    public function items()
    {
        return $this->hasMany(SaleItem::class);
    }
}
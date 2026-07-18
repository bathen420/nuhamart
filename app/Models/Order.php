<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [

        'order_number',

        'user_id',

        'customer_name',

        'customer_phone',

        'customer_email',

        'customer_address',

        'subtotal',

        'discount',

        'shipping',

        'total',

        'payment_method',

        'payment_status',

        'order_status',

        'note',

    ];

    /**
     * User Relationship
     */
   public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
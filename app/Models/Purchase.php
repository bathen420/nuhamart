<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    protected $fillable = [
        'purchase_number',
        'supplier_id',
        'user_id',
        'subtotal',
        'discount',
        'shipping',
        'total',
        'note',
    ];

    /**
     * Supplier
     */
    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    /**
     * User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Purchase Items
     */
    public function items()
    {
        return $this->hasMany(PurchaseItem::class);
    }
}
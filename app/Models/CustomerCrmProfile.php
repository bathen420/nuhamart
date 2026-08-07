<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomerCrmProfile extends Model
{
    protected $fillable = [
        'customer_id',
        'loyalty_tier_id',
        'membership_number',
        'points_balance',
        'lifetime_points',
        'wallet_balance',
        'credit_limit',
        'birthday',
        'anniversary',
        'last_purchase_at',
    ];

    protected $casts = [
        'points_balance' => 'integer',
        'lifetime_points' => 'integer',
        'wallet_balance' => 'decimal:2',
        'credit_limit' => 'decimal:2',
        'birthday' => 'date',
        'anniversary' => 'date',
        'last_purchase_at' => 'datetime',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function loyaltyTier(): BelongsTo
    {
        return $this->belongsTo(LoyaltyTier::class);
    }
}

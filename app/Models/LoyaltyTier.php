<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LoyaltyTier extends Model
{
    protected $fillable = [
        'name',
        'minimum_spend',
        'minimum_points',
        'discount_percent',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'minimum_spend' => 'decimal:2',
        'minimum_points' => 'integer',
        'discount_percent' => 'decimal:2',
        'sort_order' => 'integer',
        'is_active' => 'boolean',
    ];

    public function profiles(): HasMany
    {
        return $this->hasMany(CustomerCrmProfile::class);
    }
}

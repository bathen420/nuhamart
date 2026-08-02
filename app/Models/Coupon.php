<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Coupon extends Model
{
    use HasFactory;

    protected $fillable = ['marketing_campaign_id','code','name','type','value','minimum_order','maximum_discount','scope_type','scope_ids','usage_limit','per_customer_limit','used_count','starts_at','ends_at','is_active'];
    protected $casts = ['value'=>'decimal:2','minimum_order'=>'decimal:2','maximum_discount'=>'decimal:2','scope_ids'=>'array','starts_at'=>'datetime','ends_at'=>'datetime','is_active'=>'boolean'];

    public function campaign(): BelongsTo { return $this->belongsTo(MarketingCampaign::class, 'marketing_campaign_id'); }
    public function redemptions(): HasMany { return $this->hasMany(CouponRedemption::class); }

    public function scopeCurrentlyActive($query)
    {
        return $query->where('is_active', true)
            ->where(fn ($q) => $q->whereNull('starts_at')->orWhere('starts_at', '<=', now()))
            ->where(fn ($q) => $q->whereNull('ends_at')->orWhere('ends_at', '>=', now()));
    }
}

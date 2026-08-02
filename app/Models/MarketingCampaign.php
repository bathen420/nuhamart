<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MarketingCampaign extends Model
{
    use HasFactory;

    protected $fillable = ['name','name_bn','slug','description','banner','landing_url','starts_at','ends_at','is_active'];
    protected $casts = ['starts_at'=>'datetime','ends_at'=>'datetime','is_active'=>'boolean'];

    public function coupons(): HasMany { return $this->hasMany(Coupon::class); }

    public function scopeCurrentlyActive($query)
    {
        return $query->where('is_active', true)
            ->where(fn ($q) => $q->whereNull('starts_at')->orWhere('starts_at', '<=', now()))
            ->where(fn ($q) => $q->whereNull('ends_at')->orWhere('ends_at', '>=', now()));
    }
}

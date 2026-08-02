<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class LoyaltyTier extends Model
{
    protected $fillable=['name','minimum_spend','minimum_points','discount_percent','sort_order','is_active'];
    protected $casts=['minimum_spend'=>'decimal:2','discount_percent'=>'decimal:2','is_active'=>'boolean'];
}

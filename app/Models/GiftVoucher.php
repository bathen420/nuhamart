<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class GiftVoucher extends Model
{
    protected $fillable=['code','name','discount_type','value','minimum_order','usage_limit','used_count','starts_at','expires_at','is_active','created_by'];
    protected $casts=['value'=>'decimal:2','minimum_order'=>'decimal:2','starts_at'=>'date','expires_at'=>'date','is_active'=>'boolean'];
}

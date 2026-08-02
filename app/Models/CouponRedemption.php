<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class CouponRedemption extends Model
{
    protected $fillable = ['coupon_id','order_id','user_id','customer_phone','discount_amount'];
    protected $casts = ['discount_amount'=>'decimal:2'];
}

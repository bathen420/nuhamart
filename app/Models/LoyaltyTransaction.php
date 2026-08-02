<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class LoyaltyTransaction extends Model
{
    protected $fillable=['customer_id','sale_id','sale_return_id','user_id','type','points','balance_after','reference','note'];
}

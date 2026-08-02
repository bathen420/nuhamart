<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class WalletTransaction extends Model
{
    protected $fillable=['customer_id','user_id','type','amount','balance_after','reference','note'];
    protected $casts=['amount'=>'decimal:2','balance_after'=>'decimal:2'];
}

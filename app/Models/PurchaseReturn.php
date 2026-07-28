<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class PurchaseReturn extends Model {
 protected $fillable=['return_number','purchase_id','supplier_id','user_id','return_date','subtotal','refund_amount','refund_method','status','reason'];
 protected $casts=['return_date'=>'date','subtotal'=>'decimal:2','refund_amount'=>'decimal:2'];
 public function purchase(){return $this->belongsTo(Purchase::class);} public function supplier(){return $this->belongsTo(Supplier::class);}
 public function user(){return $this->belongsTo(User::class);} public function items(){return $this->hasMany(PurchaseReturnItem::class);}
}
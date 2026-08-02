<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model; use Illuminate\Database\Eloquent\Relations\BelongsTo; use Illuminate\Database\Eloquent\Relations\HasMany;
class PurchaseRequisition extends Model { protected $fillable=['requisition_number','department','required_date','status','reason','requested_by','approved_by','approved_at']; protected $casts=['required_date'=>'date','approved_at'=>'datetime']; public function items():HasMany{return $this->hasMany(PurchaseRequisitionItem::class);} public function requester():BelongsTo{return $this->belongsTo(User::class,'requested_by');} public function approver():BelongsTo{return $this->belongsTo(User::class,'approved_by');} public function purchaseOrders():HasMany{return $this->hasMany(PurchaseOrder::class);} }

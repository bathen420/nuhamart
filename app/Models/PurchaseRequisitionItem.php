<?php
namespace App\Models; use Illuminate\Database\Eloquent\Model; use Illuminate\Database\Eloquent\Relations\BelongsTo;
class PurchaseRequisitionItem extends Model { protected $fillable=['product_id','quantity','estimated_price','note']; protected $casts=['estimated_price'=>'decimal:2']; public function requisition():BelongsTo{return $this->belongsTo(PurchaseRequisition::class,'purchase_requisition_id');} public function product():BelongsTo{return $this->belongsTo(Product::class);} }

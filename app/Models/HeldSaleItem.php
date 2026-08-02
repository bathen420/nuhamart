<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class HeldSaleItem extends Model { protected $fillable=['held_sale_id','product_id','quantity','price']; protected $casts=['price'=>'decimal:2']; public function heldSale():BelongsTo{return $this->belongsTo(HeldSale::class);} public function product():BelongsTo{return $this->belongsTo(Product::class);} }

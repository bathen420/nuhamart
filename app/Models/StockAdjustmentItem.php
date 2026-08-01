<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class StockAdjustmentItem extends Model {
    protected $fillable=['product_id','direction','quantity','reason','unit_cost'];
    protected $casts=['quantity'=>'integer','unit_cost'=>'decimal:2'];
    public function adjustment(){ return $this->belongsTo(StockAdjustment::class,'stock_adjustment_id'); }
    public function product(){ return $this->belongsTo(Product::class); }
}
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class OpeningStockItem extends Model {
    protected $fillable=['opening_stock_id','product_id','quantity','unit_cost','total_cost'];
    protected $casts=['quantity'=>'integer','unit_cost'=>'decimal:2','total_cost'=>'decimal:2'];
    public function openingStock(){ return $this->belongsTo(OpeningStock::class); }
    public function product(){ return $this->belongsTo(Product::class); }
}

<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class StockTransferItem extends Model {
    protected $fillable=['product_id','quantity','unit_cost'];
    protected $casts=['quantity'=>'integer','unit_cost'=>'decimal:2'];
    public function transfer(){ return $this->belongsTo(StockTransfer::class,'stock_transfer_id'); }
    public function product(){ return $this->belongsTo(Product::class); }
}
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class StockLedger extends Model {
    protected $fillable=['product_id','warehouse_id','occurred_at','movement_type','reference','quantity_in','quantity_out','balance_after','unit_cost','note','created_by'];
    protected $casts=['occurred_at'=>'datetime','quantity_in'=>'integer','quantity_out'=>'integer','balance_after'=>'integer','unit_cost'=>'decimal:2'];
    public function product(){ return $this->belongsTo(Product::class); }
    public function warehouse(){ return $this->belongsTo(Warehouse::class); }
    public function creator(){ return $this->belongsTo(User::class,'created_by'); }
}
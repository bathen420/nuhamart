<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class StockTransfer extends Model {
    protected $fillable=['reference','from_warehouse_id','to_warehouse_id','transfer_date','status','note','created_by','dispatched_by','received_by','dispatched_at','received_at'];
    protected $casts=['transfer_date'=>'date','dispatched_at'=>'datetime','received_at'=>'datetime'];
    public function items(){ return $this->hasMany(StockTransferItem::class); }
    public function fromWarehouse(){ return $this->belongsTo(Warehouse::class,'from_warehouse_id'); }
    public function toWarehouse(){ return $this->belongsTo(Warehouse::class,'to_warehouse_id'); }
    public function creator(){ return $this->belongsTo(User::class,'created_by'); }
}
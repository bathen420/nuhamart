<?php
namespace App\Services;
use App\Models\StockLedger;
class StockLedgerService {
    public function record(int $productId,int $warehouseId,string $type,string $reference,int $in,int $out,int $balance,float $cost=0,?string $note=null,?int $userId=null): StockLedger {
        return StockLedger::create(['product_id'=>$productId,'warehouse_id'=>$warehouseId,'occurred_at'=>now(),'movement_type'=>$type,'reference'=>$reference,
            'quantity_in'=>$in,'quantity_out'=>$out,'balance_after'=>$balance,'unit_cost'=>$cost,'note'=>$note,'created_by'=>$userId]);
    }
}
<?php
namespace App\Repositories\StockLedger;
use App\Models\StockLedger;
class StockLedgerRepository implements StockLedgerRepositoryInterface {
    public function paginate(array $filters=[]){
        return StockLedger::query()->with(['product:id,name,sku','warehouse:id,name,code'])
            ->when($filters['product_id']??null,fn($q,$v)=>$q->where('product_id',$v))
            ->when($filters['warehouse_id']??null,fn($q,$v)=>$q->where('warehouse_id',$v))
            ->when($filters['movement_type']??null,fn($q,$v)=>$q->where('movement_type',$v))
            ->when($filters['date_from']??null,fn($q,$v)=>$q->whereDate('occurred_at','>=',$v))
            ->when($filters['date_to']??null,fn($q,$v)=>$q->whereDate('occurred_at','<=',$v))
            ->latest('occurred_at')->latest('id')->paginate(25)->withQueryString();
    }
}
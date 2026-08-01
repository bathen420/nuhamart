<?php
namespace App\Repositories\StockAdjustment;
use App\Models\StockAdjustment;
class StockAdjustmentRepository implements StockAdjustmentRepositoryInterface {
    public function paginate(array $filters=[]){
        return StockAdjustment::query()->with('warehouse:id,name,code')->when($filters['search']??null,fn($q,$v)=>$q->where('reference','like',"%$v%"))
            ->when($filters['status']??null,fn($q,$v)=>$q->where('status',$v))->latest('adjustment_date')->latest('id')->paginate(15)->withQueryString();
    }
    public function create(array $data): StockAdjustment { return StockAdjustment::create($data); }
    public function findWithRelations(StockAdjustment $adjustment): StockAdjustment { return $adjustment->load(['warehouse','items.product','creator','approver']); }
}
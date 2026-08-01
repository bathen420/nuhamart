<?php
namespace App\Repositories\StockTransfer;
use App\Models\StockTransfer;
class StockTransferRepository implements StockTransferRepositoryInterface {
    public function paginate(array $filters=[]){
        return StockTransfer::query()->with(['fromWarehouse:id,name,code','toWarehouse:id,name,code'])
            ->when($filters['search']??null,fn($q,$v)=>$q->where('reference','like',"%$v%"))
            ->when($filters['status']??null,fn($q,$v)=>$q->where('status',$v))->latest('transfer_date')->latest('id')->paginate(15)->withQueryString();
    }
    public function create(array $data): StockTransfer { return StockTransfer::create($data); }
    public function findWithRelations(StockTransfer $transfer): StockTransfer { return $transfer->load(['fromWarehouse','toWarehouse','items.product','creator']); }
}
<?php
namespace App\Repositories\OpeningStock;
use App\Models\OpeningStock;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
class OpeningStockRepository implements OpeningStockRepositoryInterface {
    public function paginate(array $filters=[]): LengthAwarePaginator {
        return OpeningStock::query()->with(['warehouse:id,name,code','creator:id,name'])->withCount('items')
            ->when($filters['search']??null,fn($q,$v)=>$q->where('reference','like',"%{$v}%"))
            ->when($filters['warehouse_id']??null,fn($q,$v)=>$q->where('warehouse_id',$v))
            ->latest('opening_date')->latest('id')->paginate(15)->withQueryString();
    }
    public function create(array $data): OpeningStock { return OpeningStock::create($data); }
    public function findWithRelations(OpeningStock $openingStock): OpeningStock { return $openingStock->load(['warehouse','creator','items.product:id,name,sku']); }
}

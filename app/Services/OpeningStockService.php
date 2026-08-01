<?php
namespace App\Services;
use App\Models\OpeningStock;
use App\Models\Product;
use App\Models\ProductWarehouseStock;
use App\Models\StockHistory;
use App\Repositories\OpeningStock\OpeningStockRepositoryInterface;
use Illuminate\Support\Facades\DB;
class OpeningStockService {
    public function __construct(private OpeningStockRepositoryInterface $repository, private StockLedgerService $ledger, private AccountingService $accounting) {}
    public function paginate(array $filters=[]){ return $this->repository->paginate($filters); }
    public function show(OpeningStock $openingStock){ return $this->repository->findWithRelations($openingStock); }
    public function create(array $data, ?int $userId): OpeningStock {
        return DB::transaction(function() use($data,$userId){
            $opening=$this->repository->create([
                'reference'=>$this->nextReference(),'warehouse_id'=>$data['warehouse_id'],'opening_date'=>$data['opening_date'],
                'note'=>$data['note']??null,'created_by'=>$userId,
            ]);
            foreach($data['items'] as $row){
                $product=Product::query()->lockForUpdate()->findOrFail($row['product_id']);
                $before=(int)$product->stock_quantity; $qty=(int)$row['quantity']; $cost=(float)$row['unit_cost'];
                $opening->items()->create(['product_id'=>$product->id,'quantity'=>$qty,'unit_cost'=>$cost,'total_cost'=>$qty*$cost]);
                $warehouseStock=ProductWarehouseStock::query()->lockForUpdate()->firstOrNew(['product_id'=>$product->id,'warehouse_id'=>$data['warehouse_id']]);
                $oldQty=(int)($warehouseStock->quantity??0); $newQty=$oldQty+$qty;
                $warehouseStock->quantity=$newQty;
                $warehouseStock->average_cost=$newQty>0 ? (($oldQty*(float)($warehouseStock->average_cost??0))+($qty*$cost))/$newQty : 0;
                $warehouseStock->save();
                $product->update(['stock_quantity'=>$before+$qty]);
                StockHistory::create(['product_id'=>$product->id,'user_id'=>$userId,'type'=>'OPENING','quantity'=>$qty,'stock_before'=>$before,'stock_after'=>$before+$qty,'reference'=>$opening->reference,'note'=>'Opening stock - warehouse #'.$data['warehouse_id']]);
                $this->ledger->record($product->id,(int)$data['warehouse_id'],'OPENING',$opening->reference,$qty,0,$newQty,$cost,'Opening stock',$userId);
            }
            $this->accounting->postOpeningStock($opening, (int) $userId);
            return $this->repository->findWithRelations($opening);
        });
    }
    private function nextReference(): string { return 'OS-'.now()->format('Ymd').'-'.str_pad((string)((OpeningStock::max('id')??0)+1),5,'0',STR_PAD_LEFT); }
}

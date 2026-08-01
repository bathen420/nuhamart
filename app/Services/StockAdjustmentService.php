<?php
namespace App\Services;
use App\Models\Product;
use App\Models\ProductWarehouseStock;
use App\Models\StockAdjustment;
use App\Repositories\StockAdjustment\StockAdjustmentRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
class StockAdjustmentService {
    public function __construct(private StockAdjustmentRepositoryInterface $repository, private StockLedgerService $ledger, private AccountingService $accounting){}
    public function paginate(array $filters=[]){ return $this->repository->paginate($filters); }
    public function show(StockAdjustment $adjustment){ return $this->repository->findWithRelations($adjustment); }
    public function create(array $data,?int $userId): StockAdjustment {
        return DB::transaction(function()use($data,$userId){
            $adjustment=$this->repository->create(['reference'=>$this->nextReference(),'warehouse_id'=>$data['warehouse_id'],'adjustment_date'=>$data['adjustment_date'],'status'=>'draft','note'=>$data['note']??null,'created_by'=>$userId]);
            foreach($data['items'] as $row){ $adjustment->items()->create(['product_id'=>$row['product_id'],'direction'=>$row['direction'],'quantity'=>$row['quantity'],'reason'=>$row['reason'],'unit_cost'=>$row['unit_cost']??0]); }
            return $this->repository->findWithRelations($adjustment);
        });
    }
    public function approve(StockAdjustment $adjustment,?int $userId): StockAdjustment {
        if($adjustment->status!=='draft') throw ValidationException::withMessages(['status'=>'Only draft adjustments can be approved.']);
        return DB::transaction(function()use($adjustment,$userId){
            $adjustment->load('items');
            foreach($adjustment->items as $item){
                $product=Product::query()->lockForUpdate()->findOrFail($item->product_id);
                $stock=ProductWarehouseStock::query()->lockForUpdate()->firstOrCreate(['product_id'=>$item->product_id,'warehouse_id'=>$adjustment->warehouse_id],['quantity'=>0,'average_cost'=>0]);
                $qty=(int)$item->quantity; $beforeWarehouse=(int)$stock->quantity; $beforeTotal=(int)$product->stock_quantity;
                if($item->direction==='decrease' && $beforeWarehouse<$qty) throw ValidationException::withMessages(['stock'=>"Insufficient warehouse stock for {$product->name}."]);
                $delta=$item->direction==='increase'?$qty:-$qty; $stock->quantity=$beforeWarehouse+$delta; $stock->save();
                $product->stock_quantity=$beforeTotal+$delta; $product->save();
                $this->ledger->record($product->id,$adjustment->warehouse_id,'ADJUSTMENT',$adjustment->reference,$delta>0?$qty:0,$delta<0?$qty:0,$stock->quantity,(float)$item->unit_cost,$item->reason,$userId);
            }
            $adjustment->update(['status'=>'approved','approved_by'=>$userId,'approved_at'=>now()]);
            $adjustment->load('items');
            $this->accounting->postStockAdjustment($adjustment, (int) $userId);
            return $this->repository->findWithRelations($adjustment);
        });
    }
    private function nextReference():string{return 'ADJ-'.now()->format('Ym').'-'.str_pad((string)((StockAdjustment::max('id')??0)+1),5,'0',STR_PAD_LEFT);}
}
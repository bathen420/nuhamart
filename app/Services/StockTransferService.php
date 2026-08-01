<?php
namespace App\Services;
use App\Models\ProductWarehouseStock;
use App\Models\StockTransfer;
use App\Repositories\StockTransfer\StockTransferRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
class StockTransferService {
    public function __construct(private StockTransferRepositoryInterface $repository,private StockLedgerService $ledger){}
    public function paginate(array $filters=[]){return $this->repository->paginate($filters);}
    public function show(StockTransfer $transfer){return $this->repository->findWithRelations($transfer);}
    public function create(array $data,?int $userId):StockTransfer{return DB::transaction(function()use($data,$userId){
        $transfer=$this->repository->create(['reference'=>$this->nextReference(),'from_warehouse_id'=>$data['from_warehouse_id'],'to_warehouse_id'=>$data['to_warehouse_id'],'transfer_date'=>$data['transfer_date'],'status'=>'draft','note'=>$data['note']??null,'created_by'=>$userId]);
        foreach($data['items'] as $row){$source=ProductWarehouseStock::where(['product_id'=>$row['product_id'],'warehouse_id'=>$data['from_warehouse_id']])->first();$transfer->items()->create(['product_id'=>$row['product_id'],'quantity'=>$row['quantity'],'unit_cost'=>$source?->average_cost??0]);}
        return $this->repository->findWithRelations($transfer);
    });}
    public function dispatch(StockTransfer $transfer,?int $userId):StockTransfer{
        if($transfer->status!=='draft')throw ValidationException::withMessages(['status'=>'Only draft transfers can be dispatched.']);
        return DB::transaction(function()use($transfer,$userId){$transfer->load('items.product');
            foreach($transfer->items as $item){$source=ProductWarehouseStock::query()->lockForUpdate()->firstOrCreate(['product_id'=>$item->product_id,'warehouse_id'=>$transfer->from_warehouse_id],['quantity'=>0,'average_cost'=>0]);
                if($source->quantity<$item->quantity)throw ValidationException::withMessages(['stock'=>"Insufficient stock for {$item->product->name}."]);
                $source->quantity-=$item->quantity;$source->save();$this->ledger->record($item->product_id,$transfer->from_warehouse_id,'TRANSFER_OUT',$transfer->reference,0,$item->quantity,$source->quantity,(float)$item->unit_cost,'Transfer dispatched',$userId);}
            $transfer->update(['status'=>'dispatched','dispatched_by'=>$userId,'dispatched_at'=>now()]);return $this->repository->findWithRelations($transfer);
        });
    }
    public function receive(StockTransfer $transfer,?int $userId):StockTransfer{
        if($transfer->status!=='dispatched')throw ValidationException::withMessages(['status'=>'Only dispatched transfers can be received.']);
        return DB::transaction(function()use($transfer,$userId){$transfer->load('items');
            foreach($transfer->items as $item){$target=ProductWarehouseStock::query()->lockForUpdate()->firstOrCreate(['product_id'=>$item->product_id,'warehouse_id'=>$transfer->to_warehouse_id],['quantity'=>0,'average_cost'=>0]);
                $old=$target->quantity;$new=$old+$item->quantity;$target->average_cost=$new>0?(($old*(float)$target->average_cost)+($item->quantity*(float)$item->unit_cost))/$new:0;$target->quantity=$new;$target->save();
                $this->ledger->record($item->product_id,$transfer->to_warehouse_id,'TRANSFER_IN',$transfer->reference,$item->quantity,0,$new,(float)$item->unit_cost,'Transfer received',$userId);}
            $transfer->update(['status'=>'completed','received_by'=>$userId,'received_at'=>now()]);return $this->repository->findWithRelations($transfer);
        });
    }
    private function nextReference():string{return 'TRF-'.now()->format('Ym').'-'.str_pad((string)((StockTransfer::max('id')??0)+1),5,'0',STR_PAD_LEFT);}
}
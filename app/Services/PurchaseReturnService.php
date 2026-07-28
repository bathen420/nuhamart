<?php
namespace App\Services;
use App\Models\{Product,Purchase,PurchaseItem,PurchaseReturn,StockHistory}; use App\Repositories\PurchaseReturnRepository; use Illuminate\Support\Facades\DB; use Illuminate\Validation\ValidationException;
class PurchaseReturnService {
 public function __construct(protected PurchaseReturnRepository $repository){}
 public function create(Purchase $purchase,array $data,int $userId): PurchaseReturn{return DB::transaction(function()use($purchase,$data,$userId){
  $purchase=Purchase::query()->lockForUpdate()->findOrFail($purchase->id); $rows=collect($data['items'])->filter(fn($r)=>(int)($r['quantity']??0)>0)->values();
  if($rows->isEmpty()) throw ValidationException::withMessages(['items'=>'Select at least one product and enter a return quantity.']);
  $items=PurchaseItem::query()->where('purchase_id',$purchase->id)->whereIn('id',$rows->pluck('purchase_item_id'))->withSum('returnItems as returned_quantity','quantity')->lockForUpdate()->get()->keyBy('id');
  $lines=[];$subtotal=0;
  foreach($rows as $row){$item=$items->get((int)$row['purchase_item_id']); if(!$item) throw ValidationException::withMessages(['items'=>'One or more items do not belong to this purchase.']);
   $available=(int)$item->quantity-(int)($item->returned_quantity??0);$qty=(int)$row['quantity']; if($qty>$available) throw ValidationException::withMessages(['items'=>"Maximum return quantity for this item is {$available}."]);
   $product=Product::query()->lockForUpdate()->findOrFail($item->product_id); if((int)$product->stock_quantity<$qty) throw ValidationException::withMessages(['items'=>"Not enough current stock to return {$product->name}. Available stock: {$product->stock_quantity}."]);
   $lineTotal=round((float)$item->price*$qty,2);$subtotal+=$lineTotal;$lines[]=['purchase_item_id'=>$item->id,'product_id'=>$item->product_id,'quantity'=>$qty,'price'=>$item->price,'subtotal'=>$lineTotal];
  }
  $refund=round(min($subtotal,(float)$purchase->paid_amount),2);$ret=$this->repository->create(['return_number'=>$this->repository->generateReturnNumber(),'purchase_id'=>$purchase->id,'supplier_id'=>$purchase->supplier_id,'user_id'=>$userId,'return_date'=>$data['return_date'],'subtotal'=>$subtotal,'refund_amount'=>$refund,'refund_method'=>$data['refund_method'],'status'=>'completed','reason'=>$data['reason']??null]);
  foreach($lines as $line){$ret->items()->create($line);$product=Product::query()->lockForUpdate()->findOrFail($line['product_id']);$before=(int)$product->stock_quantity;$after=$before-(int)$line['quantity'];$product->update(['stock_quantity'=>$after]);StockHistory::create(['product_id'=>$product->id,'user_id'=>$userId,'type'=>'OUT','quantity'=>$line['quantity'],'stock_before'=>$before,'stock_after'=>$after,'reference'=>$ret->return_number,'note'=>"Purchase return for {$purchase->purchase_number}."]);}
  $newTotal=max(0,round((float)$purchase->total-$subtotal,2));$newPaid=max(0,round((float)$purchase->paid_amount-$refund,2));$newDue=max(0,round($newTotal-$newPaid,2));
  $all=$purchase->items()->withSum('returnItems as returned_quantity','quantity')->get()->every(fn($i)=>(int)$i->returned_quantity>=(int)$i->quantity);
  $purchase->update(['total'=>$newTotal,'paid_amount'=>$newPaid,'due_amount'=>$newDue,'payment_status'=>$newDue<=0?'Paid':($newPaid>0?'Partial':'Due'),'purchase_status'=>$all?'Returned':'Partially Returned']);
  return $ret->load(['purchase','supplier','user:id,name','items.product']);
 });}
}
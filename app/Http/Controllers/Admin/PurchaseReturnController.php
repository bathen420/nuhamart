<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller; use App\Http\Requests\StorePurchaseReturnRequest; use App\Models\{Purchase,PurchaseReturn}; use App\Repositories\PurchaseReturnRepository; use App\Services\PurchaseReturnService; use Illuminate\Http\{RedirectResponse,Request}; use Inertia\{Inertia,Response};
class PurchaseReturnController extends Controller {
 public function __construct(protected PurchaseReturnRepository $repository,protected PurchaseReturnService $service){}
 public function index(Request $request): Response{$filters=$request->only(['search']);return Inertia::render('Admin/PurchaseReturns/Index',['returns'=>$this->repository->paginate($filters),'filters'=>$filters]);}
 public function create(Purchase $purchase): Response{$purchase->load(['supplier','items.product','items.returnItems']);$purchase->items->each(function($i){$i->returned_quantity=(int)$i->returnItems->sum('quantity');$i->returnable_quantity=max(0,(int)$i->quantity-$i->returned_quantity);unset($i->returnItems);});return Inertia::render('Admin/PurchaseReturns/Create',['purchase'=>$purchase,'suggestedReturnDate'=>now()->toDateString()]);}
 public function store(StorePurchaseReturnRequest $request,Purchase $purchase): RedirectResponse{$ret=$this->service->create($purchase,$request->validated(),(int)$request->user()->id);return redirect()->route('admin.purchase-returns.show',$ret)->with('success','Purchase return completed successfully.');}
 public function show(PurchaseReturn $purchaseReturn): Response{return Inertia::render('Admin/PurchaseReturns/Show',['purchaseReturn'=>$purchaseReturn->load(['purchase','supplier','user:id,name','items.product'])]);}
}
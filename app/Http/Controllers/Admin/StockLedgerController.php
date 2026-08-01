<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Warehouse;
use App\Repositories\StockLedger\StockLedgerRepositoryInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;
class StockLedgerController extends Controller {
    public function __construct(private StockLedgerRepositoryInterface $repository){}
    public function index(Request $request){abort_unless(request()->user()->can('stock-ledger.view'), 403);$filters=$request->only('product_id','warehouse_id','movement_type','date_from','date_to');return Inertia::render('Admin/StockLedgers/Index',['entries'=>$this->repository->paginate($filters),'filters'=>$filters,'products'=>Product::orderBy('name')->get(['id','name','sku']),'warehouses'=>Warehouse::orderBy('name')->get(['id','name','code'])]);}
}
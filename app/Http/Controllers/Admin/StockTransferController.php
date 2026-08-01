<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreStockTransferRequest;
use App\Models\Product;
use App\Models\StockTransfer;
use App\Models\Warehouse;
use App\Services\StockTransferService;
use Illuminate\Http\Request;
use Inertia\Inertia;
class StockTransferController extends Controller {
    public function __construct(private StockTransferService $service){}
    public function index(Request $request){abort_unless(request()->user()->can('stock-transfers.view'), 403);return Inertia::render('Admin/StockTransfers/Index',['transfers'=>$this->service->paginate($request->only('search','status')),'filters'=>$request->only('search','status')]);}
    public function create(){ abort_unless(request()->user()->can('stock-transfers.create'), 403);return Inertia::render('Admin/StockTransfers/Create',['warehouses'=>Warehouse::where('status',true)->orderBy('name')->get(['id','name','code']),'products'=>Product::orderBy('name')->get(['id','name','sku'])]);}
    public function store(StoreStockTransferRequest $request){$transfer=$this->service->create($request->validated(),$request->user()->id);return redirect()->route('admin.stock-transfers.show',$transfer)->with('success','Stock transfer created as draft.');}
    public function show(StockTransfer $stockTransfer){abort_unless(request()->user()->can('stock-transfers.view'), 403);return Inertia::render('Admin/StockTransfers/Show',['transfer'=>$this->service->show($stockTransfer)]);}
    public function dispatch(Request $request,StockTransfer $stockTransfer){abort_unless(request()->user()->can('stock-transfers.dispatch'), 403);$this->service->dispatch($stockTransfer,$request->user()->id);return back()->with('success','Transfer dispatched and source stock deducted.');}
    public function receive(Request $request,StockTransfer $stockTransfer){abort_unless(request()->user()->can('stock-transfers.receive'), 403);$this->service->receive($stockTransfer,$request->user()->id);return back()->with('success','Transfer received and destination stock updated.');}
}
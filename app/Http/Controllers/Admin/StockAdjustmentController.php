<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreStockAdjustmentRequest;
use App\Models\Product;
use App\Models\StockAdjustment;
use App\Models\Warehouse;
use App\Services\StockAdjustmentService;
use Illuminate\Http\Request;
use Inertia\Inertia;
class StockAdjustmentController extends Controller {
    public function __construct(private StockAdjustmentService $service){}
    public function index(Request $request){abort_unless(request()->user()->can('stock-adjustments.view'), 403);return Inertia::render('Admin/StockAdjustments/Index',['adjustments'=>$this->service->paginate($request->only('search','status')),'filters'=>$request->only('search','status')]);}
    public function create(){ abort_unless(request()->user()->can('stock-adjustments.create'), 403); return Inertia::render('Admin/StockAdjustments/Create',['warehouses'=>Warehouse::where('status',true)->orderBy('name')->get(['id','name','code']),'products'=>Product::orderBy('name')->get(['id','name','sku','stock_quantity'])]);}
    public function store(StoreStockAdjustmentRequest $request){$adjustment=$this->service->create($request->validated(),$request->user()->id);return redirect()->route('admin.stock-adjustments.show',$adjustment)->with('success','Stock adjustment created as draft.');}
    public function show(StockAdjustment $stockAdjustment){abort_unless(request()->user()->can('stock-adjustments.view'), 403);return Inertia::render('Admin/StockAdjustments/Show',['adjustment'=>$this->service->show($stockAdjustment)]);}
    public function approve(Request $request,StockAdjustment $stockAdjustment){abort_unless(request()->user()->can('stock-adjustments.approve'), 403);$this->service->approve($stockAdjustment,$request->user()->id);return back()->with('success','Stock adjustment approved and inventory updated.');}
}
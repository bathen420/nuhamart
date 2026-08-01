<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreOpeningStockRequest;
use App\Models\OpeningStock;
use App\Models\Product;
use App\Models\Warehouse;
use App\Services\OpeningStockService;
use Illuminate\Http\Request;
use Inertia\Inertia;
class OpeningStockController extends Controller {
    public function __construct(private OpeningStockService $service) {}
    public function index(Request $request){ $filters=$request->only('search','warehouse_id'); return Inertia::render('Admin/OpeningStocks/Index',['openingStocks'=>$this->service->paginate($filters),'warehouses'=>Warehouse::where('status',true)->orderBy('name')->get(['id','name','code']),'filters'=>$filters]); }
    public function create(){ return Inertia::render('Admin/OpeningStocks/Create',['warehouses'=>Warehouse::where('status',true)->orderByDesc('is_default')->orderBy('name')->get(['id','name','code','is_default']),'products'=>Product::where('status',true)->orderBy('name')->get(['id','name','sku','stock_quantity'])]); }
    public function store(StoreOpeningStockRequest $request){ $opening=$this->service->create($request->validated(),$request->user()?->id); return redirect()->route('admin.opening-stocks.show',$opening)->with('success','Opening stock created successfully.'); }
    public function show(OpeningStock $openingStock){ return Inertia::render('Admin/OpeningStocks/Show',['openingStock'=>$this->service->show($openingStock)]); }
}

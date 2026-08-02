<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Http\Requests\AdjustCustomerPointsRequest;
use App\Http\Requests\AdjustCustomerWalletRequest;
use App\Http\Requests\StoreCrmNoteRequest;
use App\Models\Customer;
use App\Models\CustomerCrmProfile;
use App\Services\CrmLoyaltyService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
class CrmController extends Controller
{
 public function __construct(protected CrmLoyaltyService $crm){}
 public function index(Request $request):Response{$search=trim((string)$request->input('search',''));$customers=Customer::query()->with(['crmProfile.tier'])->withCount('sales')->withSum('sales as lifetime_value','total')->when($search,fn($q)=>$q->where(fn($x)=>$x->where('name','like',"%{$search}%")->orWhere('phone','like',"%{$search}%")->orWhere('customer_code','like',"%{$search}%")))->latest()->paginate(15)->withQueryString();return Inertia::render('Admin/CRM/Index',['customers'=>$customers,'filters'=>['search'=>$search],'summary'=>['customers'=>Customer::count(),'members'=>CustomerCrmProfile::count(),'points'=>(int)CustomerCrmProfile::sum('points_balance'),'wallet'=>(float)CustomerCrmProfile::sum('wallet_balance')]]);}
 public function show(Customer $customer):Response{$profile=$this->crm->profile($customer);$customer->load(['sales'=>fn($q)=>$q->latest()->limit(20),'crmProfile.tier']);return Inertia::render('Admin/CRM/Show',['customer'=>$customer,'profile'=>$profile->load('tier'),'loyaltyTransactions'=>$customer->loyaltyTransactions()->latest()->limit(30)->get(),'walletTransactions'=>$customer->walletTransactions()->latest()->limit(30)->get(),'timeline'=>$customer->crmTimeline()->latest()->limit(50)->get(),'metrics'=>['lifetime_value'=>(float)$customer->sales()->sum('total'),'orders'=>$customer->sales()->count(),'average_order'=>(float)$customer->sales()->avg('total'),'total_due'=>(float)$customer->sales()->sum('due_amount')]]);}
 public function points(AdjustCustomerPointsRequest $request,Customer $customer):RedirectResponse{$this->crm->adjustPoints($customer,(int)$request->validated('points'),$request->validated('note'),$request->user()?->id);return back()->with('success','Loyalty points updated.');}
 public function wallet(AdjustCustomerWalletRequest $request,Customer $customer):RedirectResponse{$this->crm->adjustWallet($customer,(float)$request->validated('amount'),$request->validated('type'),$request->validated('note'),$request->user()?->id);return back()->with('success','Customer wallet updated.');}
 public function note(StoreCrmNoteRequest $request,Customer $customer):RedirectResponse{$this->crm->timeline($customer,'note',$request->validated('title'),$request->validated('description'),null,null,$request->user()?->id);return back()->with('success','CRM note added.');}
}

<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreJournalEntryRequest;
use App\Models\Account;
use App\Models\JournalEntry;
use App\Services\AccountingService;
use Illuminate\Http\Request;
use Inertia\Inertia;
class JournalEntryController extends Controller {
 public function __construct(private AccountingService $service){}
 public function index(Request $r){$this->authorize('journals.view');$entries=JournalEntry::with('creator:id,name')->withSum('lines as total_debit','debit')->withSum('lines as total_credit','credit')->when($r->search,fn($q,$s)=>$q->where(fn($x)=>$x->where('entry_number','like',"%$s%")->orWhere('reference','like',"%$s%")))->latest('entry_date')->latest('id')->paginate(20)->withQueryString();return Inertia::render('Admin/Journals/Index',['entries'=>$entries,'filters'=>$r->only('search')]);}
 public function create(){ $this->authorize('journals.create'); return Inertia::render('Admin/Journals/Create',['accounts'=>Account::where('is_active',true)->orderBy('code')->get(['id','code','name','type']),'suggestedDate'=>now()->toDateString()]); }
 public function store(StoreJournalEntryRequest $r){$entry=$this->service->createJournal($r->validated(),(int)$r->user()->id);return redirect()->route('admin.journals.show',$entry)->with('success','Journal entry posted.');}
 public function show(JournalEntry $journal){$this->authorize('journals.view');return Inertia::render('Admin/Journals/Show',['entry'=>$journal->load(['lines.account','creator:id,name'])]);}
}

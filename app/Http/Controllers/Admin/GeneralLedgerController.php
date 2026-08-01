<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\JournalLine;
use Illuminate\Http\Request;
use Inertia\Inertia;
class GeneralLedgerController extends Controller {
 public function index(Request $r){$this->authorize('ledger.view');$account=$r->account_id?Account::find($r->account_id):null;$lines=JournalLine::with(['journalEntry:id,entry_number,entry_date,reference,description','account:id,code,name'])->when($account,fn($q)=>$q->where('account_id',$account->id))->when($r->date_from,fn($q,$d)=>$q->whereHas('journalEntry',fn($x)=>$x->whereDate('entry_date','>=',$d)))->when($r->date_to,fn($q,$d)=>$q->whereHas('journalEntry',fn($x)=>$x->whereDate('entry_date','<=',$d)))->orderBy('journal_entry_id')->paginate(50)->withQueryString();return Inertia::render('Admin/Accounts/Ledger',['accounts'=>Account::where('is_active',true)->orderBy('code')->get(['id','code','name']),'selectedAccount'=>$account,'lines'=>$lines,'filters'=>$r->only('account_id','date_from','date_to')]);}
}

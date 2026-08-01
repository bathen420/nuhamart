<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAccountRequest;
use App\Http\Requests\UpdateAccountRequest;
use App\Models\Account;
use Illuminate\Http\Request;
use Inertia\Inertia;
class AccountController extends Controller {
 public function index(Request $r){$this->authorize('accounts.view');$q=Account::with('parent:id,code,name')->withSum('journalLines as debit_total','debit')->withSum('journalLines as credit_total','credit')->when($r->search,fn($q,$s)=>$q->where(fn($x)=>$x->where('code','like',"%$s%")->orWhere('name','like',"%$s%")))->orderBy('code')->paginate(20)->withQueryString();return Inertia::render('Admin/Accounts/Index',['accounts'=>$q,'filters'=>$r->only('search')]);}
 public function create(){ $this->authorize('accounts.create'); return Inertia::render('Admin/Accounts/Form',['account'=>null,'parents'=>Account::orderBy('code')->get(['id','code','name','type'])]); }
 public function store(StoreAccountRequest $r){Account::create($r->validated());return redirect()->route('admin.accounts.index')->with('success','Account created.');}
 public function edit(Account $account){$this->authorize('accounts.edit');return Inertia::render('Admin/Accounts/Form',['account'=>$account,'parents'=>Account::whereKeyNot($account->id)->orderBy('code')->get(['id','code','name','type'])]);}
 public function update(UpdateAccountRequest $r,Account $account){$account->update($r->validated());return redirect()->route('admin.accounts.index')->with('success','Account updated.');}
 public function destroy(Account $account){$this->authorize('accounts.delete');if($account->journalLines()->exists()||$account->children()->exists())return back()->with('error','Account with transactions or child accounts cannot be deleted.');$account->delete();return back()->with('success','Account deleted.');}
}

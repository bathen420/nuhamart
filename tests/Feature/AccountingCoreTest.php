<?php
namespace Tests\Feature;
use App\Models\Account;
use App\Models\User;
use App\Services\AccountingService;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
class AccountingCoreTest extends TestCase { use RefreshDatabase; public function test_accounting_routes_are_registered(): void { $this->assertTrue(\Route::has('admin.accounts.index'));$this->assertTrue(\Route::has('admin.journals.index'));$this->assertTrue(\Route::has('admin.ledger.index')); } public function test_balanced_journal_entry_is_created(): void { $this->seed(RolesAndPermissionsSeeder::class);$u=User::first();$cash=Account::create(['code'=>'1100','name'=>'Cash','type'=>'asset','is_active'=>true]);$capital=Account::create(['code'=>'3100','name'=>'Capital','type'=>'equity','is_active'=>true]);$entry=app(AccountingService::class)->createJournal(['entry_date'=>now()->toDateString(),'description'=>'Opening capital','lines'=>[['account_id'=>$cash->id,'debit'=>1000,'credit'=>0],['account_id'=>$capital->id,'debit'=>0,'credit'=>1000]]],$u->id);$this->assertEquals(1000.00,(float)$entry->lines->sum('debit'));$this->assertEquals(1000.00,(float)$entry->lines->sum('credit')); } }

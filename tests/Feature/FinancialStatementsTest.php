<?php

namespace Tests\Feature;

use App\Models\Account;
use App\Models\JournalEntry;
use App\Models\User;
use App\Services\FinancialStatementService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class FinancialStatementsTest extends TestCase
{
    use RefreshDatabase;

    public function test_financial_statement_routes_are_registered(): void
    {
        foreach (['admin.financial-statements.dashboard','admin.financial-statements.trial-balance','admin.financial-statements.profit-loss','admin.financial-statements.balance-sheet','admin.financial-statements.cash-flow','admin.financial-statements.export'] as $name) {
            $this->assertTrue(app('router')->has($name), "Missing route {$name}");
        }
    }

    public function test_trial_balance_and_profit_loss_are_balanced(): void
    {
        $cash = Account::create(['code'=>'1100','name'=>'Cash','type'=>'asset','is_cash'=>true]);
        $sales = Account::create(['code'=>'4100','name'=>'Sales Revenue','type'=>'income']);
        $expense = Account::create(['code'=>'5100','name'=>'Office Expense','type'=>'expense']);
        $entry = JournalEntry::create(['entry_number'=>'JV-TEST-1','entry_date'=>now()->toDateString(),'status'=>'posted']);
        $entry->lines()->createMany([
            ['account_id'=>$cash->id,'debit'=>1000,'credit'=>0],
            ['account_id'=>$sales->id,'debit'=>0,'credit'=>1000],
        ]);
        $entry2 = JournalEntry::create(['entry_number'=>'JV-TEST-2','entry_date'=>now()->toDateString(),'status'=>'posted']);
        $entry2->lines()->createMany([
            ['account_id'=>$expense->id,'debit'=>200,'credit'=>0],
            ['account_id'=>$cash->id,'debit'=>0,'credit'=>200],
        ]);

        $service = app(FinancialStatementService::class);
        $trial = $service->trialBalance(now()->toDateString(), now()->toDateString());
        $profit = $service->profitLoss(now()->toDateString(), now()->toDateString());

        $this->assertEquals($trial['totals']['closing_debit'], $trial['totals']['closing_credit']);
        $this->assertEquals(800.0, $profit['summary']['net_profit']);
    }
}

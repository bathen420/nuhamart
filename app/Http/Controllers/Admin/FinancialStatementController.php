<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\FinancialStatementService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class FinancialStatementController extends Controller
{
    public function __construct(private readonly FinancialStatementService $service) {}

    public function dashboard(Request $request): Response
    {
        return Inertia::render('Admin/FinancialStatements/Dashboard', $this->service->dashboard($request->date_from, $request->date_to));
    }

    public function trialBalance(Request $request): Response
    {
        return Inertia::render('Admin/FinancialStatements/TrialBalance', $this->service->trialBalance($request->date_from, $request->date_to));
    }

    public function profitLoss(Request $request): Response
    {
        return Inertia::render('Admin/FinancialStatements/ProfitLoss', $this->service->profitLoss($request->date_from, $request->date_to));
    }

    public function balanceSheet(Request $request): Response
    {
        return Inertia::render('Admin/FinancialStatements/BalanceSheet', $this->service->balanceSheet($request->as_of));
    }

    public function cashFlow(Request $request): Response
    {
        return Inertia::render('Admin/FinancialStatements/CashFlow', $this->service->cashFlow($request->date_from, $request->date_to));
    }

    public function export(Request $request, string $statement): StreamedResponse
    {
        abort_unless(in_array($statement, ['trial-balance','profit-loss','balance-sheet','cash-flow'], true), 404);
        $data = match ($statement) {
            'trial-balance' => $this->service->trialBalance($request->date_from, $request->date_to),
            'profit-loss' => $this->service->profitLoss($request->date_from, $request->date_to),
            'balance-sheet' => $this->service->balanceSheet($request->as_of),
            'cash-flow' => $this->service->cashFlow($request->date_from, $request->date_to),
        };

        return response()->streamDownload(function () use ($statement, $data) {
            $out = fopen('php://output', 'w');
            fwrite($out, "\xEF\xBB\xBF");
            match ($statement) {
                'trial-balance' => $this->writeTrialBalance($out, $data),
                'profit-loss' => $this->writeProfitLoss($out, $data),
                'balance-sheet' => $this->writeBalanceSheet($out, $data),
                'cash-flow' => $this->writeCashFlow($out, $data),
            };
            fclose($out);
        }, $statement.'-'.now()->format('Ymd-His').'.csv', ['Content-Type' => 'text/csv; charset=UTF-8']);
    }

    private function writeTrialBalance($out, array $data): void
    {
        fputcsv($out, ['Code','Account','Type','Opening Debit','Opening Credit','Period Debit','Period Credit','Closing Debit','Closing Credit']);
        foreach ($data['rows'] as $r) fputcsv($out, [$r['code'],$r['name'],$r['type'],$r['opening_debit'],$r['opening_credit'],$r['period_debit'],$r['period_credit'],$r['closing_debit'],$r['closing_credit']]);
        $t = $data['totals']; fputcsv($out, ['','TOTAL','',$t['opening_debit'],$t['opening_credit'],$t['period_debit'],$t['period_credit'],$t['closing_debit'],$t['closing_credit']]);
    }
    private function writeProfitLoss($out, array $data): void
    {
        fputcsv($out, ['Section','Code','Account','Amount']);
        foreach ($data['income'] as $r) fputcsv($out, ['Income',$r['code'],$r['name'],$r['amount']]);
        foreach ($data['expenses'] as $r) fputcsv($out, ['Expense',$r['code'],$r['name'],$r['amount']]);
        foreach ($data['summary'] as $k => $v) fputcsv($out, ['Summary','',str_replace('_',' ',ucwords($k,'_')),$v]);
    }
    private function writeBalanceSheet($out, array $data): void
    {
        fputcsv($out, ['Section','Code','Account','Amount']);
        foreach (['assets','liabilities','equity'] as $section) foreach ($data[$section] as $r) fputcsv($out, [ucfirst($section),$r['code'],$r['name'],$r['amount']]);
        foreach ($data['summary'] as $k => $v) fputcsv($out, ['Summary','',str_replace('_',' ',ucwords($k,'_')),$v]);
    }
    private function writeCashFlow($out, array $data): void
    {
        fputcsv($out, ['Section','Date','Entry','Reference','Description','Account','Inflow','Outflow','Net']);
        foreach (['operating','investing','financing'] as $section) foreach ($data[$section] as $r) fputcsv($out, [ucfirst($section),$r['date'],$r['entry_number'],$r['reference'],$r['description'],$r['account'],$r['inflow'],$r['outflow'],$r['net']]);
        foreach ($data['summary'] as $k => $v) fputcsv($out, ['Summary','','','',str_replace('_',' ',ucwords($k,'_')),'','','',$v]);
    }
}

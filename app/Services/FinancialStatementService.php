<?php

namespace App\Services;

use App\Models\Account;
use App\Models\JournalLine;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class FinancialStatementService
{
    public function dashboard(?string $dateFrom, ?string $dateTo): array
    {
        [$from, $to] = $this->dates($dateFrom, $dateTo);
        $profitLoss = $this->profitLoss($from->toDateString(), $to->toDateString());
        $cashFlow = $this->cashFlow($from->toDateString(), $to->toDateString());
        $balanceSheet = $this->balanceSheet($to->toDateString());

        $periodExpression = DB::connection()->getDriverName() === 'sqlite'
            ? "strftime('%Y-%m', journal_entries.entry_date)"
            : "DATE_FORMAT(journal_entries.entry_date, '%Y-%m')";

        $monthly = JournalLine::query()
            ->selectRaw("{$periodExpression} as period")
            ->selectRaw("SUM(CASE WHEN accounts.type = 'income' THEN journal_lines.credit - journal_lines.debit ELSE 0 END) as income")
            ->selectRaw("SUM(CASE WHEN accounts.type = 'expense' THEN journal_lines.debit - journal_lines.credit ELSE 0 END) as expense")
            ->join('journal_entries', 'journal_entries.id', '=', 'journal_lines.journal_entry_id')
            ->join('accounts', 'accounts.id', '=', 'journal_lines.account_id')
            ->where('journal_entries.status', 'posted')
            ->whereDate('journal_entries.entry_date', '>=', $from->copy()->startOfYear()->toDateString())
            ->whereDate('journal_entries.entry_date', '<=', $to->toDateString())
            ->groupBy('period')
            ->orderBy('period')
            ->get()
            ->map(fn ($row) => [
                'period' => $row->period,
                'income' => round((float) $row->income, 2),
                'expense' => round((float) $row->expense, 2),
                'profit' => round((float) $row->income - (float) $row->expense, 2),
            ])->values()->all();

        return [
            'filters' => ['date_from' => $from->toDateString(), 'date_to' => $to->toDateString()],
            'cards' => [
                'net_revenue' => $profitLoss['summary']['net_revenue'],
                'total_expenses' => $profitLoss['summary']['total_expenses'],
                'net_profit' => $profitLoss['summary']['net_profit'],
                'cash_and_bank' => $balanceSheet['summary']['cash_and_bank'],
                'receivables' => $balanceSheet['summary']['receivables'],
                'payables' => $balanceSheet['summary']['payables'],
                'net_cash_change' => $cashFlow['summary']['net_change'],
            ],
            'monthly' => $monthly,
        ];
    }

    public function trialBalance(?string $dateFrom, ?string $dateTo): array
    {
        [$from, $to] = $this->dates($dateFrom, $dateTo);
        $accounts = Account::query()->where('is_active', true)->orderBy('code')->get();
        $movements = $this->movementMap($from, $to);

        $rows = $accounts->map(function (Account $account) use ($movements) {
            $movement = $movements->get($account->id, ['debit' => 0, 'credit' => 0]);
            $openingDebit = $account->opening_balance_type === 'debit' ? (float) $account->opening_balance : 0;
            $openingCredit = $account->opening_balance_type === 'credit' ? (float) $account->opening_balance : 0;
            $net = $openingDebit + (float) $movement['debit'] - $openingCredit - (float) $movement['credit'];

            return [
                'id' => $account->id,
                'code' => $account->code,
                'name' => $account->name,
                'type' => $account->type,
                'opening_debit' => round($openingDebit, 2),
                'opening_credit' => round($openingCredit, 2),
                'period_debit' => round((float) $movement['debit'], 2),
                'period_credit' => round((float) $movement['credit'], 2),
                'closing_debit' => round(max($net, 0), 2),
                'closing_credit' => round(max(-$net, 0), 2),
            ];
        })->filter(fn (array $row) => collect($row)->only(['opening_debit','opening_credit','period_debit','period_credit','closing_debit','closing_credit'])->sum() > 0)->values();

        return [
            'filters' => ['date_from' => $from->toDateString(), 'date_to' => $to->toDateString()],
            'rows' => $rows,
            'totals' => [
                'opening_debit' => round($rows->sum('opening_debit'), 2),
                'opening_credit' => round($rows->sum('opening_credit'), 2),
                'period_debit' => round($rows->sum('period_debit'), 2),
                'period_credit' => round($rows->sum('period_credit'), 2),
                'closing_debit' => round($rows->sum('closing_debit'), 2),
                'closing_credit' => round($rows->sum('closing_credit'), 2),
            ],
        ];
    }

    public function profitLoss(?string $dateFrom, ?string $dateTo): array
    {
        [$from, $to] = $this->dates($dateFrom, $dateTo);
        $accounts = Account::query()->whereIn('type', ['income', 'expense'])->where('is_active', true)->orderBy('code')->get();
        $movements = $this->movementMap($from, $to);
        $income = collect();
        $expenses = collect();

        foreach ($accounts as $account) {
            $movement = $movements->get($account->id, ['debit' => 0, 'credit' => 0]);
            $amount = $account->type === 'income'
                ? (float) $movement['credit'] - (float) $movement['debit']
                : (float) $movement['debit'] - (float) $movement['credit'];
            if (abs($amount) < 0.005) continue;
            $row = ['code' => $account->code, 'name' => $account->name, 'amount' => round($amount, 2)];
            ($account->type === 'income' ? $income : $expenses)->push($row);
        }

        $grossIncome = round($income->filter(fn ($r) => ! $this->isContraIncome($r['code'], $r['name']))->sum('amount'), 2);
        $returns = round(abs($income->filter(fn ($r) => $this->isContraIncome($r['code'], $r['name']))->sum('amount')), 2);
        $netRevenue = round($grossIncome - $returns, 2);
        $totalExpenses = round($expenses->sum('amount'), 2);

        return [
            'filters' => ['date_from' => $from->toDateString(), 'date_to' => $to->toDateString()],
            'income' => $income->values(),
            'expenses' => $expenses->values(),
            'summary' => [
                'gross_income' => $grossIncome,
                'sales_returns' => $returns,
                'net_revenue' => $netRevenue,
                'total_expenses' => $totalExpenses,
                'net_profit' => round($netRevenue - $totalExpenses, 2),
            ],
        ];
    }

    public function balanceSheet(?string $asOf): array
    {
        $to = $asOf ? Carbon::parse($asOf)->endOfDay() : now()->endOfDay();
        $from = Carbon::create(1900, 1, 1)->startOfDay();
        $accounts = Account::query()->whereIn('type', ['asset','liability','equity'])->where('is_active', true)->orderBy('code')->get();
        $movements = $this->movementMap($from, $to);
        $groups = ['assets' => collect(), 'liabilities' => collect(), 'equity' => collect()];

        foreach ($accounts as $account) {
            $movement = $movements->get($account->id, ['debit' => 0, 'credit' => 0]);
            $openingSigned = (float) $account->opening_balance * ($account->opening_balance_type === 'credit' ? -1 : 1);
            $signed = $openingSigned + (float) $movement['debit'] - (float) $movement['credit'];
            $amount = $account->type === 'asset' ? $signed : -$signed;
            if (abs($amount) < 0.005) continue;
            $groups[$account->type === 'asset' ? 'assets' : ($account->type === 'liability' ? 'liabilities' : 'equity')]->push([
                'code' => $account->code,
                'name' => $account->name,
                'amount' => round($amount, 2),
                'is_cash' => (bool) $account->is_cash,
                'is_bank' => (bool) $account->is_bank,
            ]);
        }

        $allTimeProfit = $this->profitLoss($from->toDateString(), $to->toDateString())['summary']['net_profit'];
        if (abs($allTimeProfit) >= 0.005) {
            $groups['equity']->push(['code' => 'RE', 'name' => 'Retained Earnings / Current Profit', 'amount' => $allTimeProfit, 'is_cash' => false, 'is_bank' => false]);
        }

        $totalAssets = round($groups['assets']->sum('amount'), 2);
        $totalLiabilities = round($groups['liabilities']->sum('amount'), 2);
        $totalEquity = round($groups['equity']->sum('amount'), 2);

        return [
            'filters' => ['as_of' => $to->toDateString()],
            'assets' => $groups['assets']->values(),
            'liabilities' => $groups['liabilities']->values(),
            'equity' => $groups['equity']->values(),
            'summary' => [
                'total_assets' => $totalAssets,
                'total_liabilities' => $totalLiabilities,
                'total_equity' => $totalEquity,
                'liabilities_and_equity' => round($totalLiabilities + $totalEquity, 2),
                'difference' => round($totalAssets - $totalLiabilities - $totalEquity, 2),
                'cash_and_bank' => round($groups['assets']->filter(fn ($r) => $r['is_cash'] || $r['is_bank'])->sum('amount'), 2),
                'receivables' => round($groups['assets']->filter(fn ($r) => str_contains(strtolower($r['name']), 'receivable'))->sum('amount'), 2),
                'payables' => round($groups['liabilities']->filter(fn ($r) => str_contains(strtolower($r['name']), 'payable'))->sum('amount'), 2),
            ],
        ];
    }

    public function cashFlow(?string $dateFrom, ?string $dateTo): array
    {
        [$from, $to] = $this->dates($dateFrom, $dateTo);
        $cashAccountIds = Account::query()->where(fn (Builder $q) => $q->where('is_cash', true)->orWhere('is_bank', true))->pluck('id');
        $lines = JournalLine::query()
            ->with(['journalEntry:id,entry_number,entry_date,reference,source_type,description', 'account:id,code,name'])
            ->whereIn('account_id', $cashAccountIds)
            ->whereHas('journalEntry', fn (Builder $q) => $q
                ->where('status', 'posted')
                ->whereDate('entry_date', '>=', $from->toDateString())
                ->whereDate('entry_date', '<=', $to->toDateString()))
            ->get();

        $sections = ['operating' => collect(), 'investing' => collect(), 'financing' => collect()];
        foreach ($lines as $line) {
            $amount = round((float) $line->debit - (float) $line->credit, 2);
            if (abs($amount) < 0.005) continue;
            $section = $this->cashFlowSection((string) $line->journalEntry?->source_type, (string) $line->journalEntry?->description);
            $sections[$section]->push([
                'date' => optional($line->journalEntry?->entry_date)->toDateString(),
                'entry_number' => $line->journalEntry?->entry_number,
                'reference' => $line->journalEntry?->reference,
                'description' => $line->journalEntry?->description,
                'account' => $line->account?->name,
                'inflow' => max($amount, 0),
                'outflow' => max(-$amount, 0),
                'net' => $amount,
            ]);
        }

        $opening = $this->cashBalanceBefore($from);
        $operating = round($sections['operating']->sum('net'), 2);
        $investing = round($sections['investing']->sum('net'), 2);
        $financing = round($sections['financing']->sum('net'), 2);
        $net = round($operating + $investing + $financing, 2);

        return [
            'filters' => ['date_from' => $from->toDateString(), 'date_to' => $to->toDateString()],
            'operating' => $sections['operating']->values(),
            'investing' => $sections['investing']->values(),
            'financing' => $sections['financing']->values(),
            'summary' => [
                'opening_cash' => $opening,
                'operating' => $operating,
                'investing' => $investing,
                'financing' => $financing,
                'net_change' => $net,
                'closing_cash' => round($opening + $net, 2),
            ],
        ];
    }

    private function movementMap(Carbon $from, Carbon $to): Collection
    {
        return JournalLine::query()
            ->select('journal_lines.account_id')
            ->selectRaw('SUM(journal_lines.debit) as debit')
            ->selectRaw('SUM(journal_lines.credit) as credit')
            ->join('journal_entries', 'journal_entries.id', '=', 'journal_lines.journal_entry_id')
            ->where('journal_entries.status', 'posted')
            ->whereDate('journal_entries.entry_date', '>=', $from->toDateString())
            ->whereDate('journal_entries.entry_date', '<=', $to->toDateString())
            ->groupBy('journal_lines.account_id')
            ->get()->keyBy('account_id')->map(fn ($row) => ['debit' => (float) $row->debit, 'credit' => (float) $row->credit]);
    }

    private function dates(?string $dateFrom, ?string $dateTo): array
    {
        $to = $dateTo ? Carbon::parse($dateTo)->endOfDay() : now()->endOfDay();
        $from = $dateFrom ? Carbon::parse($dateFrom)->startOfDay() : $to->copy()->startOfMonth();
        if ($from->greaterThan($to)) [$from, $to] = [$to->copy()->startOfDay(), $from->copy()->endOfDay()];
        return [$from, $to];
    }

    private function isContraIncome(string $code, string $name): bool
    {
        return str_starts_with($code, '42') || str_contains(strtolower($name), 'return');
    }

    private function cashFlowSection(string $sourceType, string $description): string
    {
        $text = strtolower($sourceType.' '.$description);
        if (str_contains($text, 'capital') || str_contains($text, 'loan') || str_contains($text, 'equity')) return 'financing';
        if (str_contains($text, 'fixed asset') || str_contains($text, 'equipment') || str_contains($text, 'investment')) return 'investing';
        return 'operating';
    }

    private function cashBalanceBefore(Carbon $from): float
    {
        $accounts = Account::query()->where(fn (Builder $q) => $q->where('is_cash', true)->orWhere('is_bank', true))->get();
        $opening = $accounts->sum(fn (Account $a) => (float) $a->opening_balance * ($a->opening_balance_type === 'credit' ? -1 : 1));
        $movement = JournalLine::query()
            ->join('journal_entries', 'journal_entries.id', '=', 'journal_lines.journal_entry_id')
            ->whereIn('journal_lines.account_id', $accounts->pluck('id'))
            ->where('journal_entries.status', 'posted')
            ->whereDate('journal_entries.entry_date', '<', $from->toDateString())
            ->selectRaw('COALESCE(SUM(journal_lines.debit - journal_lines.credit), 0) as net')->value('net');
        return round((float) $opening + (float) $movement, 2);
    }
}

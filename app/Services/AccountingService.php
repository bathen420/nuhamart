<?php

namespace App\Services;

use App\Models\Account;
use App\Models\JournalEntry;
use App\Models\OpeningStock;
use App\Models\Purchase;
use App\Models\PurchaseReturn;
use App\Models\Sale;
use App\Models\SaleReturn;
use App\Models\StockAdjustment;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AccountingService
{
    public const CASH = '1100';
    public const BANK = '1200';
    public const RECEIVABLE = '1300';
    public const INVENTORY = '1400';
    public const PAYABLE = '2100';
    public const OPENING_CAPITAL = '3200';
    public const SALES_REVENUE = '4100';
    public const SALES_RETURNS = '4200';
    public const INVENTORY_GAIN = '4300';
    public const INVENTORY_LOSS = '5300';

    public function createJournal(array $data, int $userId): JournalEntry
    {
        return DB::transaction(function () use ($data, $userId): JournalEntry {
            $lines = collect($data['lines'] ?? [])
                ->map(function (array $line): array {
                    return [
                        'account_id' => (int) $line['account_id'],
                        'debit' => round((float) ($line['debit'] ?? 0), 2),
                        'credit' => round((float) ($line['credit'] ?? 0), 2),
                        'memo' => $line['memo'] ?? null,
                    ];
                })
                ->filter(fn (array $line): bool => $line['debit'] > 0 || $line['credit'] > 0)
                ->values();

            $this->validateBalancedLines($lines->all());

            if (! empty($data['source_type']) && ! empty($data['source_id'])) {
                $existing = JournalEntry::query()
                    ->where('source_type', $data['source_type'])
                    ->where('source_id', $data['source_id'])
                    ->first();

                if ($existing) {
                    return $existing->load(['lines.account', 'creator:id,name']);
                }
            }

            $entry = JournalEntry::create([
                'entry_number' => $this->nextNumber(),
                'entry_date' => $data['entry_date'],
                'reference' => $data['reference'] ?? null,
                'source_type' => $data['source_type'] ?? null,
                'source_id' => $data['source_id'] ?? null,
                'description' => $data['description'] ?? null,
                'status' => 'posted',
                'created_by' => $userId,
            ]);

            $entry->lines()->createMany($lines->all());

            return $entry->load(['lines.account', 'creator:id,name']);
        });
    }

    public function postSale(Sale $sale, int $userId): ?JournalEntry
    {
        $lines = [];
        $this->appendDebit($lines, $this->settlementAccountCode($sale->payment_method), (float) $sale->paid_amount, 'Payment received');
        $this->appendDebit($lines, self::RECEIVABLE, (float) $sale->due_amount, 'Customer receivable');
        $this->appendCredit($lines, self::SALES_REVENUE, (float) $sale->total, 'Sales revenue');

        return $this->postModel($sale, $sale->created_at?->toDateString() ?? now()->toDateString(), $sale->sale_number, "Sale {$sale->sale_number}", $lines, $userId);
    }

    public function postPurchase(Purchase $purchase, int $userId): ?JournalEntry
    {
        $lines = [];
        $this->appendDebit($lines, self::INVENTORY, (float) $purchase->total, 'Inventory purchased');
        $this->appendCredit($lines, $this->settlementAccountCode($purchase->payment_method), (float) $purchase->paid_amount, 'Purchase payment');
        $this->appendCredit($lines, self::PAYABLE, (float) $purchase->due_amount, 'Supplier payable');

        return $this->postModel($purchase, $purchase->purchase_date?->toDateString() ?? now()->toDateString(), $purchase->purchase_number, "Purchase {$purchase->purchase_number}", $lines, $userId);
    }

    public function postPurchasePayment(Purchase $purchase, Model $payment, int $userId): ?JournalEntry
    {
        $amount = (float) $payment->amount;
        $lines = [];
        $this->appendDebit($lines, self::PAYABLE, $amount, 'Supplier payable settled');
        $this->appendCredit($lines, $this->settlementAccountCode($payment->payment_method), $amount, 'Supplier payment');

        return $this->postModel($payment, $payment->payment_date?->toDateString() ?? now()->toDateString(), $payment->reference ?: $purchase->purchase_number, "Payment for {$purchase->purchase_number}", $lines, $userId);
    }

    public function postSaleReturn(SaleReturn $saleReturn, int $userId): ?JournalEntry
    {
        $subtotal = (float) $saleReturn->subtotal;
        $refund = min($subtotal, (float) $saleReturn->refund_amount);
        $receivableReduction = max(0, round($subtotal - $refund, 2));
        $lines = [];
        $this->appendDebit($lines, self::SALES_RETURNS, $subtotal, 'Sales return');
        $this->appendCredit($lines, $this->settlementAccountCode($saleReturn->refund_method), $refund, 'Customer refund');
        $this->appendCredit($lines, self::RECEIVABLE, $receivableReduction, 'Customer receivable reduced');

        return $this->postModel($saleReturn, $saleReturn->return_date?->toDateString() ?? now()->toDateString(), $saleReturn->return_number, "Sales return {$saleReturn->return_number}", $lines, $userId);
    }

    public function postPurchaseReturn(PurchaseReturn $purchaseReturn, int $userId): ?JournalEntry
    {
        $subtotal = (float) $purchaseReturn->subtotal;
        $refund = min($subtotal, (float) $purchaseReturn->refund_amount);
        $payableReduction = max(0, round($subtotal - $refund, 2));
        $lines = [];
        $this->appendDebit($lines, $this->settlementAccountCode($purchaseReturn->refund_method), $refund, 'Supplier refund');
        $this->appendDebit($lines, self::PAYABLE, $payableReduction, 'Supplier payable reduced');
        $this->appendCredit($lines, self::INVENTORY, $subtotal, 'Inventory returned to supplier');

        return $this->postModel($purchaseReturn, $purchaseReturn->return_date?->toDateString() ?? now()->toDateString(), $purchaseReturn->return_number, "Purchase return {$purchaseReturn->return_number}", $lines, $userId);
    }

    public function postOpeningStock(OpeningStock $openingStock, int $userId): ?JournalEntry
    {
        $total = round((float) $openingStock->items()->sum('total_cost'), 2);
        $lines = [];
        $this->appendDebit($lines, self::INVENTORY, $total, 'Opening inventory');
        $this->appendCredit($lines, self::OPENING_CAPITAL, $total, 'Opening capital');

        return $this->postModel($openingStock, $openingStock->opening_date?->toDateString() ?? now()->toDateString(), $openingStock->reference, "Opening stock {$openingStock->reference}", $lines, $userId);
    }

    public function postStockAdjustment(StockAdjustment $adjustment, int $userId): ?JournalEntry
    {
        $increase = 0.0;
        $decrease = 0.0;

        foreach ($adjustment->items as $item) {
            $value = round((float) $item->quantity * (float) $item->unit_cost, 2);
            if ($item->direction === 'increase') {
                $increase += $value;
            } else {
                $decrease += $value;
            }
        }

        $lines = [];
        $this->appendDebit($lines, self::INVENTORY, $increase, 'Inventory adjustment gain');
        $this->appendCredit($lines, self::INVENTORY_GAIN, $increase, 'Inventory gain');
        $this->appendDebit($lines, self::INVENTORY_LOSS, $decrease, 'Inventory adjustment loss');
        $this->appendCredit($lines, self::INVENTORY, $decrease, 'Inventory adjustment decrease');

        return $this->postModel($adjustment, $adjustment->adjustment_date?->toDateString() ?? now()->toDateString(), $adjustment->reference, "Stock adjustment {$adjustment->reference}", $lines, $userId);
    }

    private function postModel(Model $source, string $date, string $reference, string $description, array $codedLines, int $userId): ?JournalEntry
    {
        if (round((float) collect($codedLines)->sum('debit'), 2) <= 0 && round((float) collect($codedLines)->sum('credit'), 2) <= 0) {
            return null;
        }

        $lines = collect($codedLines)->map(function (array $line): array {
            $line['account_id'] = $this->accountId($line['account_code']);
            unset($line['account_code']);
            return $line;
        })->all();

        return $this->createJournal([
            'entry_date' => $date,
            'reference' => $reference,
            'source_type' => $source->getMorphClass(),
            'source_id' => $source->getKey(),
            'description' => $description,
            'lines' => $lines,
        ], $userId);
    }

    private function appendDebit(array &$lines, string $accountCode, float $amount, string $memo): void
    {
        if ($amount > 0) {
            $lines[] = ['account_code' => $accountCode, 'debit' => round($amount, 2), 'credit' => 0, 'memo' => $memo];
        }
    }

    private function appendCredit(array &$lines, string $accountCode, float $amount, string $memo): void
    {
        if ($amount > 0) {
            $lines[] = ['account_code' => $accountCode, 'debit' => 0, 'credit' => round($amount, 2), 'memo' => $memo];
        }
    }

    private function settlementAccountCode(?string $method): string
    {
        $method = strtolower((string) $method);
        return str_contains($method, 'bank') || str_contains($method, 'card') || str_contains($method, 'bkash') || str_contains($method, 'nagad') || str_contains($method, 'ssl')
            ? self::BANK
            : self::CASH;
    }

    private function accountId(string $code): int
    {
        $definitions = [
            self::CASH => ['Cash in Hand', 'asset', true, false],
            self::BANK => ['Bank and Digital Wallets', 'asset', false, true],
            self::RECEIVABLE => ['Accounts Receivable', 'asset', false, false],
            self::INVENTORY => ['Inventory', 'asset', false, false],
            self::PAYABLE => ['Accounts Payable', 'liability', false, false],
            self::OPENING_CAPITAL => ['Opening Capital', 'equity', false, false],
            self::SALES_REVENUE => ['Sales Revenue', 'income', false, false],
            self::SALES_RETURNS => ['Sales Returns', 'income', false, false],
            self::INVENTORY_GAIN => ['Inventory Gain', 'income', false, false],
            self::INVENTORY_LOSS => ['Inventory Loss', 'expense', false, false],
        ];

        if (! isset($definitions[$code])) {
            throw ValidationException::withMessages(['accounting' => "Unknown system account {$code}."]);
        }

        [$name, $type, $isCash, $isBank] = $definitions[$code];
        $account = Account::query()->firstOrCreate(
            ['code' => $code],
            ['name' => $name, 'type' => $type, 'is_cash' => $isCash, 'is_bank' => $isBank, 'is_active' => true]
        );

        if (! $account->is_active) {
            throw ValidationException::withMessages(['accounting' => "Required account {$code} is inactive."]);
        }

        return (int) $account->id;
    }

    private function validateBalancedLines(array $lines): void
    {
        if (count($lines) < 2) {
            throw ValidationException::withMessages(['lines' => 'A journal requires at least two non-zero lines.']);
        }

        foreach ($lines as $line) {
            if ($line['debit'] > 0 && $line['credit'] > 0) {
                throw ValidationException::withMessages(['lines' => 'A journal line cannot contain both debit and credit.']);
            }
        }

        $debit = round((float) collect($lines)->sum('debit'), 2);
        $credit = round((float) collect($lines)->sum('credit'), 2);
        if (abs($debit - $credit) > 0.009) {
            throw ValidationException::withMessages(['lines' => "Journal is not balanced. Debit {$debit}, credit {$credit}."]);
        }
    }

    private function nextNumber(): string
    {
        return 'JV-'.now()->format('Ymd').'-'.str_pad((string) ((JournalEntry::max('id') ?? 0) + 1), 5, '0', STR_PAD_LEFT);
    }
}

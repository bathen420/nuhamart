<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class SystemIntegrityService
{
    /**
     * Run non-destructive database integrity checks.
     *
     * @return array<int, array{name:string,status:string,count:int,message:string}>
     */
    public function run(): array
    {
        return [
            $this->checkUnbalancedJournals(),
            $this->checkOrphanJournalLines(),
            $this->checkDuplicateJournalSources(),
            $this->checkNegativeProductStock(),
            $this->checkNegativeWarehouseStock(),
            $this->checkDuplicateProductBarcodes(),
        ];
    }

    public function isHealthy(): bool
    {
        return collect($this->run())->every(fn (array $check) => $check['status'] === 'PASS');
    }

    private function result(string $name, int $count, string $message): array
    {
        return [
            'name' => $name,
            'status' => $count === 0 ? 'PASS' : 'FAIL',
            'count' => $count,
            'message' => $message,
        ];
    }

    private function checkUnbalancedJournals(): array
    {
        if (! Schema::hasTable('journal_entries') || ! Schema::hasTable('journal_lines')) {
            return $this->result('Balanced journal entries', 0, 'Accounting tables are not installed.');
        }

        $count = DB::table('journal_entries as je')
            ->leftJoin('journal_lines as jl', 'jl.journal_entry_id', '=', 'je.id')
            ->select('je.id')
            ->groupBy('je.id')
            ->havingRaw('ABS(COALESCE(SUM(jl.debit), 0) - COALESCE(SUM(jl.credit), 0)) > 0.009')
            ->get()
            ->count();

        return $this->result('Balanced journal entries', $count, 'Journal debit and credit totals must match.');
    }

    private function checkOrphanJournalLines(): array
    {
        if (! Schema::hasTable('journal_lines') || ! Schema::hasTable('journal_entries')) {
            return $this->result('Orphan journal lines', 0, 'Accounting tables are not installed.');
        }

        $count = DB::table('journal_lines as jl')
            ->leftJoin('journal_entries as je', 'je.id', '=', 'jl.journal_entry_id')
            ->whereNull('je.id')
            ->count();

        return $this->result('Orphan journal lines', $count, 'Every journal line must belong to a journal entry.');
    }

    private function checkDuplicateJournalSources(): array
    {
        if (! Schema::hasTable('journal_entries')) {
            return $this->result('Duplicate accounting sources', 0, 'Accounting tables are not installed.');
        }

        $count = DB::table('journal_entries')
            ->whereNotNull('source_type')
            ->whereNotNull('source_id')
            ->select('source_type', 'source_id')
            ->groupBy('source_type', 'source_id')
            ->havingRaw('COUNT(*) > 1')
            ->get()
            ->count();

        return $this->result('Duplicate accounting sources', $count, 'A business transaction must be posted only once.');
    }

    private function checkNegativeProductStock(): array
    {
        if (! Schema::hasTable('products') || ! Schema::hasColumn('products', 'stock_quantity')) {
            return $this->result('Negative product stock', 0, 'Products table is not installed.');
        }

        $count = DB::table('products')->where('stock_quantity', '<', 0)->count();

        return $this->result('Negative product stock', $count, 'Product stock should not be below zero.');
    }

    private function checkNegativeWarehouseStock(): array
    {
        if (! Schema::hasTable('product_warehouse_stocks')) {
            return $this->result('Negative warehouse stock', 0, 'Warehouse stock table is not installed.');
        }

        $count = DB::table('product_warehouse_stocks')->where('quantity', '<', 0)->count();

        return $this->result('Negative warehouse stock', $count, 'Warehouse stock should not be below zero.');
    }

    private function checkDuplicateProductBarcodes(): array
    {
        if (! Schema::hasTable('products') || ! Schema::hasColumn('products', 'barcode')) {
            return $this->result('Duplicate product barcodes', 0, 'Barcode fields are not installed.');
        }

        $count = DB::table('products')
            ->whereNotNull('barcode')
            ->where('barcode', '<>', '')
            ->select('barcode')
            ->groupBy('barcode')
            ->havingRaw('COUNT(*) > 1')
            ->get()
            ->count();

        return $this->result('Duplicate product barcodes', $count, 'Every product barcode must be unique.');
    }
}

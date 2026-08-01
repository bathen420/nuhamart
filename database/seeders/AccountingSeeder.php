<?php

namespace Database\Seeders;

use App\Models\Account;
use Illuminate\Database\Seeder;

class AccountingSeeder extends Seeder
{
    public function run(): void
    {
        $rows = [
            ['1000', 'Assets', 'asset'],
            ['1100', 'Cash in Hand', 'asset', true, false],
            ['1200', 'Bank and Digital Wallets', 'asset', false, true],
            ['1300', 'Accounts Receivable', 'asset'],
            ['1400', 'Inventory', 'asset'],
            ['2000', 'Liabilities', 'liability'],
            ['2100', 'Accounts Payable', 'liability'],
            ['3000', 'Equity', 'equity'],
            ['3100', 'Owner Capital', 'equity'],
            ['3200', 'Opening Capital', 'equity'],
            ['4000', 'Income', 'income'],
            ['4100', 'Sales Revenue', 'income'],
            ['4200', 'Sales Returns', 'income'],
            ['4300', 'Inventory Gain', 'income'],
            ['5000', 'Expenses', 'expense'],
            ['5100', 'Cost of Goods Sold', 'expense'],
            ['5200', 'Operating Expense', 'expense'],
            ['5300', 'Inventory Loss', 'expense'],
        ];

        foreach ($rows as $row) {
            Account::updateOrCreate(
                ['code' => $row[0]],
                [
                    'name' => $row[1],
                    'type' => $row[2],
                    'is_cash' => $row[3] ?? false,
                    'is_bank' => $row[4] ?? false,
                    'is_active' => true,
                ]
            );
        }
    }
}

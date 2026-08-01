# NuhaMart v1.1.0 — Automatic Accounting Engine

## Required baseline
Install this package only on the latest NuhaMart project that already contains the v1.0.0 Accounts Core module.

## Before installation
1. Commit or back up the current stable project.
2. Stop `npm run dev` and `php artisan serve` terminals.
3. Extract this ZIP.
4. Copy every folder from the extracted package into the NuhaMart project root.
5. Choose **Merge / Replace files in destination**.

## Commands
Open PowerShell in `C:\Users\HP\nuhamart` and run:

```powershell
composer dump-autoload
php artisan optimize:clear
php artisan migrate
php artisan db:seed --class=AccountingSeeder
php artisan test
npm run build
```

Then start the application:

```powershell
php artisan serve
```

In another PowerShell:

```powershell
npm run dev
```

## Verification
Create and verify these transactions:

1. Cash sale — Cash debit and Sales Revenue credit.
2. Due sale — Accounts Receivable debit and Sales Revenue credit.
3. Purchase — Inventory debit; Cash/Bank and Accounts Payable credit.
4. Later supplier payment — Accounts Payable debit and Cash/Bank credit.
5. Sales return — Sales Returns debit; refund/receivable credit.
6. Purchase return — Cash/Bank or Accounts Payable debit; Inventory credit.
7. Opening stock — Inventory debit and Opening Capital credit.
8. Approved stock adjustment — Inventory Gain or Inventory Loss posting.

Open **Journal Entries** and **General Ledger** after each transaction.

## Safety
- Existing sales, purchases, inventory and journal data are not deleted.
- Automatic posting is idempotent: the same source record cannot create duplicate journal entries.
- Accounting posting runs inside the existing database transaction. A failed journal posting rolls back the business transaction.
- Zero-value opening stock or adjustment does not create an empty journal.

## Rollback
Before rollback, back up the database. Then roll back the latest migration:

```powershell
php artisan migrate:rollback --step=1
```

Restore the previous versions of the replaced PHP files from Git.

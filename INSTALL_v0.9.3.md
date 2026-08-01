# NuhaMart v0.9.3 — Product Factory Test Fix

## What this fixes

Adds the missing `Database\\Factories\\ProductFactory` required by:

- `Tests\\Feature\\InventoryCoreTest`
- `Tests\\Feature\\OpeningStockTest`

The factory creates a valid product together with reusable test category and brand records.

## Installation

1. Extract this ZIP.
2. Copy the included `database` folder into:

   `C:\Users\HP\nuhamart`

3. Allow Windows to merge folders and replace files if prompted.
4. Run:

```powershell
cd C:\Users\HP\nuhamart
composer dump-autoload
php artisan optimize:clear
php artisan test
```

## Data safety

- No migration is included.
- No production data is deleted or changed.
- The factory runs only when explicitly used by tests, seeders, or Tinker.

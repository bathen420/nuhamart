# NuhaMart v1.2.0 — Financial Statements

## Prerequisite
NuhaMart v1.1.0 Automatic Accounting Engine must already be installed and migrated.

## Installation
1. Stop `npm run dev` with `Ctrl + C`.
2. Extract this ZIP.
3. Copy every file and folder into `C:\Users\HP\nuhamart` and choose **Replace/Merge**.
4. Run:

```powershell
cd C:\Users\HP\nuhamart
composer dump-autoload
php artisan optimize:clear
php artisan db:seed --class=RolesAndPermissionsSeeder
php artisan route:list --name=financial-statements
php artisan test
npm run build
```

5. Start development servers:

```powershell
php artisan serve
```

In another terminal:

```powershell
npm run dev
```

6. Hard refresh Chrome with `Ctrl + Shift + R`.

## New pages
- `/admin/financial-statements`
- `/admin/financial-statements/trial-balance`
- `/admin/financial-statements/profit-loss`
- `/admin/financial-statements/balance-sheet`
- `/admin/financial-statements/cash-flow`

## Notes
- Reports use only **posted journal entries**.
- CSV exports are UTF-8 and Excel-compatible.
- Print uses the browser print dialog and existing NuhaMart print CSS.
- No migration is included in this release.
- Existing sales, purchases, inventory, journal entries and accounting data are not modified.

## Rollback
Restore the files from your Git tag/commit made before installing this module. No database rollback is required.

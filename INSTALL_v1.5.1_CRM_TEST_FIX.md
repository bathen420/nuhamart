# NuhaMart v1.5.1 — CRM Test Stability Fix

## Purpose
This patch fixes the CRM loyalty feature test so that it uses the payment method value accepted by the existing `sales.payment_method` database constraint.

The database accepts:
- Cash
- Card
- Mobile Banking
- Bank

The failing test used lowercase `cash`, which SQLite rejected before the loyalty service could run.

## Installation
1. Stop any running test or Vite process.
2. Extract this ZIP.
3. Copy the `tests` folder into your NuhaMart project root and replace the destination file.
4. Run:

```powershell
cd C:\Users\HP\nuhamart
composer dump-autoload
php artisan optimize:clear
php artisan test
npm run build
```

## Expected Result
All existing tests should pass. Based on the previous run, the expected total is 50 passing tests.

## Safety
- No migration changes
- No production service changes
- No existing database data changes
- No route or UI changes

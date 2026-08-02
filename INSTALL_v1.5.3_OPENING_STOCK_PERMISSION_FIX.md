# NuhaMart v1.5.3 — Opening Stock Permission Fix

## Purpose

This patch fixes the Foundation Hardening regression where the Opening Stock feature test received HTTP 403.

The `admin.opening-stocks.store` route is protected by the action-specific permission:

`opening-stocks.create`

The previous test granted only `opening-stocks.view`, which is intentionally insufficient for creating opening stock.

## Installation

1. Extract this ZIP.
2. Copy the `tests` folder into the NuhaMart project root.
3. Choose **Replace the files in the destination**.
4. Run:

```powershell
cd C:\Users\HP\nuhamart
composer dump-autoload
php artisan optimize:clear
php artisan test
php artisan nuhamart:health-check
npm run build
```

## Expected result

- All tests pass.
- System integrity checks pass.
- Vite production build succeeds.

## Database impact

None. This patch contains no migration and changes no production data.

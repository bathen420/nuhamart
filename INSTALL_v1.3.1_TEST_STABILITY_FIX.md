# NuhaMart v1.3.1 Test Stability Fix

## Fixes
- Financial statement date filters now work with SQLite `:memory:` and MySQL.
- Purchase Management Pro test now supplies the required supplier phone field.

## Install
1. Stop Vite (`Ctrl+C`).
2. Copy all folders/files from this package into the NuhaMart project root and replace files.
3. Run:

```powershell
composer dump-autoload
php artisan optimize:clear
php artisan test
npm run build
```

No migration or database data change is required.

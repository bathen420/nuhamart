# NuhaMart v1.3.0 Purchase Management Pro

1. Extract and copy all folders into the project root.
2. Run:
```powershell
composer dump-autoload
php artisan optimize:clear
php artisan migrate
php artisan db:seed --class=RolesAndPermissionsSeeder
php artisan test
npm run build
```
3. Hard-refresh the browser.

New menus: Purchase Requisitions, Purchase Orders, Goods Receipts, Supplier Statements.

Rollback database only: `php artisan migrate:rollback --step=1` (do this only before entering production data).

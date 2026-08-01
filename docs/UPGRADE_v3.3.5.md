# Upgrade to v3.3.5

Run from the project root:

```bash
composer install
php artisan migrate
php artisan db:seed --class=RolesAndPermissionsSeeder
php artisan optimize:clear
npm install
npm run build
```

Assign the new permissions to non-Super-Admin roles as required.

## New permissions
- stock-adjustments.view
- stock-adjustments.create
- stock-adjustments.approve
- stock-transfers.view
- stock-transfers.create
- stock-transfers.dispatch
- stock-transfers.receive
- stock-ledger.view

## Note
Existing opening-stock records created before this release are not automatically backfilled into `stock_ledgers`. New opening-stock entries are recorded in the ledger.

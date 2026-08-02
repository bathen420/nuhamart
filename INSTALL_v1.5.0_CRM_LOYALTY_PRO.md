# NuhaMart v1.5.0 — CRM & Loyalty Pro

## Installation
1. Back up the database and create a Git checkpoint.
2. Extract this ZIP and copy all folders/files into `C:\Users\HP\nuhamart` using Merge/Replace.
3. Run:

```powershell
composer dump-autoload
php artisan optimize:clear
php artisan migrate
php artisan db:seed --class=RolesAndPermissionsSeeder
php artisan db:seed --class=CrmLoyaltySeeder
php artisan test
npm run build
```

## URLs
- `/admin/crm`
- `/admin/gift-vouchers`

## Default loyalty policy
One point is earned for every ৳100 of completed sale value. A sales return reverses points proportionally. Manual wallet and points adjustments require a reason and cannot make balances negative.

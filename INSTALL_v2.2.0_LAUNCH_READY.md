# Installation — v2.2.0 Launch Ready Commerce

1. Back up `.env` and the database.
2. Copy this package over the project root using Merge/Replace.
3. Run:

```powershell
composer install
npm install
npm run build
composer dump-autoload
php artisan optimize:clear
php artisan migrate
php artisan db:seed --class=RolesAndPermissionsSeeder
php artisan test
php artisan nuhamart:health-check
```

## Configure before launch
- Admin → Settings: shipping charges, free-shipping threshold, mobile banking numbers and social links.
- Admin → Orders → Show: update workflow, courier and tracking information.
- Set the production domain in `.env`; `/sitemap.xml` and `/robots.txt` are then available automatically.

## Production
Use `scripts/PREPARE_LAUNCH.ps1` on Windows hosting or `scripts/PREPARE_LAUNCH.sh` on Linux after the frontend build has been created.

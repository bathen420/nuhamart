$ErrorActionPreference = "Stop"

composer dump-autoload
php artisan optimize:clear
php artisan db:seed --class=RolesAndPermissionsSeeder
php artisan test
php artisan nuhamart:health-check
npm run build

Write-Host "Nuha Mart BD v2.0.0-alpha.1 verification completed." -ForegroundColor Green

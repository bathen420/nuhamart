$ErrorActionPreference = "Stop"

composer install --no-dev --optimize-autoloader
php artisan optimize:clear
php artisan migrate --force
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
php artisan nuhamart:health-check

Write-Host "Nuha Mart BD production optimization complete." -ForegroundColor Green

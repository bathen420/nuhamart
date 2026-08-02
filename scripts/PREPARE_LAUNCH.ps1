$ErrorActionPreference = "Stop"
php artisan down --retry=60
composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction
php artisan optimize:clear
php artisan migrate --force
php artisan storage:link 2>$null
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
php artisan nuhamart:health-check
php artisan up
Write-Host "Nuha Mart BD launch preparation complete." -ForegroundColor Green

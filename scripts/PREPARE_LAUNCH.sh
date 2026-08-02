#!/usr/bin/env bash
set -euo pipefail
php artisan down --retry=60 || true
composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction
php artisan optimize:clear
php artisan migrate --force
php artisan storage:link || true
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
php artisan nuhamart:health-check
php artisan up
printf 'Nuha Mart BD launch preparation complete.\n'

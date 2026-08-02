#!/usr/bin/env bash
set -euo pipefail

composer install --no-dev --optimize-autoloader
php artisan optimize:clear
php artisan migrate --force
php artisan storage:link || true
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
php artisan nuhamart:health-check

echo "Nuha Mart BD production optimization complete."

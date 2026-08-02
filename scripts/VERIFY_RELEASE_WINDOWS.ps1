$ErrorActionPreference = "Stop"

Set-Location (Split-Path -Parent $PSScriptRoot)

Write-Host "[1/6] Composer autoload" -ForegroundColor Cyan
composer dump-autoload

Write-Host "[2/6] Clear Laravel caches" -ForegroundColor Cyan
php artisan optimize:clear

Write-Host "[3/6] Migration status" -ForegroundColor Cyan
php artisan migrate:status

Write-Host "[4/6] Automated tests" -ForegroundColor Cyan
php artisan test

Write-Host "[5/6] Integrity checks" -ForegroundColor Cyan
php artisan nuhamart:health-check

Write-Host "[6/6] Frontend production build" -ForegroundColor Cyan
npm run build

Write-Host "Release verification completed successfully." -ForegroundColor Green

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "[1/5] Composer autoload" -ForegroundColor Cyan
composer dump-autoload

Write-Host "[2/5] Clear Laravel caches" -ForegroundColor Cyan
php artisan optimize:clear

Write-Host "[3/5] Run automated tests" -ForegroundColor Cyan
php artisan test

Write-Host "[4/5] Run Nuha Mart integrity checks" -ForegroundColor Cyan
php artisan nuhamart:health-check

Write-Host "[5/5] Build production assets" -ForegroundColor Cyan
npm run build

Write-Host "Nuha Mart BD v2.0.0-alpha.2 verification completed." -ForegroundColor Green

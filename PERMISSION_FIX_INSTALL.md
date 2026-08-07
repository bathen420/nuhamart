# Business Settings v3 Permission Fix

Your project uses these permissions:

- `settings.view`
- `settings.edit`

The previous package incorrectly used `settings.manage`.

## Install

```powershell
cd C:\Users\HP\nuhamart

Expand-Archive `
-Path .\NuhaMart-Business-Settings-v3.0-Permission-Fix.zip `
-DestinationPath . `
-Force

composer dump-autoload
php artisan optimize:clear
php artisan test --filter=BusinessSettingsCentralizationTest
```

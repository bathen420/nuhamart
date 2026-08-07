# Nuha Mart BD — Enterprise Business Settings v4.0

## Features

- Main, dark, white, footer and mobile logos
- Admin, login, invoice, POS and email logos
- Favicon and Open Graph image
- Automatic main-logo fallback
- Live branding preview
- Company identity, contact and social center
- SEO, Open Graph and Twitter Card settings
- Invoice, receipt and email footer settings
- Global cached Inertia settings payload
- Dynamic SSLCommerz order branding
- Dedicated invoice/PDF and POS branding
- Automated tests

## Install

```powershell
cd C:\Users\HP\nuhamart

Expand-Archive `
-Path .\NuhaMart-Enterprise-Business-Settings-v4.0.zip `
-DestinationPath . `
-Force

composer dump-autoload
php artisan optimize:clear
php artisan migrate
php artisan storage:link

php artisan test --filter=EnterpriseBusinessSettingsV4Test
php artisan test --filter=BusinessSettingsCentralizationTest
npm run build
```

`storage:link already exists` is harmless.

## Full verification

```powershell
php artisan test
php artisan nuhamart:health-check
npm run build
```

## Browser verification

```text
http://127.0.0.1:8000/admin/settings
```

Verify the website header/footer, login pages, favicon, social metadata,
invoice PDF, A4 invoice and thermal/POS receipt.

## Secrets

SMTP passwords, SSLCommerz passwords, courier API secrets and other private
keys must remain in `.env`.

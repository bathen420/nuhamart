# Nuha Mart BD — Professional Business Settings UI v5.0

This package redesigns the existing Enterprise Business Settings screen without
changing the v4 database structure or backend save route.

## New UI

- Premium three-column desktop layout
- Responsive tablet and mobile layout
- Searchable settings navigation
- Separate settings pages instead of one crowded form
- Grouped logo manager
- Professional upload cards
- Website header/footer preview
- Invoice preview
- POS receipt preview
- Login-page preview
- Sticky Reset and Save controls
- Modern toggle switches
- Improved spacing, typography and validation display

## Install

```powershell
cd C:\Users\HP\nuhamart

Expand-Archive `
-Path .\NuhaMart-Professional-Business-Settings-v5.0.zip `
-DestinationPath . `
-Force

php artisan optimize:clear
npm run build
```

## Test

Open:

```text
http://127.0.0.1:8000/admin/settings
```

Check desktop, tablet and mobile widths. Upload a logo, change company details,
save, refresh and verify the stored values.

## Full verification

```powershell
php artisan test
php artisan nuhamart:health-check
npm run build
```

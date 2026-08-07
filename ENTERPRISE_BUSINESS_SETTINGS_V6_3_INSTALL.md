# Nuha Mart BD — Enterprise Business Settings v6.3

This package redesigns the current Business Settings screen using the v6
Design System and Admin Layout.

## Prerequisites

Install first:

1. `NuhaMart-Enterprise-Design-System-v6.0.zip`
2. `NuhaMart-Enterprise-Admin-Layout-v6.1.zip`
3. `NuhaMart-Enterprise-Dashboard-v6.2.zip`

The existing Business Settings v4 backend and database fields must already be
installed.

## Included

- New v6 page header and settings workspace
- Searchable settings navigation
- Clean grouped branding manager
- Main-logo fallback preserved
- Professional contact, social, SEO, commerce and payment forms
- Courier and document settings
- Invoice, receipt and email footer editors
- Live website, footer, invoice and login previews
- Unsaved-changes indicator
- Responsive sticky save control
- Existing save route and validation preserved
- No database migration required

## Install

```powershell
cd C:\Users\HP\nuhamart

Expand-Archive `
-Path .\NuhaMart-Enterprise-Business-Settings-v6.3.zip `
-DestinationPath . `
-Force

php artisan optimize:clear
npm run build
```

## Verify

Open:

```text
http://127.0.0.1:8000/admin/settings
```

Test settings navigation, logo uploads, live previews, contact/social/SEO
values, payment toggles, shipping charges and document footers.

## Full verification

```powershell
php artisan test
php artisan nuhamart:health-check
npm run build
```

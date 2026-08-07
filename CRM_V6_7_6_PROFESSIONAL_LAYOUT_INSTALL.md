# NuhaMart Enterprise CRM v6.7.6 — Professional Layout

This release is a UI-only refinement of the working CRM 360° page.

## Changes

- Balanced 3-column desktop layout
- 300px customer/profile sidebar
- Flexible center content area
- 340px action sidebar
- New customer hero section
- Improved KPI visual hierarchy
- Full-width Recent Sales table in center workspace
- Full-width Ecommerce Orders section
- CRM timeline moved into the main content workspace
- Loyalty, Wallet and Notes grouped in right sidebar
- Cleaner customer profile and addresses cards
- Professional empty states
- Better desktop/tablet/mobile responsiveness
- No controller, route or database changes

## Install

```powershell
cd C:\Users\HP\nuhamart

Expand-Archive `
-Path .\NuhaMart-Enterprise-CRM-v6.7.6-Professional-Layout.zip `
-DestinationPath . `
-Force

php artisan optimize:clear

Remove-Item .\node_modules\.vite -Recurse -Force -ErrorAction SilentlyContinue

npm run build
```

If Vite dev mode is running, restart it:

```powershell
npm run dev
```

Then hard refresh Chrome:

```text
Ctrl + Shift + R
```

Open:

```text
http://127.0.0.1:8000/admin/crm/customers/1
```

## Verification

```powershell
php artisan test --filter=EnterpriseCrmCompatibilityV671Test
npm run build
```

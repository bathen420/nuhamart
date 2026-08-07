# NuhaMart Enterprise CRM v6.9.1 — Sidebar Navigation

## What this patch adds

A new **CRM** menu item in the existing Enterprise Admin sidebar, directly before Customers.

```text
Commerce
├── Orders
├── Products & Books
├── Categories
├── Authors
├── Publishers
├── Brands
├── CRM
└── Customers
```

CRM navigation:

```text
Label: CRM
Route: admin.crm.index
URL: /admin/crm
Permission: crm.view
Icon: Contact
```

The existing `Contact` icon is already imported in `AdminNavigation.js`, so no new package or dependency is required.

The CRM menu becomes active automatically on:

```text
/admin/crm
/admin/crm/customers/{customer}
```

because the navigation prefix is:

```text
/admin/crm
```

## Install

```powershell
cd C:\Users\HP\nuhamart

Expand-Archive `
-Path .\NuhaMart-Enterprise-CRM-v6.9.1-Sidebar-Navigation.zip `
-DestinationPath . `
-Force

powershell -ExecutionPolicy Bypass -File .\add-crm-sidebar.ps1

php artisan optimize:clear

Remove-Item .\node_modules\.vite `
-Recurse `
-Force `
-ErrorAction SilentlyContinue

npm run build
```

If Vite dev mode is running, stop it and restart:

```powershell
npm run dev
```

Then hard refresh Chrome:

```text
Ctrl + Shift + R
```

## Verify

Check the source:

```powershell
Select-String `
-Path .\resources\js\Components\Admin\AdminNavigation.js `
-Pattern 'admin.crm.index'
```

Open:

```text
http://127.0.0.1:8000/admin/dashboard
```

You should see **CRM** in the Commerce section.

Then click CRM and verify:

```text
http://127.0.0.1:8000/admin/crm
```

## Permission

The CRM item is controlled by:

```text
crm.view
```

Super Admin will see it automatically via the existing navigation access checker.

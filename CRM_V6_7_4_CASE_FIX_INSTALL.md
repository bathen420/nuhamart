# NuhaMart Enterprise CRM v6.7.4 — Case Sensitivity Fix

## Root cause

The actual React directory is:

```text
resources/js/Pages/Admin/CRM/Show.jsx
```

but the controller was returning:

```php
Inertia::render('Admin/Crm/Show', ...)
```

Vite's `import.meta.glob()` uses exact string keys. Its generated key is:

```text
./Pages/Admin/CRM/Show.jsx
```

while Inertia requested:

```text
./Pages/Admin/Crm/Show.jsx
```

Those strings do not match, so the page resolver throws "Page not found".

## Install

```powershell
cd C:\Users\HP\nuhamart

Expand-Archive `
-Path .\NuhaMart-Enterprise-CRM-v6.7.4-Case-Sensitivity-Fix.zip `
-DestinationPath . `
-Force

powershell -ExecutionPolicy Bypass -File .\fix-crm-case.ps1

php artisan optimize:clear

Remove-Item .\node_modules\.vite -Recurse -Force -ErrorAction SilentlyContinue

npm run build
```

If you use Vite dev mode, stop the existing `npm run dev` process and start it again:

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

## Verify

```powershell
Select-String `
-Path .\app\Http\Controllers\Admin\CrmController.php `
-Pattern "Admin/CRM/Show"

php artisan test --filter=EnterpriseCrmCompatibilityV671Test
```

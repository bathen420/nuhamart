# NuhaMart Enterprise CRM v6.8.1 — UI Polish

## Fixed

- Ecommerce order amount no longer overlaps status badge
- Order number truncates safely
- Date is separated from amount/status
- Large currency values wrap safely
- "View order" action is aligned independently
- Center CRM column has a safer minimum width
- Right action column has slightly more room
- Responsive behavior improved for laptop/tablet widths
- No backend, route, permission, or database changes

## Install

```powershell
cd C:\Users\HP\nuhamart

Expand-Archive `
-Path .\NuhaMart-Enterprise-CRM-v6.8.1-UI-Polish.zip `
-DestinationPath . `
-Force

php artisan optimize:clear

Remove-Item .\node_modules\.vite -Recurse -Force -ErrorAction SilentlyContinue

npm run build
```

If `npm run dev` is running, stop and restart it.

Then hard refresh Chrome:

```text
Ctrl + Shift + R
```

Verify:

```text
http://127.0.0.1:8000/admin/crm/customers/1
```

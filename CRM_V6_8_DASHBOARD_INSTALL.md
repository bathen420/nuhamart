# NuhaMart Enterprise CRM v6.8 — Dashboard

## Included

- CRM executive dashboard
- Total, new, active and returning customer metrics
- Repeat-customer rate
- Lifetime revenue and average order value
- Outstanding due
- Wallet liability and loyalty points
- Six-month customer growth
- Six-month revenue trend
- Top customers by completed sales value
- Customer segment overview
- Recently added customers
- Recent CRM activity
- Existing CRM 360° profile preserved
- Existing address compatibility preserved
- CRM/Crm case-sensitivity fix preserved
- No database migration required

## Install

```powershell
cd C:\Users\HP\nuhamart

Expand-Archive `
-Path .\NuhaMart-Enterprise-CRM-v6.8-Dashboard.zip `
-DestinationPath . `
-Force

composer dump-autoload
php artisan optimize:clear

Remove-Item .\node_modules\.vite -Recurse -Force -ErrorAction SilentlyContinue

php artisan test --filter=EnterpriseCrmDashboardV68Test
php artisan test --filter=EnterpriseCrmCompatibilityV671Test

npm run build
```

If Vite dev mode is running, restart it after installation:

```powershell
npm run dev
```

Open:

```text
http://127.0.0.1:8000/admin/crm
```

Then verify the Customer 360 page remains working:

```text
http://127.0.0.1:8000/admin/crm/customers/1
```

## Full verification

```powershell
php artisan test
php artisan nuhamart:health-check
npm run build
```

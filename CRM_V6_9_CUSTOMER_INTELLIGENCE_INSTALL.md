# NuhaMart Enterprise CRM v6.9 — Customer Intelligence & History

## Included

- Customer lifecycle stage: Prospect / New / Returning / Loyal
- Total transaction count
- Purchase-frequency metric
- Last-purchase date
- Days since last purchase
- Unified customer activity feed
- Sales activity in CRM timeline
- Ecommerce-order activity in CRM timeline
- Wallet activity in CRM timeline
- Loyalty activity in CRM timeline
- Wallet transaction history
- Loyalty transaction history
- Existing Customer 360 responsive layout preserved
- Existing CRM dashboard preserved
- Existing address compatibility preserved
- No database migration required

## Important

This release intentionally uses existing NuhaMart data structures only.
It does not add speculative customer-tag, lead, or marketing tables yet.

## Install

```powershell
cd C:\Users\HP\nuhamart

Expand-Archive `
-Path .\NuhaMart-Enterprise-CRM-v6.9-Customer-Intelligence.zip `
-DestinationPath . `
-Force

composer dump-autoload
php artisan optimize:clear

Remove-Item .\node_modules\.vite `
-Recurse `
-Force `
-ErrorAction SilentlyContinue

php artisan test --filter=EnterpriseCrmCustomerIntelligenceV69Test
php artisan test --filter=EnterpriseCrmCompatibilityV671Test

npm run build
```

If `npm run dev` is running, restart it.

Verify:

```text
http://127.0.0.1:8000/admin/crm/customers/1
```

Also verify:

```text
http://127.0.0.1:8000/admin/crm
```

## Full verification

```powershell
php artisan test
php artisan nuhamart:health-check
npm run build
```

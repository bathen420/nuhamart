# NuhaMart Enterprise CRM v6.7.1 Compatibility Fix

## Fixed

The current database stores customer addresses against storefront users:

```text
customer_addresses.user_id
```

It does not contain:

```text
customer_addresses.customer_id
```

CRM v6.7 incorrectly added a direct `Customer -> addresses` relationship,
causing:

```text
no such column: customer_addresses.customer_id
```

This patch:

- Removes the invalid Customer-address relationship
- Keeps the valid Customer-order relationship
- Finds the linked storefront user by customer email, then phone
- Loads addresses through `customer_addresses.user_id`
- Safely returns an empty address list when no storefront user is linked
- Corrects the React UI to use `address`, `area`, `district`, and `division`
- Adds compatibility tests
- Requires no migration and does not alter existing data

## Install

```powershell
cd C:\Users\HP\nuhamart

Expand-Archive `
-Path .\NuhaMart-Enterprise-CRM-v6.7.1-Compatibility-Fix.zip `
-DestinationPath . `
-Force

composer dump-autoload
php artisan optimize:clear

php artisan test --filter=EnterpriseCrmCompatibilityV671Test
npm run build
```

## Verify

Open:

```text
http://127.0.0.1:8000/admin/crm/customers/1
```

The profile should now open without an SQL error.

## Full verification

```powershell
php artisan test
php artisan nuhamart:health-check
npm run build
```

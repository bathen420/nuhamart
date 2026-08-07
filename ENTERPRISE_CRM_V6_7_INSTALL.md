# Nuha Mart BD — Enterprise CRM v6.7

## Included

- Customer KPI dashboard
- Search, status, segment and page-size filters
- Lifetime value and outstanding balance
- Returning, new and VIP customer segments
- Professional customer listing
- Redesigned Create/Edit customer workspace
- Customer 360° profile
- Sales and ecommerce-order history
- Loyalty points balance and adjustment
- Wallet balance and adjustment
- Customer address book
- Internal CRM notes
- CRM activity timeline
- Permission-protected wallet, loyalty and note operations
- Missing CRM models/controller supplied
- Existing CRM database migration reused
- No new migration required

## Permissions

The feature uses:

```text
customers.view
customers.create
customers.edit
customers.delete
customers.notes.manage
customers.loyalty.manage
customers.wallet.manage
```

Ensure the relevant roles have these permissions.

## Install

```powershell
cd C:\Users\HP\nuhamart

Expand-Archive `
-Path .\NuhaMart-Enterprise-CRM-v6.7.zip `
-DestinationPath . `
-Force

composer dump-autoload
php artisan optimize:clear

php artisan test --filter=EnterpriseCrmUiV67Test
npm run build
```

## Verify

Open:

```text
http://127.0.0.1:8000/admin/customers
```

Test:

1. Customer KPI values.
2. Search and segment filters.
3. Add and edit customer.
4. Open Customer 360° profile.
5. Loyalty adjustment.
6. Wallet adjustment.
7. Internal notes.
8. Sales and order history.
9. Address display.
10. Responsive desktop, tablet and mobile widths.

## Full verification

```powershell
php artisan test
php artisan nuhamart:health-check
npm run build
```

## Rollback

Restore:

```text
app/Models/Customer.php
app/Http/Controllers/Admin/CustomerController.php
resources/js/Pages/Admin/Customers/Index.jsx
resources/js/Pages/Admin/Customers/Form.jsx
resources/js/Pages/Admin/Customers/Create.jsx
resources/js/Pages/Admin/Customers/Edit.jsx
```

Remove:

```text
app/Models/CustomerCrmProfile.php
app/Models/CrmTimelineEntry.php
app/Models/LoyaltyTier.php
app/Http/Controllers/Admin/CrmController.php
resources/js/Pages/Admin/Crm/Show.jsx
tests/Feature/EnterpriseCrmUiV67Test.php
```

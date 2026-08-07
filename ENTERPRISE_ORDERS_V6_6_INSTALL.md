# Nuha Mart BD — Enterprise Orders v6.6

## Included

- Enterprise order KPI summary
- Search by order, customer, phone and tracking number
- Order status filter
- Payment status and payment method filters
- Courier filter
- Date range filter
- Total/date sorting
- Professional order queue
- Responsive status, payment and courier columns
- Redesigned order-details workspace
- Product items table
- Order financial summary
- Customer and delivery panel
- Workflow status editor
- Courier booking and synchronization
- Order timeline
- Invoice PDF and print actions
- Existing routes and workflow endpoints preserved
- No migration required

## Prerequisites

Install NuhaMart Enterprise UI v6.0 through v6.5 first.

## Install

```powershell
cd C:\Users\HP\nuhamart

Expand-Archive `
-Path .\NuhaMart-Enterprise-Orders-v6.6.zip `
-DestinationPath . `
-Force

php artisan optimize:clear
php artisan test --filter=EnterpriseOrdersUiV66Test
npm run build
```

## Verify

Open:

```text
http://127.0.0.1:8000/admin/orders
```

Check:

1. KPI counts.
2. Search and advanced filters.
3. Pagination.
4. Order details.
5. Workflow update.
6. PDF and print actions.
7. Steadfast booking and sync.
8. Status timeline.
9. Responsive desktop, tablet and mobile widths.

## Full verification

```powershell
php artisan test
php artisan nuhamart:health-check
npm run build
```

## Rollback

Restore:

```text
app/Http/Controllers/Admin/OrderController.php
resources/js/Pages/Admin/Orders/Index.jsx
resources/js/Pages/Admin/Orders/Show.jsx
```

Remove:

```text
tests/Feature/EnterpriseOrdersUiV66Test.php
```

# Nuha Mart BD — Customer Order Experience v2.0

## Included

- Search and filter order history
- Status counters and date filters
- Modern order details page
- Detailed status timeline
- Customer-owned PDF invoice download
- Reorder available products
- Cancellation request flow
- Courier/tracking display
- Ownership protection
- Automated regression tests

## Install

```powershell
cd C:\Users\HP\nuhamart

Expand-Archive `
-Path .\NuhaMart-Customer-Order-Experience-v2.0.zip `
-DestinationPath . `
-Force

composer dump-autoload
php artisan optimize:clear
php artisan migrate
php artisan test --filter=CustomerOrderExperienceV2Test
php artisan test --filter=CustomerOrderOwnershipTest
npm run build
```

## Full verification

```powershell
php artisan test
php artisan nuhamart:health-check
npm run build
```

## Browser verification

```text
http://127.0.0.1:8000/account/orders
```

Test:

1. Search by order number.
2. Filter by status and date.
3. Open an order.
4. Download PDF invoice.
5. Reorder available products.
6. Submit cancellation request for pending/confirmed order.
7. Confirm shipped/delivered orders cannot request cancellation.

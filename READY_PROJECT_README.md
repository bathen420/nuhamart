# NuhaMart Ready Project

POS integration fixes applied:

- Removed duplicate POS route file loading.
- Standardised POS screen route as `admin.pos.create`.
- Kept AJAX product/customer search and checkout routes.
- Sale totals and product prices are recalculated on the server.
- Client-submitted price/subtotal values are no longer trusted.
- Stock is validated inside a database transaction.
- Product stock is reduced after a successful sale.
- Stock history now uses the actual database columns:
  `stock_before`, `stock_after`, `reference`, and `note`.
- Completed sales redirect to the printable invoice page.

## Run on Windows

```powershell
cd C:\Users\HP\nuhamart
composer install
npm install
php artisan storage:link
php artisan optimize:clear
php artisan migrate
npm run dev
```

In another terminal:

```powershell
php artisan serve
```

Open:

```text
http://127.0.0.1:8000/admin/pos
```

## POS test

1. Click a product card to add it to the cart.
2. Change quantity.
3. Enter paid amount and payment method.
4. Complete the sale.
5. Confirm the invoice opens.
6. Confirm stock decreases and stock history is recorded.

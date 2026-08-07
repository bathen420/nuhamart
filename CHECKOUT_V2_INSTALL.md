# Nuha Mart BD — Checkout Module v2.0

## Improvements

- Fresh Axios/XSRF coupon requests (prevents stale CSRF token errors)
- Saved default address is selected automatically
- Clear delivery, payment and order-review progress
- Coupon remove and automatic invalidation when totals change
- Separate item and shipping discounts
- Digital-only checkout guidance
- Empty payment-method protection
- Bangladesh phone-number normalization
- Explicit and safe Inertia payloads
- New regression tests

## Install

```powershell
cd C:\Users\HP\nuhamart

Expand-Archive `
-Path .\NuhaMart-Checkout-Module-v2.0.zip `
-DestinationPath . `
-Force

composer dump-autoload
php artisan optimize:clear
php artisan test --filter=CheckoutExperienceV2Test
php artisan test --filter=OnePageCheckoutTest
php artisan test --filter=CompleteShoppingFlowTest
npm run build
```

## Full verification

```powershell
php artisan test
php artisan nuhamart:health-check
npm run build
```

## Browser test

Open:

```text
http://127.0.0.1:8000/checkout
```

Verify:

1. Guest checkout.
2. Logged-in customer default address.
3. Home delivery and store pickup.
4. Dhaka/outside-Dhaka shipping.
5. Free-shipping threshold.
6. Coupon apply/remove.
7. COD/manual/SSLCommerz options.
8. Order success page.

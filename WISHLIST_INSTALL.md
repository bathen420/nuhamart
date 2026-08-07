# Nuha Mart BD — Wishlist Module v1.0

## Features

- Database-backed customer wishlist
- Guest wishlist using browser local storage
- Automatic guest-to-customer merge after login
- Product-card heart button
- Header and mobile wishlist count
- `/wishlist` guest page
- `/account/wishlist` customer page
- Move to cart and remove actions
- Duplicate protection and cascade cleanup
- Automated feature tests

## Install

```powershell
cd C:\Users\HP\nuhamart

Expand-Archive `
-Path .\NuhaMart-Wishlist-Module-v1.0.zip `
-DestinationPath . `
-Force

composer dump-autoload
php artisan optimize:clear
php artisan migrate
php artisan test --filter=CustomerWishlistTest
npm run build
```

## Verify

Guest:

```text
http://127.0.0.1:8000/wishlist
```

Customer:

```text
http://127.0.0.1:8000/account/wishlist
```

Test these flows:

1. Add a product from a product card while logged out.
2. Open `/wishlist` and confirm it appears.
3. Login and confirm the guest wishlist merges automatically.
4. Add/remove products while logged in.
5. Move an in-stock product to cart.
6. Confirm header and mobile wishlist counts update.

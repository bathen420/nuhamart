# Nuha Mart BD — SSLCommerz Payment Module v2.0

## Included

- Dedicated `config/payments.php`
- Sandbox/live environment switch
- Numbered retry attempts
- Duplicate callback protection
- Transaction, amount and currency validation
- Callback counters and timestamps
- Database locking during payment confirmation
- Safe failure/cancel handling
- Customer-owned payment retry
- Customer order payment details
- Automated regression tests

## Environment variables

Add to `.env` without sharing the real secrets:

```env
PAYMENT_SSLCOMMERZ_ENABLED=true
SSLCOMMERZ_MODE=sandbox
SSLCOMMERZ_STORE_ID=
SSLCOMMERZ_STORE_PASSWORD=
SSLCOMMERZ_CURRENCY=BDT
SSLCOMMERZ_TIMEOUT=30
```

For production:

```env
SSLCOMMERZ_MODE=live
APP_URL=https://your-domain.com
```

## Install

```powershell
cd C:\Users\HP\nuhamart

Expand-Archive `
-Path .\NuhaMart-SSLCommerz-Payment-Module-v2.0.zip `
-DestinationPath . `
-Force

composer dump-autoload
php artisan optimize:clear
php artisan migrate

php artisan test --filter=SslCommerzPaymentTest
php artisan test --filter=SslCommerzPaymentV2Test

npm run build
```

## Full verification

```powershell
php artisan test
php artisan nuhamart:health-check
npm run build
```

## Important

SSLCommerz callback URLs must be publicly reachable. Local `127.0.0.1`
callbacks cannot be reached by the gateway. Use the sandbox with a public
HTTPS tunnel or deploy to a test domain before real callback testing.

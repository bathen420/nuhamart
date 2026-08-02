# Install v2.8.0

1. Merge the release files into the project.
2. Run `composer dump-autoload`, `php artisan optimize:clear`, and `php artisan migrate`.
3. Add sandbox credentials to `.env`.
4. Run the test suite and production build.
5. Configure the public IPN URL in the SSLCommerz merchant dashboard.

```env
PAYMENT_SSLCOMMERZ_ENABLED=true
SSLCOMMERZ_MODE=sandbox
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASSWORD=your_store_password
```

Callbacks must be publicly reachable over HTTPS for real sandbox/IPN testing. Never commit credentials.

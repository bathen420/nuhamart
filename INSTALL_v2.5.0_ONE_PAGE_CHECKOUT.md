# Install Nuha Mart BD v2.5.0

1. Back up `.env` and the database.
2. Merge the release files into the project root.
3. Run:

```powershell
composer dump-autoload
php artisan optimize:clear
php artisan test
php artisan nuhamart:health-check
npm run build
```

No migration is required.

Configure delivery charges, free-shipping threshold and payment instructions from Admin Settings.

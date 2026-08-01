# NuhaMart v1.0.0 Accounts Core — Installation

1. Ensure the project is on the v0.9.4 stable baseline and create a Git backup.
2. Extract this ZIP and copy all folders/files into the NuhaMart project root. Choose **Replace/Merge**.
3. Run:

```powershell
composer dump-autoload
php artisan optimize:clear
php artisan migrate
php artisan db:seed --class=RolesAndPermissionsSeeder
php artisan db:seed --class=AccountingSeeder
npm run build
php artisan test
```

4. Run `npm run dev`, hard-refresh the browser, then open:
- `/admin/accounts`
- `/admin/journals`
- `/admin/general-ledger`

## Rollback
Use Git to revert the release. The database migration can be rolled back with `php artisan migrate:rollback --step=1` only before real accounting entries are created.

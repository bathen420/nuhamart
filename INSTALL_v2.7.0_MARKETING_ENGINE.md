# Install v2.7.0

Copy/merge the package, then run:

```powershell
composer dump-autoload
php artisan optimize:clear
php artisan migrate
php artisan db:seed --class=RolesAndPermissionsSeeder
php artisan test
php artisan nuhamart:health-check
npm run build
```

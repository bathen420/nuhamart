# Installation — v2.6.0 Homepage CMS

1. Back up `.env` and the database.
2. Merge the package files into the project root.
3. Run:

```powershell
composer dump-autoload
php artisan optimize:clear
php artisan migrate
php artisan db:seed --class=RolesAndPermissionsSeeder
php artisan test
php artisan nuhamart:health-check
npm run build
```

Open **Admin → Homepage & Banners** to configure the preset, announcement bar, section visibility, hero slides and promotion cards.

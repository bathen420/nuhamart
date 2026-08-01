# Upgrade to v3.3.6

Run:

```bash
composer install
php artisan migrate
php artisan db:seed --class=RolesAndPermissionsSeeder
php artisan optimize:clear
npm install
npm run build
```

Then open **Catalogue > Units** to create units and **Catalogue > Product Variants** to add variants.

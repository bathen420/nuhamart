# Opening Stock Module

Adds warehouse-specific opening stock entries, immutable entry details, product aggregate stock synchronisation, weighted warehouse average cost, and stock history records.

## Upgrade

```bash
php artisan migrate
php artisan db:seed --class=RolesAndPermissionsSeeder
php artisan optimize:clear
npm run build
```

# Upgrade to NuhaMart v3.3.2

1. Back up the database and the current project.
2. Replace the project files with this release.
3. Run:

```bash
composer install
npm install
php artisan optimize:clear
php artisan migrate
php artisan db:seed --class=RolesAndPermissionsSeeder
php artisan db:seed --class=NotificationSeeder
npm run build
```

4. Sign out and sign in again so refreshed permissions are loaded.
5. Open `/admin/notifications` or use the bell in the top navigation bar.

# NuhaMart v3.3.1 Upgrade

1. Back up your current project and database.
2. Extract this ZIP and keep your existing `.env` file.
3. For SQLite, keep your existing `database/database.sqlite` file.
4. Run:

```bash
composer install
php artisan optimize:clear
php artisan migrate
php artisan db:seed --class=RolesAndPermissionsSeeder
npm install
npm run build
php artisan serve
```

After login, open **Administration → Activity Logs**. Super Admin automatically receives the new permissions. For other roles, edit the role and enable `activity-logs.view` and optionally `activity-logs.export`.

# NuhaMart v3.3.0 Installation / Upgrade

## Upgrade from v3.2.1
1. Back up the existing project and database.
2. Replace the project with this release, but preserve your `.env` and `database/database.sqlite` if using SQLite.
3. Open PowerShell in the project directory.
4. Run:
   ```bash
   composer update spatie/laravel-permission
   php artisan optimize:clear
   php artisan migrate
   php artisan db:seed --class=RolesAndPermissionsSeeder
   npm install
   npm run build
   php artisan serve
   ```
5. Sign in with `admin@nuhamart.com` / `password`, then change the password immediately.

## Important
- Existing admin account is updated and assigned `Super Admin`.
- Super Admin bypasses all permission checks.
- Inactive users are logged out automatically.
- Default password is for first installation only.

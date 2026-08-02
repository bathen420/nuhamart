# Nuha Mart BD v2.1.0 Lean Commerce Launch

## Upgrade an existing project

1. Back up `.env`, the database and uploaded files.
2. Copy this package over the current project using Merge/Replace.
3. Do not replace the existing `.env`.
4. Run:

```powershell
cd C:\Users\HP\nuhamart
composer install
npm install
npm run build
composer dump-autoload
php artisan optimize:clear
php artisan migrate
php artisan db:seed --class=RolesAndPermissionsSeeder
php artisan test
php artisan nuhamart:health-check
```

## Production server

1. Copy `.env.production.example` to `.env` and configure the domain, database, mail and payment values.
2. Build frontend assets locally or on the server with `npm ci && npm run build`.
3. Run:

```bash
./scripts/PREPARE_PRODUCTION.sh
```

For Windows hosting:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\PREPARE_PRODUCTION.ps1
```

## Important

- Point the web server document root to `public/`.
- Use HTTPS before accepting passwords or payment references.
- Keep `APP_DEBUG=false` in production.
- Configure a queue worker and scheduler before enabling email or gateway callbacks.
- Back up the database and `storage/app/public` daily.

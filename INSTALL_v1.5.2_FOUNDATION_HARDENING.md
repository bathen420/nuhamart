# NuhaMart v1.5.2 — Foundation Hardening

## Baseline
Install only on NuhaMart v1.5.1.

## What changes
- Central fail-closed permission enforcement for every named `/admin` route.
- Action-specific permissions for view/create/edit/delete/approve/print/export operations.
- Non-destructive database/accounting integrity service.
- `php artisan nuhamart:health-check` command.
- Authorization, route coverage and integrity regression tests.
- Windows release verification script.

## Installation
1. Stop `npm run dev`.
2. Copy every file/folder from this package into the project root and choose Merge/Replace.
3. Run:

```powershell
cd C:\Users\HP\nuhamart
composer dump-autoload
php artisan optimize:clear
php artisan db:seed --class=RolesAndPermissionsSeeder
php artisan test
php artisan nuhamart:health-check
npm run build
```

No migration is included. Existing business data is not modified.

## Important permission behaviour
A non-Super-Admin user now receives HTTP 403 when a named admin route has no permission mapping or the required permission is absent. This is intentional fail-closed security.

After installation, review custom roles and assign the permissions they actually require.

## Full verification

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\VERIFY_RELEASE_WINDOWS.ps1
```

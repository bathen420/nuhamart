# Nuha Mart BD — Customer Authentication Final Fix

## Root cause

`resources/js/bootstrap.js` permanently copied the CSRF token from the initial HTML meta tag into Axios' `X-CSRF-TOKEN` header. In an Inertia SPA, logout/login regenerates the session token without reloading the root HTML. The old fixed header then overrides the fresh XSRF cookie and Laravel returns 419.

## Fixes

- Removed the fixed meta-token Axios header.
- Axios now reads Laravel's fresh `XSRF-TOKEN` cookie on every request.
- Added dedicated customer POST endpoints.
- Customer Login/Register forms use the dedicated endpoints.
- Customer accounts cannot be redirected into a stale admin intended URL.
- Added authentication regression tests.

## Install

Extract this ZIP into the project root using Merge/Replace, then run:

```powershell
composer dump-autoload
php artisan optimize:clear
php artisan test --filter=CustomerAuthenticationFlowTest
php artisan test
npm run build
```

Close old localhost tabs, remove cookies for `127.0.0.1`, and test in a new browser window.

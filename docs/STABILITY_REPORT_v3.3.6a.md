# NuhaMart v3.3.6a Stability Report

## Fixed

- Restored Laravel controller authorization support with `AuthorizesRequests`.
- Corrected all Admin Orders Ziggy route names to use the `admin.` prefix.
- Corrected Admin Order controller redirects to named admin routes.
- Corrected Orders list fields (`order_no` and `status`).
- Prevented empty DataTable pages from crashing when no custom empty-state icon is supplied.
- Stabilised sidebar width, icon sizing, text truncation, vertical scrolling and Super Admin role matching.
- Removed duplicate global page padding from the authenticated layout.

## Validation performed

- PHP syntax lint passed for all PHP files under `app`, `routes`, and `database`.
- Route reference scan found no remaining unprefixed Admin Orders route calls.
- ZIP integrity is checked after packaging.

## Environment limitation

`npm install` could not complete in the build container because one dependency tarball was unavailable from the internal npm mirror. Run `npm install` and `npm run build` locally.

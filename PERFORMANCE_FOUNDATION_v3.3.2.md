# NuhaMart v3.3.2 Performance Foundation

## Included

- Dashboard analytics cached for 60 seconds.
- Repeated dashboard visits avoid running the full analytics query set.
- Added an Artisan command to clear the dashboard cache manually.
- Compatible with the default file cache and Redis cache.

## Install

Extract the patch into the NuhaMart project root and replace matching files.

```bash
php artisan optimize:clear
php artisan dashboard:clear-cache
npm run build
```

## Notes

The dashboard can show data that is up to 60 seconds old. Clear it immediately after a bulk import or maintenance operation with:

```bash
php artisan dashboard:clear-cache
```

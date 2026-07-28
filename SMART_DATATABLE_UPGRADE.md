# NuhaMart v3.3.2 — Smart DataTable Upgrade

## Included

- Reusable DataTable skeleton loading state.
- Debounced product search (300ms).
- Server-side search, status, category and brand filters.
- Server-side sorting for ID, name, price, stock and created date.
- Configurable page size: 10, 25, 50 or 100.
- Product table migrated to shared UI components.
- Lazy-loaded product images.
- Responsive toolbar and professional empty state.

## Installation

Copy the patch files over the current project, then run:

```bash
php artisan optimize:clear
npm install
npm run build
```

No database migration is required.

## Test URL

`/admin/products`

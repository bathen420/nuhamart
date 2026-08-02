# Nuha Mart BD Lean Commerce Audit

## Launch-first decision

The current business needs a fast customer storefront and a simple admin workflow. Advanced ERP code is retained for compatibility, but removed from the everyday sidebar. This avoids breaking migrations, relations, permissions, accounting posts, and existing data while keeping the admin experience focused.

## Visible daily admin modules

- Dashboard
- Homepage & banners
- Orders
- Products & books
- Categories
- Authors
- Publishers
- Brands
- Customers
- Coupons & gift vouchers
- Inventory and stock adjustments
- Barcode & labels
- Purchases
- Suppliers
- Reports
- Settings
- Users, roles, permissions, activity logs, notifications

## Advanced modules hidden from the daily sidebar

- Enterprise POS shifts, cash drawer and held sales
- Purchase requisitions, purchase-order approvals and goods receipts
- Warehouse transfers and advanced warehouse workflows
- Customer and supplier groups
- Manual journals and advanced financial-statement screens
- Detailed stock-ledger screens

The routes and backend code remain available. This is safer than deleting already-migrated modules and does not prevent re-enabling them later.

## Removed from this launch package

- `.git`
- `.env`
- `node_modules`
- `vendor`
- tests and development documentation
- local SQLite database
- local logs, cached views, sessions and cache files
- old verification and upgrade files

## Performance impact

Deleting PHP source files has little effect on storefront response time. The important launch optimizations are:

- production Vite assets already included in `public/build`
- Composer production install with `--no-dev`
- Laravel config, route, event and view cache
- optimized database queries and pagination already used by the storefront
- lazy-loaded product images
- compressed WebP/AVIF product and banner images on the live store
- PHP OPcache and web-server compression

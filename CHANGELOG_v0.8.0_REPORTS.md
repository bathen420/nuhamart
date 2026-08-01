# Changelog — NuhaMart v0.8.0 Reports

## Added

- Reports dashboard with date range summary
- Sales report with pagination
- Customer, payment method, payment status, search and date filters
- Gross Sales, Sales Returns, Net Sales and Sales Count cards
- Browser print layout
- UTF-8 CSV export
- Reports sidebar navigation
- `reports.view` and `reports.export` permissions
- Reports route test

## Changed

- `routes/web.php`: registered protected reports routes
- `AdminSidebar.jsx`: added Reports menu item
- `RolesAndPermissionsSeeder.php`: added report permissions and synchronized Super Admin permissions

## Database

No migration is required for this release.

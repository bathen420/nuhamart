# Changelog

## v3.3.2 — Enterprise Foundation

- Added a complete per-user Notification Centre.
- Added notification bell, unread counter and dropdown to the admin navbar.
- Added notification search, filters, pagination, mark-read, mark-unread and delete actions.
- Added repository and service layers for notifications.
- Added permission checks for viewing and deleting notifications.
- Added activity logging for the mark-all-read action.
- Added demo notification seeder and feature tests.

## v3.3.2 Performance Foundation

- Added a 60-second cache for dashboard analytics.
- Added `dashboard:clear-cache` Artisan command.
- Reduced repeated dashboard database work.

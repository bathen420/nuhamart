# NuhaMart v3.3.1 — Activity Log System

## Added
- Activity log database with SQLite and MySQL support
- Login and logout tracking
- Automatic logging for successful admin create, update, delete, checkout and return operations
- User, module, action, date-range and keyword filters
- IP address, route and request-method recording
- Paginated activity log screen
- CSV export and print view
- Permission-controlled Activity Logs sidebar item
- Dashboard Recent Activity widget
- `activity-logs.view` and `activity-logs.export` permissions

## Security
- Passwords, password confirmations, CSRF tokens and method fields are never stored in activity properties
- Failed HTTP requests are not recorded as successful activities
- Activity log viewing and exporting are protected by permissions

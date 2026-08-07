# Nuha Mart BD — Enterprise Admin Layout v6.1

This package applies the NuhaMart Enterprise Design System to the global admin
shell.

## Included

- Premium dark sidebar
- Collapsible desktop navigation
- Responsive mobile navigation drawer
- Grouped permission-aware navigation
- Professional sticky top header
- Ctrl/Cmd + K command palette
- Global destination search
- Redesigned notification center
- Professional user profile dropdown
- View Store and Business Settings shortcuts
- Unified page width and content container
- Modern flash success/error messages
- Sidebar collapsed state persistence

## Prerequisite

Install `NuhaMart-Enterprise-Design-System-v6.0.zip` first.

## Install

```powershell
cd C:\Users\HP\nuhamart

Expand-Archive `
-Path .\NuhaMart-Enterprise-Admin-Layout-v6.1.zip `
-DestinationPath . `
-Force

php artisan optimize:clear
npm run build
```

## Verification

Open:

```text
http://127.0.0.1:8000/admin/dashboard
```

Verify:

1. Sidebar collapse/expand.
2. Mobile menu at narrow browser width.
3. Ctrl + K command palette.
4. Search and route navigation.
5. Notification dropdown.
6. Profile dropdown.
7. Existing permission-based menu visibility.
8. Business Settings and other admin pages.
9. Success and error flash messages.

Then run:

```powershell
php artisan test
php artisan nuhamart:health-check
npm run build
```

## Rollback

Restore:

```text
resources/js/Layouts/AuthenticatedLayout.jsx
resources/js/Components/AdminSidebar.jsx
resources/js/Components/AdminMenuItem.jsx
resources/js/Components/Admin/Navbar.jsx
resources/js/Components/Notifications/NotificationBell.jsx
```

Remove:

```text
resources/js/Components/Admin/AdminNavigation.js
resources/js/Components/Admin/CommandPalette.jsx
```

## Next phase

Enterprise Dashboard v6.2:

- Compact command-center header
- High-density KPI cards
- Sales and profit analytics
- Recent orders
- Low-stock alerts
- Courier and payment summaries
- Activity feed

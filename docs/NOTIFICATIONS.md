# Notification Centre Architecture

The module follows:

`Controller → FormRequest → Service → Repository Interface → Repository → Model`

## Backend

- `NotificationController` handles authenticated Inertia actions.
- `NotificationFilterRequest` validates list filters.
- `NotificationService` enforces ownership and coordinates activity logging.
- `NotificationRepository` contains database queries.
- Every read, update and delete operation is scoped to the signed-in user.

## Frontend

- `NotificationBell.jsx` displays the latest unread notifications.
- `Admin/Notifications/Index.jsx` provides history, search, filters and actions.
- Notification summary data is shared through `HandleInertiaRequests`.

## Permissions

- `notifications.view`
- `notifications.delete`

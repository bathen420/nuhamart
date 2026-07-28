<?php

namespace App\Repositories\Notification;

use App\Models\Notification;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface NotificationRepositoryInterface
{
    public function paginateByUser(int $userId, array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function recentUnread(int $userId, int $limit = 8): Collection;

    public function unreadCount(int $userId): int;

    public function findForUser(int $id, int $userId): ?Notification;

    public function create(array $data): Notification;

    public function markAsRead(Notification $notification): bool;

    public function markAsUnread(Notification $notification): bool;

    public function markAllAsRead(int $userId): int;

    public function delete(Notification $notification): bool;

    public function deleteRead(int $userId): int;
}

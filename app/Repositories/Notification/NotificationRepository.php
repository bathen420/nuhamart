<?php

namespace App\Repositories\Notification;

use App\Models\Notification;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class NotificationRepository implements NotificationRepositoryInterface
{
    public function paginateByUser(int $userId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return Notification::query()
            ->where('user_id', $userId)
            ->when($filters['search'] ?? null, function (Builder $query, string $search): void {
                $query->where(function (Builder $nested) use ($search): void {
                    $nested->where('title', 'like', "%{$search}%")
                        ->orWhere('message', 'like', "%{$search}%");
                });
            })
            ->when($filters['status'] ?? null, function (Builder $query, string $status): void {
                match ($status) {
                    'read' => $query->where('is_read', true),
                    'unread' => $query->where('is_read', false),
                    default => null,
                };
            })
            ->when($filters['type'] ?? null, fn (Builder $query, string $type) => $query->where('type', $type))
            ->latest('id')
            ->paginate(min(max($perPage, 10), 100))
            ->withQueryString();
    }

    public function recentUnread(int $userId, int $limit = 8): Collection
    {
        return Notification::query()
            ->where('user_id', $userId)
            ->where('is_read', false)
            ->latest('id')
            ->limit(min(max($limit, 1), 20))
            ->get();
    }

    public function unreadCount(int $userId): int
    {
        return Notification::query()
            ->where('user_id', $userId)
            ->where('is_read', false)
            ->count();
    }

    public function findForUser(int $id, int $userId): ?Notification
    {
        return Notification::query()
            ->whereKey($id)
            ->where('user_id', $userId)
            ->first();
    }

    public function create(array $data): Notification
    {
        return Notification::query()->create($data);
    }

    public function markAsRead(Notification $notification): bool
    {
        if ($notification->is_read) {
            return true;
        }

        return $notification->update([
            'is_read' => true,
            'read_at' => now(),
        ]);
    }

    public function markAsUnread(Notification $notification): bool
    {
        return $notification->update([
            'is_read' => false,
            'read_at' => null,
        ]);
    }

    public function markAllAsRead(int $userId): int
    {
        return Notification::query()
            ->where('user_id', $userId)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
                'updated_at' => now(),
            ]);
    }

    public function delete(Notification $notification): bool
    {
        return (bool) $notification->delete();
    }

    public function deleteRead(int $userId): int
    {
        return Notification::query()
            ->where('user_id', $userId)
            ->where('is_read', true)
            ->delete();
    }
}

<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use App\Repositories\Notification\NotificationRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class NotificationService
{
    public function __construct(
        protected NotificationRepositoryInterface $repository,
        protected ActivityLogService $activityLogService,
    ) {}

    public function paginateForUser(User $user, array $filters = []): LengthAwarePaginator
    {
        return $this->repository->paginateByUser(
            $user->getKey(),
            $filters,
            (int) ($filters['per_page'] ?? 15),
        );
    }

    public function recentUnread(User $user, int $limit = 8): Collection
    {
        return $this->repository->recentUnread($user->getKey(), $limit);
    }

    public function unreadCount(User $user): int
    {
        return $this->repository->unreadCount($user->getKey());
    }

    public function createForUser(User $user, array $data): Notification
    {
        return $this->repository->create([
            ...$data,
            'user_id' => $user->getKey(),
            'is_read' => false,
            'read_at' => null,
        ]);
    }

    public function markAsRead(User $user, int $notificationId): Notification
    {
        $notification = $this->ownedNotification($user, $notificationId);
        $this->repository->markAsRead($notification);

        return $notification->refresh();
    }

    public function markAsUnread(User $user, int $notificationId): Notification
    {
        $notification = $this->ownedNotification($user, $notificationId);
        $this->repository->markAsUnread($notification);

        return $notification->refresh();
    }

    public function markAllAsRead(User $user): int
    {
        return DB::transaction(function () use ($user): int {
            $count = $this->repository->markAllAsRead($user->getKey());

            if ($count > 0) {
                $this->activityLogService->record(
                    'notifications',
                    'mark_all_read',
                    "Marked {$count} notifications as read",
                    $user,
                    request(),
                    properties: ['count' => $count],
                );
            }

            return $count;
        });
    }

    public function delete(User $user, int $notificationId): void
    {
        $notification = $this->ownedNotification($user, $notificationId);
        $this->repository->delete($notification);
    }

    public function deleteRead(User $user): int
    {
        return DB::transaction(fn (): int => $this->repository->deleteRead($user->getKey()));
    }

    private function ownedNotification(User $user, int $notificationId): Notification
    {
        $notification = $this->repository->findForUser($notificationId, $user->getKey());

        if (!$notification) {
            throw new RuntimeException('Notification not found.');
        }

        return $notification;
    }
}

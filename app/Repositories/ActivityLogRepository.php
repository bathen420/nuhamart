<?php

namespace App\Repositories;

use App\Models\ActivityLog;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class ActivityLogRepository
{
    public function create(array $data): ActivityLog
    {
        return ActivityLog::query()->create($data);
    }

    public function paginate(array $filters, int $perPage = 20): LengthAwarePaginator
    {
        return $this->filtered($filters)
            ->with('user:id,name,email')
            ->latest('id')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function exportRows(array $filters): Collection
    {
        return $this->filtered($filters)
            ->with('user:id,name,email')
            ->latest('id')
            ->limit(10000)
            ->get();
    }

    public function recent(int $limit = 10): Collection
    {
        return ActivityLog::query()
            ->with('user:id,name')
            ->latest('id')
            ->limit($limit)
            ->get();
    }

    private function filtered(array $filters): Builder
    {
        return ActivityLog::query()
            ->when($filters['search'] ?? null, function (Builder $query, string $search) {
                $query->where(function (Builder $q) use ($search) {
                    $q->where('description', 'like', "%{$search}%")
                        ->orWhere('ip_address', 'like', "%{$search}%")
                        ->orWhere('route_name', 'like', "%{$search}%")
                        ->orWhereHas('user', fn (Builder $u) => $u->where('name', 'like', "%{$search}%"));
                });
            })
            ->when($filters['user_id'] ?? null, fn (Builder $q, $id) => $q->where('user_id', $id))
            ->when($filters['module'] ?? null, fn (Builder $q, $module) => $q->where('module', $module))
            ->when($filters['action'] ?? null, fn (Builder $q, $action) => $q->where('action', $action))
            ->when($filters['from'] ?? null, fn (Builder $q, $date) => $q->whereDate('created_at', '>=', $date))
            ->when($filters['to'] ?? null, fn (Builder $q, $date) => $q->whereDate('created_at', '<=', $date));
    }
}

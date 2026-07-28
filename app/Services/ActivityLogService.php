<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\User;
use App\Repositories\ActivityLogRepository;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Throwable;

class ActivityLogService
{
    public function __construct(protected ActivityLogRepository $repository) {}

    public function record(
        string $module,
        string $action,
        string $description,
        ?User $user = null,
        ?Request $request = null,
        ?Model $subject = null,
        array $properties = []
    ): ?ActivityLog {
        if (!Schema::hasTable('activity_logs')) {
            return null;
        }

        try {
            return $this->repository->create([
                'user_id' => $user?->id,
                'module' => $module,
                'action' => $action,
                'description' => $description,
                'subject_type' => $subject ? $subject::class : null,
                'subject_id' => $subject?->getKey(),
                'route_name' => $request?->route()?->getName(),
                'method' => $request?->method(),
                'ip_address' => $request?->ip(),
                'user_agent' => $request?->userAgent(),
                'properties' => $properties ?: null,
            ]);
        } catch (Throwable $exception) {
            report($exception);
            return null;
        }
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ActivityLogFilterRequest;
use App\Models\ActivityLog;
use App\Models\User;
use App\Repositories\ActivityLogRepository;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ActivityLogController extends Controller
{
    public function __construct(protected ActivityLogRepository $repository) {}

    public function index(ActivityLogFilterRequest $request): Response
    {
        $filters = $request->validated();
        $logs = $this->repository->paginate($filters, (int) ($filters['per_page'] ?? 20));

        return Inertia::render('Admin/ActivityLogs/Index', [
            'logs' => $logs,
            'filters' => $filters,
            'users' => User::query()->orderBy('name')->get(['id', 'name']),
            'modules' => ActivityLog::query()->distinct()->orderBy('module')->pluck('module'),
            'actions' => ActivityLog::query()->distinct()->orderBy('action')->pluck('action'),
        ]);
    }

    public function export(ActivityLogFilterRequest $request): StreamedResponse
    {
        $rows = $this->repository->exportRows($request->validated());
        $filename = 'activity-logs-' . now()->format('Y-m-d-His') . '.csv';

        return response()->streamDownload(function () use ($rows) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Date & Time', 'User', 'Module', 'Action', 'Description', 'IP Address', 'Route']);
            foreach ($rows as $log) {
                fputcsv($handle, [
                    $log->created_at?->format('Y-m-d H:i:s'),
                    $log->user?->name ?? 'System',
                    $log->module,
                    $log->action,
                    $log->description,
                    $log->ip_address,
                    $log->route_name,
                ]);
            }
            fclose($handle);
        }, $filename, ['Content-Type' => 'text/csv; charset=UTF-8']);
    }
}

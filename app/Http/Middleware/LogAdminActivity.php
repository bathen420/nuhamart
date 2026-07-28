<?php

namespace App\Http\Middleware;

use App\Services\ActivityLogService;
use Closure;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LogAdminActivity
{
    public function __construct(protected ActivityLogService $service) {}

    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (!$request->user() || $request->isMethod('GET') || $response->getStatusCode() >= 400) {
            return $response;
        }

        $routeName = (string) $request->route()?->getName();
        if (!$routeName || str_starts_with($routeName, 'admin.activity-logs.')) {
            return $response;
        }

        [$module, $action] = $this->resolve($routeName, $request->method());
        $subject = $this->routeSubject($request);
        $description = $this->description($request->user()->name, $module, $action, $subject);

        $this->service->record(
            $module,
            $action,
            $description,
            $request->user(),
            $request,
            $subject,
            ['fields' => array_keys($request->except(['password', 'password_confirmation', '_token', '_method']))]
        );

        return $response;
    }

    private function resolve(string $routeName, string $method): array
    {
        $name = str_replace('admin.', '', $routeName);
        $parts = explode('.', $name);
        $module = str_replace('-', ' ', $parts[0] ?? 'system');
        $routeAction = end($parts);
        $action = match ($routeAction) {
            'store', 'checkout' => 'created',
            'update' => 'updated',
            'destroy' => 'deleted',
            default => match (strtoupper($method)) {
                'POST' => 'created',
                'PUT', 'PATCH' => 'updated',
                'DELETE' => 'deleted',
                default => 'performed',
            },
        };

        if (str_contains($name, 'returns.store')) {
            $module = str_contains($name, 'purchases') ? 'purchase returns' : 'sales returns';
            $action = 'created';
        }

        return [$module, $action];
    }

    private function routeSubject(Request $request): ?Model
    {
        foreach ($request->route()?->parameters() ?? [] as $parameter) {
            if ($parameter instanceof Model) {
                return $parameter;
            }
        }
        return null;
    }

    private function description(string $user, string $module, string $action, ?Model $subject): string
    {
        $label = ucwords($module);
        $subjectText = $subject ? ' #' . $subject->getKey() : '';
        return "{$user} {$action} {$label}{$subjectText}";
    }
}

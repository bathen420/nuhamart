<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\NotificationFilterRequest;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;

class NotificationController extends Controller
{
    public function __construct(protected NotificationService $service) {}

    public function index(NotificationFilterRequest $request): Response
    {
        $filters = $request->validated();

        return Inertia::render('Admin/Notifications/Index', [
            'notifications' => $this->service->paginateForUser($request->user(), $filters),
            'filters' => $filters,
            'unreadCount' => $this->service->unreadCount($request->user()),
        ]);
    }

    public function markAsRead(int $notification, NotificationFilterRequest $request): RedirectResponse
    {
        try {
            $item = $this->service->markAsRead($request->user(), $notification);
        } catch (RuntimeException) {
            abort(404);
        }

        if ($item->url && $request->boolean('redirect')) {
            return redirect()->to($item->url);
        }

        return back()->with('success', 'Notification marked as read.');
    }

    public function markAsUnread(int $notification, NotificationFilterRequest $request): RedirectResponse
    {
        try {
            $this->service->markAsUnread($request->user(), $notification);
        } catch (RuntimeException) {
            abort(404);
        }

        return back()->with('success', 'Notification marked as unread.');
    }

    public function markAllAsRead(NotificationFilterRequest $request): RedirectResponse
    {
        $count = $this->service->markAllAsRead($request->user());

        return back()->with('success', $count > 0 ? "{$count} notifications marked as read." : 'No unread notifications found.');
    }

    public function destroy(int $notification, NotificationFilterRequest $request): RedirectResponse
    {
        try {
            $this->service->delete($request->user(), $notification);
        } catch (RuntimeException) {
            abort(404);
        }

        return back()->with('success', 'Notification deleted.');
    }

    public function destroyRead(NotificationFilterRequest $request): RedirectResponse
    {
        $count = $this->service->deleteRead($request->user());

        return back()->with('success', $count > 0 ? "{$count} read notifications deleted." : 'No read notifications found.');
    }
}

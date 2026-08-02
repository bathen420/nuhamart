<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TrackOrderController extends Controller
{
    public function index(): Response { return Inertia::render('Storefront/TrackOrder/Index', ['trackedOrder' => null]); }

    public function search(Request $request): Response
    {
        $data = $request->validate(['order_no' => ['required', 'string', 'max:80'], 'phone' => ['required', 'regex:/^01[3-9][0-9]{8}$/']]);
        $order = Order::query()->with(['statusHistories' => fn ($query) => $query->oldest('recorded_at')])->where('order_no', $data['order_no'])->where('customer_phone', $data['phone'])->first();

        return Inertia::render('Storefront/TrackOrder/Index', ['trackedOrder' => $order ? [
            'order_no' => $order->order_no, 'status' => $order->status, 'payment_status' => $order->payment_status, 'total' => (float) $order->total,
            'ordered_at' => $order->ordered_at?->toIso8601String(),
            'timeline' => $order->statusHistories->map(fn ($history) => ['status' => $history->status, 'title' => $history->title, 'note' => $history->note, 'recorded_at' => $history->recorded_at?->toIso8601String()]),
        ] : false]);
    }
}

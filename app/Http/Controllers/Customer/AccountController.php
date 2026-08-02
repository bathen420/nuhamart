<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    public function dashboard(Request $request): Response
    {
        $orders = $this->ordersFor($request)->withCount('items')->latest('ordered_at')->limit(5)->get();

        return Inertia::render('Customer/Dashboard', [
            'summary' => [
                'orders' => $this->ordersFor($request)->count(),
                'pending' => $this->ordersFor($request)->whereIn('status', ['pending', 'confirmed', 'processing'])->count(),
                'delivered' => $this->ordersFor($request)->where('status', 'delivered')->count(),
                'spent' => (float) $this->ordersFor($request)->where('status', 'delivered')->sum('total'),
            ],
            'recentOrders' => $orders->map(fn (Order $order) => $this->orderSummary($order)),
        ]);
    }

    public function orders(Request $request): Response
    {
        $orders = $this->ordersFor($request)->withCount('items')->latest('ordered_at')->paginate(10)->withQueryString();
        $orders->through(fn (Order $order) => $this->orderSummary($order));

        return Inertia::render('Customer/Orders/Index', ['orders' => $orders]);
    }

    public function show(Request $request, Order $order): Response
    {
        abort_unless($this->owns($request, $order), 403);
        $order->load(['items.product', 'statusHistories' => fn ($query) => $query->oldest('recorded_at')]);

        return Inertia::render('Customer/Orders/Show', ['order' => [
            ...$this->orderSummary($order),
            'customer_name' => $order->customer_name,
            'customer_phone' => $order->customer_phone,
            'address' => collect([$order->area, $order->district, $order->division, $order->address])->filter()->implode(', '),
            'subtotal' => (float) $order->subtotal,
            'shipping_charge' => (float) $order->shipping_charge,
            'discount' => (float) $order->discount,
            'payment_method' => $order->payment_method,
            'payment_status' => $order->payment_status,
            'items' => $order->items->map(fn ($item) => ['name' => $item->product_name, 'quantity' => $item->quantity, 'unit_price' => (float) $item->unit_price, 'subtotal' => (float) $item->subtotal]),
            'timeline' => $order->statusHistories->map(fn ($history) => ['status' => $history->status, 'title' => $history->title, 'note' => $history->note, 'recorded_at' => $history->recorded_at?->toIso8601String()]),
        ]]);
    }

    private function ordersFor(Request $request)
    {
        return Order::query()->where(function ($query) use ($request) {
            $query->where('user_id', $request->user()->id)->orWhere(function ($legacy) use ($request) {
                $legacy->whereNull('user_id')->where('customer_email', $request->user()->email);
            });
        });
    }

    private function owns(Request $request, Order $order): bool
    {
        return (int) $order->user_id === (int) $request->user()->id
            || ($order->user_id === null && $order->customer_email && strcasecmp($order->customer_email, $request->user()->email) === 0);
    }

    private function orderSummary(Order $order): array
    {
        return ['id' => $order->id, 'order_no' => $order->order_no, 'status' => $order->status, 'payment_status' => $order->payment_status, 'total' => (float) $order->total, 'items_count' => $order->items_count ?? $order->items()->count(), 'ordered_at' => $order->ordered_at?->toIso8601String()];
    }
}

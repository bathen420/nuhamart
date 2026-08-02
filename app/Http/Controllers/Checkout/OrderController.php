<?php

namespace App\Http\Controllers\Checkout;

use App\Http\Controllers\Controller;
use App\Http\Requests\Checkout\StoreOrderRequest;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class OrderController extends Controller
{
    public function __construct(private readonly OrderService $orderService)
    {
    }

    public function create(Request $request): Response
    {
        return Inertia::render('Checkout/Index', [
            'customer' => $request->user() ? [
                'name' => $request->user()->name,
                'email' => $request->user()->email,
                'phone' => $request->user()->phone,
            ] : null,
            'savedAddresses' => $request->user()?->customerAddresses()->latest('is_default')->latest()->get() ?? [],
            'shippingRates' => config('commerce.shipping'),
            'paymentMethods' => collect(config('commerce.payments'))->filter(fn ($method) => $method['enabled'] ?? false)->map(fn ($method, $key) => ['key' => $key, ...$method])->values(),
        ]);
    }

    public function store(StoreOrderRequest $request): RedirectResponse
    {
        try {
            $payload = $request->validated();
            $payload['user_id'] = $request->user()?->id;
            $order = $this->orderService->place($payload);

            if ($request->user() && $request->boolean('save_address')) {
                if ($request->boolean('address_is_default')) {
                    $request->user()->customerAddresses()->update(['is_default' => false]);
                }

                $request->user()->customerAddresses()->create([
                    'label' => $payload['address_label'] ?? 'Home',
                    'name' => $payload['name'],
                    'phone' => $payload['phone'],
                    'division' => $payload['division'],
                    'district' => $payload['district'],
                    'area' => $payload['area'],
                    'address' => $payload['address'],
                    'is_default' => $request->boolean('address_is_default'),
                ]);
            }
            $request->session()->put('recent_order_id', $order->id);

            return redirect()->route('checkout.success', $order->order_no);
        } catch (Throwable $exception) {
            report($exception);

            return back()->withInput()->with('error', config('app.debug')
                ? $exception->getMessage()
                : 'Unable to place the order. Please review your cart and try again.');
        }
    }

    public function success(Request $request, string $orderNo): Response
    {
        $order = Order::query()->with('items.product')->where('order_no', $orderNo)->firstOrFail();
        $recentOrderId = (int) $request->session()->get('recent_order_id');

        abort_unless($recentOrderId === $order->id, 403);

        return Inertia::render('Checkout/Success', [
            'order' => [
                'order_no' => $order->order_no,
                'customer_name' => $order->customer_name,
                'phone' => $order->customer_phone,
                'subtotal' => (float) $order->subtotal,
                'shipping_charge' => (float) $order->shipping_charge,
                'discount' => (float) $order->discount,
                'total' => (float) $order->total,
                'payment_method' => $order->payment_method,
                'status' => $order->status,
                'items' => $order->items->map(fn ($item) => [
                    'name' => $item->product_name,
                    'quantity' => $item->quantity,
                    'unit_price' => (float) $item->unit_price,
                    'subtotal' => (float) $item->subtotal,
                ]),
            ],
        ]);
    }
}

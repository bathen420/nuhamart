<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class AccountController extends Controller
{
    private const FILTER_STATUSES = [
        'pending',
        'confirmed',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
    ];

    public function dashboard(Request $request): Response
    {
        $orders = $this->ordersFor($request)
            ->withCount('items')
            ->latest('ordered_at')
            ->limit(5)
            ->get();

        return Inertia::render('Customer/Dashboard', [
            'summary' => [
                'orders' => $this->ordersFor($request)->count(),
                'pending' => $this->ordersFor($request)
                    ->whereIn('status', ['pending', 'confirmed', 'processing'])
                    ->count(),
                'delivered' => $this->ordersFor($request)
                    ->where('status', 'delivered')
                    ->count(),
                'spent' => (float) $this->ordersFor($request)
                    ->where('status', 'delivered')
                    ->sum('total'),
            ],
            'recentOrders' => $orders->map(fn (Order $order) => $this->orderSummary($order)),
        ]);
    }

    public function orders(Request $request): Response
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:80'],
            'status' => ['nullable', 'in:all,pending,confirmed,processing,shipped,delivered,cancelled'],
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date', 'after_or_equal:from'],
        ]);

        $search = trim((string) ($validated['search'] ?? ''));
        $status = $validated['status'] ?? 'all';

        $query = $this->ordersFor($request)
            ->withCount('items')
            ->when($search !== '', fn (Builder $builder) => $builder->where('order_no', 'like', "%{$search}%"))
            ->when($status !== 'all', fn (Builder $builder) => $builder->where('status', $status))
            ->when(
                ! empty($validated['from']),
                fn (Builder $builder) => $builder->whereDate('ordered_at', '>=', $validated['from'])
            )
            ->when(
                ! empty($validated['to']),
                fn (Builder $builder) => $builder->whereDate('ordered_at', '<=', $validated['to'])
            )
            ->latest('ordered_at');

        $orders = $query->paginate(10)->withQueryString();
        $orders->through(fn (Order $order) => $this->orderSummary($order));

        $statusCounts = collect(['all', ...self::FILTER_STATUSES])
            ->mapWithKeys(fn (string $item) => [
                $item => $item === 'all'
                    ? $this->ordersFor($request)->count()
                    : $this->ordersFor($request)->where('status', $item)->count(),
            ]);

        return Inertia::render('Customer/Orders/Index', [
            'orders' => $orders,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'from' => $validated['from'] ?? '',
                'to' => $validated['to'] ?? '',
            ],
            'statusCounts' => $statusCounts,
        ]);
    }

    public function show(Request $request, Order $order): Response
    {
        $this->ensureOwnership($request, $order);

        $order->load([
            'items.product',
            'statusHistories' => fn ($query) => $query->oldest('recorded_at'),
            'paymentTransactions' => fn ($query) => $query->latest('id'),
        ]);

        return Inertia::render('Customer/Orders/Show', [
            'order' => [
                ...$this->orderSummary($order),
                'customer_name' => $order->customer_name,
                'customer_phone' => $order->customer_phone,
                'customer_email' => $order->customer_email,
                'division' => $order->division,
                'district' => $order->district,
                'area' => $order->area,
                'address' => $order->address,
                'full_address' => collect([
                    $order->address,
                    $order->area,
                    $order->district,
                    $order->division,
                ])->filter()->implode(', '),
                'note' => $order->note,
                'subtotal' => (float) $order->subtotal,
                'shipping_charge' => (float) $order->shipping_charge,
                'discount' => (float) $order->discount,
                'payment_method' => $order->payment_method,
                'payment_status' => $order->payment_status,
                'payment_transaction' => $order->paymentTransactions->first()
                    ? [
                        'transaction_id' => $order->paymentTransactions->first()->transaction_id,
                        'bank_transaction_id' => $order->paymentTransactions->first()->bank_transaction_id,
                        'status' => $order->paymentTransactions->first()->status,
                        'attempt_no' => $order->paymentTransactions->first()->attempt_no,
                        'initiated_at' => $order->paymentTransactions->first()->initiated_at?->toIso8601String(),
                        'paid_at' => $order->paymentTransactions->first()->paid_at?->toIso8601String(),
                        'failure_reason' => $order->paymentTransactions->first()->failure_reason,
                    ]
                    : null,
                'can_retry_payment' => $order->payment_method === 'sslcommerz'
                    && $order->payment_status !== 'paid'
                    && ! in_array($order->status, ['cancelled', 'delivered'], true),
                'shipping_method' => $order->shipping_method,
                'courier_name' => $order->courier_name,
                'tracking_number' => $order->tracking_number,
                'cancellation_requested_at' => $order->cancellation_requested_at?->toIso8601String(),
                'cancellation_reason' => $order->cancellation_reason,
                'can_request_cancellation' => in_array($order->status, ['pending', 'confirmed'], true)
                    && $order->cancellation_requested_at === null,
                'items' => $order->items->map(fn ($item) => [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'name' => $item->product_name,
                    'sku' => $item->sku,
                    'quantity' => (int) $item->quantity,
                    'unit_price' => (float) $item->unit_price,
                    'subtotal' => (float) $item->subtotal,
                    'product' => $item->product ? [
                        'id' => $item->product->id,
                        'name' => $item->product->name,
                        'slug' => $item->product->slug,
                        'price' => (float) $item->product->price,
                        'sale_price' => $item->product->discount_price !== null
                            ? (float) $item->product->discount_price
                            : null,
                        'ebook_price' => $item->product->ebook_price !== null
                            ? (float) $item->product->ebook_price
                            : null,
                        'product_type' => $item->product->product_type,
                        'stock' => (int) $item->product->stock_quantity,
                        'image' => $this->imageUrl($item->product->image),
                    ] : null,
                ]),
                'timeline' => $order->statusHistories->map(fn ($history) => [
                    'status' => $history->status,
                    'title' => $history->title,
                    'note' => $history->note,
                    'recorded_at' => $history->recorded_at?->toIso8601String(),
                ]),
            ],
        ]);
    }

    public function invoice(Request $request, Order $order): SymfonyResponse
    {
        $this->ensureOwnership($request, $order);

        $order->load([
            'items.product',
            'courierConsignments' => fn ($query) => $query->latest(),
        ]);

        $pdf = Pdf::loadView('pdf.invoice', [
            'order' => $order,
        ])->setPaper('a4', 'portrait');

        $safeOrderNumber = preg_replace(
            '/[^A-Za-z0-9\-_]/',
            '-',
            (string) $order->order_no
        );

        return $pdf->download("Invoice-{$safeOrderNumber}.pdf");
    }

    public function reorder(Request $request, Order $order): JsonResponse
    {
        $this->ensureOwnership($request, $order);

        $order->load('items.product');

        $available = $order->items
            ->filter(fn ($item) => $item->product && $item->product->status)
            ->map(function ($item) {
                $product = $item->product;
                $isDigital = in_array($product->product_type, ['ebook', 'digital'], true);
                $quantity = $isDigital
                    ? 1
                    : min((int) $item->quantity, max(0, (int) $product->stock_quantity));

                if ($quantity < 1) {
                    return null;
                }

                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'price' => (float) $product->price,
                    'sale_price' => $product->discount_price !== null
                        ? (float) $product->discount_price
                        : null,
                    'ebook_price' => $product->ebook_price !== null
                        ? (float) $product->ebook_price
                        : null,
                    'product_type' => $product->product_type,
                    'stock' => (int) $product->stock_quantity,
                    'image' => $this->imageUrl($product->image),
                    'quantity' => $quantity,
                ];
            })
            ->filter()
            ->values();

        return response()->json([
            'items' => $available,
            'skipped' => $order->items->count() - $available->count(),
        ]);
    }

    public function requestCancellation(Request $request, Order $order): RedirectResponse
    {
        $this->ensureOwnership($request, $order);

        $data = $request->validate([
            'reason' => ['required', 'string', 'min:5', 'max:1000'],
        ]);

        abort_unless(in_array($order->status, ['pending', 'confirmed'], true), 422);
        abort_if($order->cancellation_requested_at !== null, 422);

        $order->forceFill([
            'cancellation_requested_at' => now(),
            'cancellation_reason' => $data['reason'],
        ])->save();

        $order->statusHistories()->create([
            'status' => $order->status,
            'title' => 'Cancellation requested',
            'note' => $data['reason'],
            'changed_by' => $request->user()->id,
            'recorded_at' => now(),
        ]);

        return back()->with('status', 'cancellation-requested');
    }

    private function ordersFor(Request $request): Builder
    {
        return Order::query()->where(function (Builder $query) use ($request) {
            $query->where('user_id', $request->user()->id)
                ->orWhere(function (Builder $legacy) use ($request) {
                    $legacy->whereNull('user_id')
                        ->where('customer_email', $request->user()->email);
                });
        });
    }

    private function owns(Request $request, Order $order): bool
    {
        return (int) $order->user_id === (int) $request->user()->id
            || (
                $order->user_id === null
                && $order->customer_email
                && strcasecmp($order->customer_email, $request->user()->email) === 0
            );
    }

    private function ensureOwnership(Request $request, Order $order): void
    {
        abort_unless($this->owns($request, $order), 403);
    }

    private function orderSummary(Order $order): array
    {
        return [
            'id' => $order->id,
            'order_no' => $order->order_no,
            'status' => $order->status,
            'payment_status' => $order->payment_status,
            'total' => (float) $order->total,
            'items_count' => $order->items_count ?? $order->items()->count(),
            'ordered_at' => $order->ordered_at?->toIso8601String(),
            'cancellation_requested_at' => $order->cancellation_requested_at?->toIso8601String(),
        ];
    }

    private function imageUrl(?string $image): ?string
    {
        if (! $image) {
            return null;
        }

        if (
            str_starts_with($image, 'http://')
            || str_starts_with($image, 'https://')
            || str_starts_with($image, '/')
        ) {
            return $image;
        }

        return Storage::disk('public')->url($image);
    }
}

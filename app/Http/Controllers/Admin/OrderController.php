<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\StockHistory;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:120'],
            'status' => ['nullable', 'in:pending,confirmed,processing,shipped,delivered,cancelled'],
            'payment_status' => ['nullable', 'in:pending,paid,failed'],
            'payment_method' => ['nullable', 'in:cod,sslcommerz,bkash,nagad'],
            'courier' => ['nullable', 'string', 'max:80'],
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date', 'after_or_equal:date_from'],
            'sort' => ['nullable', 'in:latest,oldest,total_high,total_low'],
        ]);

        $query = Order::query()
            ->withCount('items')
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('order_no', 'like', "%{$search}%")
                        ->orWhere('customer_name', 'like', "%{$search}%")
                        ->orWhere('customer_phone', 'like', "%{$search}%")
                        ->orWhere('tracking_number', 'like', "%{$search}%");
                });
            })
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->when($filters['payment_status'] ?? null, fn ($query, $status) => $query->where('payment_status', $status))
            ->when($filters['payment_method'] ?? null, fn ($query, $method) => $query->where('payment_method', $method))
            ->when($filters['courier'] ?? null, fn ($query, $courier) => $query->where('courier_name', 'like', "%{$courier}%"))
            ->when($filters['date_from'] ?? null, fn ($query, $date) => $query->whereDate('created_at', '>=', $date))
            ->when($filters['date_to'] ?? null, fn ($query, $date) => $query->whereDate('created_at', '<=', $date));

        match ($filters['sort'] ?? 'latest') {
            'oldest' => $query->oldest('id'),
            'total_high' => $query->orderByDesc('total'),
            'total_low' => $query->orderBy('total'),
            default => $query->latest('id'),
        };

        $summaryQuery = Order::query();

        return Inertia::render('Admin/Orders/Index', [
            'auth' => [
                'user' => auth()->user(),
            ],

            'orders' => $query->paginate(15)->withQueryString(),

            'filters' => $filters,

            'summary' => [
                'total' => (clone $summaryQuery)->count(),
                'today' => (clone $summaryQuery)->whereDate('created_at', today())->count(),
                'pending' => (clone $summaryQuery)->where('status', 'pending')->count(),
                'processing' => (clone $summaryQuery)->whereIn('status', ['confirmed', 'processing'])->count(),
                'shipped' => (clone $summaryQuery)->where('status', 'shipped')->count(),
                'delivered' => (clone $summaryQuery)->where('status', 'delivered')->count(),
                'cancelled' => (clone $summaryQuery)->where('status', 'cancelled')->count(),
                'pending_payment' => (clone $summaryQuery)->where('payment_status', 'pending')->count(),
                'revenue' => (float) (clone $summaryQuery)->where('status', 'delivered')->sum('total'),
            ],
        ]);
    }
    

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Orders/Create', [

            'auth' => [
                'user' => auth()->user(),
            ],

            'products' => Product::where('status', true)
                ->orderBy('name')
                ->get([
                    'id',
                    'name',
                    'price',
                    'stock_quantity',
                ]),

        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrderRequest $request)
    {
        try {

            $data = $request->validated();

            DB::transaction(function () use ($data) {

                $order = Order::create([

                    'order_no'         => $data['order_no'],
                    'customer_id'      => auth()->id(),
                    'customer_name'    => $data['customer_name'],
                    'customer_phone'   => $data['customer_phone'],
                    'customer_email'   => $data['customer_email'] ?? null,

                    'division'         => $data['division'] ?? null,
                    'district'         => $data['district'] ?? null,
                    'area'             => $data['area'] ?? null,
                    'address'          => $data['address'],

                    'note'             => $data['note'] ?? null,

                    'subtotal'         => $data['subtotal'],
                    'shipping_charge'  => $data['shipping_charge'] ?? 0,
                    'discount'         => $data['discount'] ?? 0,
                    'total'            => $data['total'],

                    'payment_method'   => $data['payment_method'],
                    'payment_status'   => $data['payment_status'],

                    'status'           => $data['status'],

                    'ordered_at'       => now(),

                ]);

                foreach ($data['items'] as $item) {

                    $product = Product::findOrFail($item['product_id']);

                    $stockBefore = $product->stock_quantity;

                    if ($stockBefore < $item['quantity']) {
                        throw new \Exception(
                            "Insufficient stock for {$product->name}"
                        );
                    }

                    $stockAfter = $stockBefore - $item['quantity'];

                    $order->items()->create([

                        'product_id'   => $product->id,
                        'product_name' => $product->name,
                        'sku'          => $product->sku,
                        'unit_price'   => $item['unit_price'],
                        'quantity'     => $item['quantity'],
                        'subtotal'     => $item['subtotal'],

                    ]);

                    $product->update([
                        'stock_quantity' => $stockAfter,
                    ]);

                    StockHistory::create([

                        'product_id'   => $product->id,
                        'user_id'      => auth()->id(),
                        'type'         => 'OUT',
                        'quantity'     => $item['quantity'],
                        'stock_before' => $stockBefore,
                        'stock_after'  => $stockAfter,
                        'reference'    => $order->order_no,
                        'note'         => 'Order Sale',

                    ]);
                }

            });

            return redirect()
                ->route('admin.orders.index')
                ->with('success', 'Order created successfully.');

        } catch (\Throwable $e) {

            return back()
                ->withErrors([
                    'error' => $e->getMessage(),
                ])
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        $order->load(['items.product', 'courierConsignments' => fn ($query) => $query->latest(), 'statusHistories' => fn ($query) => $query->latest('recorded_at')]);

        return Inertia::render('Admin/Orders/Show', [
            'auth' => [
                'user' => auth()->user(),
            ],

            'order' => $order,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order)
    {
        return Inertia::render('Admin/Orders/Edit', [
            'auth' => [
                'user' => auth()->user(),
            ],

            'order' => $order,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrderRequest $request, Order $order)
    {
        $data = $request->validated();

        $order->update($data);

        return redirect()
            ->route('admin.orders.index')
            ->with('success', 'Order updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        $order->delete();

        return redirect()
            ->route('admin.orders.index')
            ->with('success', 'Order deleted successfully.');
    }


    public function download(Order $order)
    {
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

        return $pdf->stream(
            "Invoice-{$safeOrderNumber}.pdf"
        );
    }

    
    
}
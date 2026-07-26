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
        $search = $request->get('search');

        $orders = Order::query()
            ->when($search, function ($query) use ($search) {
                $query->where('order_no', 'like', "%{$search}%")
                    ->orWhere('customer_name', 'like', "%{$search}%")
                    ->orWhere('customer_phone', 'like', "%{$search}%");
            })
            ->withCount('items')
            ->latest('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Orders/Index', [
            'auth' => [
                'user' => auth()->user(),
            ],

            'orders' => $orders,

            'filters' => [
                'search' => $search,
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
                ->route('orders.index')
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
        $order->load('items.product');

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
            ->route('orders.index')
            ->with('success', 'Order updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        $order->delete();

        return redirect()
            ->route('orders.index')
            ->with('success', 'Order deleted successfully.');
    }


    public function download(Order $order)
    {
        $order->load('items.product');

        $pdf = Pdf::loadView('pdf.invoice', [
            'order' => $order,
        ]);

        return $pdf->download(
            'Invoice-' . $order->order_no . '.pdf'
        );
    }

    
    
}
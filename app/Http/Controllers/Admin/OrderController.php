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

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search;

       $orders = Order::with('user')
    ->when($search, function ($query) use ($search) {

            $query->where('order_number', 'like', "%{$search}%")
                ->orWhere('customer_name', 'like', "%{$search}%")
                ->orWhere('customer_phone', 'like', "%{$search}%");

        })
        ->latest()
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
        DB::transaction(function () use ($request) {

            $order = Order::create([

                'order_number'     => $request->order_number,
                'user_id'          => auth()->id(),

                'customer_name'    => $request->customer_name,
                'customer_phone'   => $request->customer_phone,
                'customer_email'   => $request->customer_email,
                'customer_address' => $request->customer_address,

                'subtotal'         => $request->subtotal,
                'discount'         => $request->discount,
                'shipping'         => $request->shipping,
                'total'            => $request->total,

                'payment_method'   => $request->payment_method,
                'payment_status'   => $request->payment_status,
                'order_status'     => $request->order_status,

                'note'             => $request->note,

            ]);

            foreach ($request->items as $item) {

                $product = Product::findOrFail($item['product_id']);

                $order->items()->create([

                    'product_id' => $product->id,
                    'quantity'   => $item['quantity'],
                    'price'      => $item['price'],
                    'subtotal'   => $item['subtotal'],

                ]);

                $product->decrement(
                    'stock_quantity',
                    $item['quantity']
                );
            }

        });

        return redirect()
            ->route('orders.index')
            ->with('success', 'Order created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        $order->load('user');

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
        $order->load('user');

        return Inertia::render('Admin/Orders/Edit', [
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

    
    
}
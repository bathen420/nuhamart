<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\Supplier;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index(): Response
    {
        $lowStockLimit = 5;

        /*
        |--------------------------------------------------------------------------
        | Dashboard Statistics
        |--------------------------------------------------------------------------
        */

        $stats = [
            'products' => Product::count(),

            'categories' => Category::count(),

            'brands' => Brand::count(),

            'suppliers' => Supplier::count(),

            'orders' => Order::count(),

            'purchases' => Purchase::count(),

            /*
             * Customer module এখনো আলাদাভাবে তৈরি হয়নি।
             * তাই unique customer phone দিয়ে customer count করা হচ্ছে।
             */
            'customers' => Order::query()
                ->whereNotNull('customer_phone')
                ->where('customer_phone', '!=', '')
                ->distinct()
                ->count('customer_phone'),

            /*
             * Cancelled order-এর amount sales-এর মধ্যে ধরা হবে না।
             */
            'total_sales' => (float) Order::query()
                ->where('order_status', '!=', 'Cancelled')
                ->sum('total'),

            'total_purchase' => (float) Purchase::query()
                ->sum('total'),

            'today_sales' => (float) Order::query()
                ->whereDate('created_at', today())
                ->where('order_status', '!=', 'Cancelled')
                ->sum('total'),

            'today_purchase' => (float) Purchase::query()
                ->whereDate('created_at', today())
                ->sum('total'),

            'low_stock' => Product::query()
                ->where('stock_quantity', '>', 0)
                ->where('stock_quantity', '<=', $lowStockLimit)
                ->count(),

            'out_of_stock' => Product::query()
                ->where('stock_quantity', '<=', 0)
                ->count(),

            /*
             * এটি Pending Order-এর সংখ্যা।
             */
            'pending_orders' => Order::query()
                ->where('order_status', 'Pending')
                ->count(),

            /*
             * Pending payment order-এর মোট টাকার পরিমাণ।
             * তাই Dashboard-এ Currency হিসেবে দেখানো যাবে।
             */
            'pending_payments' => (float) Order::query()
                ->where('payment_status', 'Pending')
                ->where('order_status', '!=', 'Cancelled')
                ->sum('total'),

            /*
             * প্রয়োজন হলে Pending Payment-এর সংখ্যাও ব্যবহার করা যাবে।
             */
            'pending_payments_count' => Order::query()
                ->where('payment_status', 'Pending')
                ->where('order_status', '!=', 'Cancelled')
                ->count(),
        ];

        /*
        |--------------------------------------------------------------------------
        | Recent Orders
        |--------------------------------------------------------------------------
        */

        $recentOrders = Order::query()
            ->latest()
            ->take(5)
            ->get([
                'id',
                'order_number',
                'customer_name',
                'customer_phone',
                'total',
                'payment_status',
                'order_status',
                'created_at',
            ])
            ->map(function (Order $order): array {
                return [
                    'id' => $order->id,

                    'order_number' => $order->order_number,

                    'customer_name' => $order->customer_name
                        ?: 'Walk-in Customer',

                    'customer_phone' => $order->customer_phone,

                    'total' => (float) $order->total,

                    'payment_status' => $order->payment_status,

                    'order_status' => $order->order_status,

                    'created_at' => $order->created_at?->format('d M Y'),
                ];
            })
            ->values();

        /*
        |--------------------------------------------------------------------------
        | Recent Purchases
        |--------------------------------------------------------------------------
        */

        $recentPurchases = Purchase::query()
            ->with([
                'supplier:id,name,company_name',
            ])
            ->latest()
            ->take(5)
            ->get([
                'id',
                'purchase_number',
                'supplier_id',
                'total',
                'created_at',
            ])
            ->map(function (Purchase $purchase): array {
                return [
                    'id' => $purchase->id,

                    'purchase_number' => $purchase->purchase_number,

                    'supplier_name' => $purchase->supplier?->company_name
                        ?: $purchase->supplier?->name
                        ?: 'Unknown Supplier',

                    'total' => (float) $purchase->total,

                    'created_at' => $purchase->created_at?->format('d M Y'),
                ];
            })
            ->values();

        /*
        |--------------------------------------------------------------------------
        | Low Stock Products
        |--------------------------------------------------------------------------
        */

        $lowStockProducts = Product::query()
            ->with([
                'category:id,name',
                'brand:id,name',
            ])
            ->where('stock_quantity', '<=', $lowStockLimit)
            ->orderBy('stock_quantity')
            ->orderBy('name')
            ->take(10)
            ->get([
                'id',
                'category_id',
                'brand_id',
                'name',
                'sku',
                'price',
                'stock_quantity',
                'status',
            ])
            ->map(function (Product $product): array {
                return [
                    'id' => $product->id,

                    'name' => $product->name,

                    'sku' => $product->sku,

                    'category' => $product->category?->name
                        ?? 'Uncategorized',

                    'brand' => $product->brand?->name
                        ?? 'No Brand',

                    'price' => (float) $product->price,

                    'stock_quantity' => (int) $product->stock_quantity,

                    'status' => $product->status,
                ];
            })
            ->values();

        /*
        |--------------------------------------------------------------------------
        | Recent Products
        |--------------------------------------------------------------------------
        */

        $recentProducts = Product::query()
            ->with([
                'category:id,name',
                'brand:id,name',
            ])
            ->latest()
            ->take(5)
            ->get([
                'id',
                'category_id',
                'brand_id',
                'name',
                'sku',
                'price',
                'stock_quantity',
                'status',
                'created_at',
            ])
            ->map(function (Product $product): array {
                return [
                    'id' => $product->id,

                    'name' => $product->name,

                    'sku' => $product->sku,

                    'category' => $product->category?->name
                        ?? 'Uncategorized',

                    'brand' => $product->brand?->name
                        ?? 'No Brand',

                    'price' => (float) $product->price,

                    'stock_quantity' => (int) $product->stock_quantity,

                    'status' => $product->status,

                    'created_at' => $product->created_at?->format('d M Y'),
                ];
            })
            ->values();

        /*
        |--------------------------------------------------------------------------
        | Monthly Sales and Purchases
        |--------------------------------------------------------------------------
        |
        | বর্তমান মাসসহ সর্বশেষ ১২ মাসের তথ্য তৈরি করা হচ্ছে।
        |
        */

        $startDate = now()
            ->subMonths(11)
            ->startOfMonth();

        $endDate = now()
            ->endOfMonth();

        $orders = Order::query()
            ->whereBetween('created_at', [$startDate, $endDate])
            ->where('order_status', '!=', 'Cancelled')
            ->get([
                'total',
                'created_at',
            ]);

        $purchases = Purchase::query()
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get([
                'total',
                'created_at',
            ]);

        $monthlySales = $this->buildMonthlyChartData(
            records: $orders,
            startDate: $startDate,
            amountField: 'total'
        );

        $monthlyPurchases = $this->buildMonthlyChartData(
            records: $purchases,
            startDate: $startDate,
            amountField: 'total'
        );

        /*
        |--------------------------------------------------------------------------
        | Send Data to Dashboard
        |--------------------------------------------------------------------------
        */

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,

            'recentOrders' => $recentOrders,

            'recentPurchases' => $recentPurchases,

            'lowStockProducts' => $lowStockProducts,

            'recentProducts' => $recentProducts,

            /*
             * নতুন Dashboard.jsx এই structure ব্যবহার করছে।
             *
             * monthlyChartData.sales
             * monthlyChartData.purchases
             */
            'monthlyChartData' => [
                'sales' => [
                    'labels' => $monthlySales['labels'],
                    'values' => $monthlySales['values'],
                ],

                'purchases' => [
                    'labels' => $monthlyPurchases['labels'],
                    'values' => $monthlyPurchases['values'],
                ],
            ],

            'lowStockLimit' => $lowStockLimit,
        ]);
    }

    /**
     * Generate monthly chart labels and values.
     */
    private function buildMonthlyChartData(
        Collection $records,
        Carbon $startDate,
        string $amountField
    ): array {
        $groupedRecords = $records->groupBy(function ($record): string {
            return $record->created_at->format('Y-m');
        });

        $labels = [];
        $values = [];

        for ($month = 0; $month < 12; $month++) {
            $date = $startDate
                ->copy()
                ->addMonths($month);

            $monthKey = $date->format('Y-m');

            $labels[] = $date->format('M Y');

            $values[] = (float) $groupedRecords
                ->get($monthKey, collect())
                ->sum($amountField);
        }

        return [
            'labels' => $labels,
            'values' => $values,
        ];
    }
}
<?php

namespace App\Repositories;

use App\Models\Customer;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\SaleReturn;
use App\Models\Supplier;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class DashboardRepository
{
    /**
     * Get sales between two dates.
     */
    public function salesBetween(Carbon $from, Carbon $to): Collection
    {
        return Sale::query()
            ->whereBetween('created_at', [
                $from->copy()->startOfSecond(),
                $to->copy()->endOfSecond(),
            ])
            ->get([
                'id',
                'sale_number',
                'customer_id',
                'user_id',
                'subtotal',
                'discount',
                'tax',
                'shipping',
                'total',
                'paid_amount',
                'due_amount',
                'payment_method',
                'payment_status',
                'sale_status',
                'created_at',
            ]);
    }

    /**
     * Get purchases between two dates.
     */
    public function purchasesBetween(Carbon $from, Carbon $to): Collection
    {
        return Purchase::query()
            ->whereBetween('created_at', [
                $from->copy()->startOfSecond(),
                $to->copy()->endOfSecond(),
            ])
            ->get([
                'id',
                'total',
                'created_at',
            ]);
    }

    /**
     * Get total sales amount.
     */
    public function totalSales(): float
    {
        return (float) Sale::query()->sum('total');
    }

    /**
     * Get total purchase amount.
     */
    public function totalPurchases(): float
    {
        return (float) Purchase::query()->sum('total');
    }

    /**
     * Get total outstanding customer due.
     */
    public function totalDue(): float
    {
        return (float) Sale::query()->sum('due_amount');
    }

    /**
     * Get main dashboard counts.
     */
    public function counts(int $lowStockLimit = 5): array
    {
        return [
            'products' => Product::query()->count(),

            'customers' => Customer::query()->count(),

            'suppliers' => Supplier::query()->count(),

            'sales' => Sale::query()->count(),

            'purchases' => Purchase::query()->count(),

            'low_stock' => Product::query()
                ->where('stock_quantity', '>', 0)
                ->where('stock_quantity', '<=', $lowStockLimit)
                ->count(),

            'out_of_stock' => Product::query()
                ->where('stock_quantity', '<=', 0)
                ->count(),
        ];
    }

    /**
     * Get latest sales with customer and cashier details.
     */
    public function recentSales(int $limit = 7): Collection
    {
        return Sale::query()
            ->with([
                'customer:id,name,phone',
                'user:id,name',
            ])
            ->latest('id')
            ->limit($limit)
            ->get([
                'id',
                'sale_number',
                'customer_id',
                'user_id',
                'subtotal',
                'discount',
                'tax',
                'shipping',
                'total',
                'paid_amount',
                'due_amount',
                'payment_method',
                'payment_status',
                'sale_status',
                'created_at',
            ]);
    }

    /**
     * Get low-stock and out-of-stock products.
     */
    public function lowStockProducts(
        int $limit = 8,
        int $lowStockLimit = 5
    ): Collection {
        return Product::query()
            ->with([
                'category:id,name',
                'brand:id,name',
            ])
            ->where('stock_quantity', '<=', $lowStockLimit)
            ->orderBy('stock_quantity')
            ->orderBy('name')
            ->limit($limit)
            ->get([
                'id',
                'category_id',
                'brand_id',
                'name',
                'sku',
                'stock_quantity',
                'price',
            ]);
    }

    /**
     * Get best-selling products based on sold quantity.
     */
    public function bestSellingProducts(int $limit = 7): Collection
    {
        return SaleItem::query()
            ->selectRaw(
                '
                product_id,
                SUM(quantity) as quantity_sold,
                SUM(subtotal) as revenue
                '
            )
            ->with([
                'product:id,name,sku,stock_quantity',
            ])
            ->groupBy('product_id')
            ->orderByDesc('quantity_sold')
            ->limit($limit)
            ->get();
    }

    /**
     * Get sales count for today.
     */
    public function todaySalesCount(): int
    {
        return Sale::query()
            ->whereDate('created_at', today())
            ->count();
    }

    /**
     * Get today's total sales amount.
     */
    public function todaySalesAmount(): float
    {
        return (float) Sale::query()
            ->whereDate('created_at', today())
            ->sum('total');
    }

    /**
     * Get current month's total sales amount.
     */
    public function monthlySalesAmount(): float
    {
        return (float) Sale::query()
            ->whereYear('created_at', now()->year)
            ->whereMonth('created_at', now()->month)
            ->sum('total');
    }

    /**
     * Get current month's sales count.
     */
    public function monthlySalesCount(): int
    {
        return Sale::query()
            ->whereYear('created_at', now()->year)
            ->whereMonth('created_at', now()->month)
            ->count();
    }

    /**
     * Get today's total purchase amount.
     */
    public function todayPurchaseAmount(): float
    {
        return (float) Purchase::query()
            ->whereDate('created_at', today())
            ->sum('total');
    }

    /**
     * Get current month's total purchase amount.
     */
    public function monthlyPurchaseAmount(): float
    {
        return (float) Purchase::query()
            ->whereYear('created_at', now()->year)
            ->whereMonth('created_at', now()->month)
            ->sum('total');
    }

    /**
     * Get products currently in stock.
     */
    public function inStockProductsCount(): int
    {
        return Product::query()
            ->where('stock_quantity', '>', 0)
            ->count();
    }

    /**
     * Get completed sales returns between two dates.
     */
    public function saleReturnsBetween(Carbon $from, Carbon $to): Collection
    {
        return SaleReturn::query()
            ->where('status', 'completed')
            ->whereBetween('return_date', [
                $from->toDateString(),
                $to->toDateString(),
            ])
            ->get(['id', 'subtotal', 'refund_amount', 'return_date']);
    }

    /**
     * Get total completed sales-return amount.
     */
    public function totalSaleReturns(): float
    {
        return (float) SaleReturn::query()
            ->where('status', 'completed')
            ->sum('subtotal');
    }
}

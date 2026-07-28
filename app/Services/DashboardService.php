<?php

namespace App\Services;

use App\Repositories\DashboardRepository;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Cache;
use App\Models\ActivityLog;

class DashboardService
{
    public function __construct(
        protected DashboardRepository $repository
    ) {
    }

    public function data(): array
    {
        return Cache::remember('dashboard.analytics.v3.3.2', now()->addSeconds(60), function (): array {
            return $this->buildData();
        });
    }

    public function clearCache(): void
    {
        Cache::forget('dashboard.analytics.v3.3.2');
    }

    private function buildData(): array
    {
        $lowStockLimit = 5;
        $todayStart = now()->startOfDay();
        $todayEnd = now()->endOfDay();
        $monthStart = now()->startOfMonth();
        $monthEnd = now()->endOfMonth();
        $chartStart = now()->subMonths(11)->startOfMonth();

        $todaySales = $this->repository->salesBetween($todayStart, $todayEnd);
        $monthSales = $this->repository->salesBetween($monthStart, $monthEnd);
        $chartSales = $this->repository->salesBetween($chartStart, $monthEnd);

        $todayPurchases = $this->repository->purchasesBetween($todayStart, $todayEnd);
        $monthPurchases = $this->repository->purchasesBetween($monthStart, $monthEnd);
        $chartPurchases = $this->repository->purchasesBetween($chartStart, $monthEnd);

        $todayReturns = $this->repository->saleReturnsBetween($todayStart, $todayEnd);
        $monthReturns = $this->repository->saleReturnsBetween($monthStart, $monthEnd);

        $counts = $this->repository->counts($lowStockLimit);

        return [
            'stats' => [
                ...$counts,
                'today_sales' => (float) $todaySales->sum('total'),
                'today_sales_count' => $todaySales->count(),
                'month_sales' => (float) $monthSales->sum('total'),
                'month_sales_count' => $monthSales->count(),
                'total_sales' => $this->repository->totalSales(),
                'today_purchase' => (float) $todayPurchases->sum('total'),
                'month_purchase' => (float) $monthPurchases->sum('total'),
                'total_purchase' => $this->repository->totalPurchases(),
                'total_due' => $this->repository->totalDue(),
                'today_return' => (float) $todayReturns->sum('subtotal'),
                'today_return_count' => $todayReturns->count(),
                'month_return' => (float) $monthReturns->sum('subtotal'),
                'total_return' => $this->repository->totalSaleReturns(),
            ],
            'chartData' => [
                'labels' => $this->monthLabels($chartStart),
                'sales' => $this->monthlyValues($chartSales, $chartStart),
                'purchases' => $this->monthlyValues($chartPurchases, $chartStart),
            ],
            'recentSales' => $this->repository->recentSales()
                ->map(fn ($sale) => [
                    'id' => $sale->id,
                    'sale_number' => $sale->sale_number,
                    'customer' => $sale->customer?->name ?? 'Walk-in Customer',
                    'cashier' => $sale->user?->name ?? 'Administrator',
                    'total' => (float) $sale->total,
                    'paid' => (float) $sale->paid_amount,
                    'due' => (float) $sale->due_amount,
                    'payment_status' => $sale->payment_status,
                    'created_at' => $sale->created_at?->format('d M Y, h:i A'),
                ])->values(),
            'lowStockProducts' => $this->repository
                ->lowStockProducts(8, $lowStockLimit)
                ->map(fn ($product) => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'sku' => $product->sku,
                    'category' => $product->category?->name ?? 'Uncategorized',
                    'brand' => $product->brand?->name ?? 'No brand',
                    'stock' => (int) $product->stock_quantity,
                    'price' => (float) $product->price,
                ])->values(),
            'bestSellingProducts' => $this->repository
                ->bestSellingProducts()
                ->map(fn ($item) => [
                    'product_id' => $item->product_id,
                    'name' => $item->product?->name ?? 'Deleted product',
                    'sku' => $item->product?->sku,
                    'stock' => (int) ($item->product?->stock_quantity ?? 0),
                    'quantity_sold' => (int) $item->quantity_sold,
                    'revenue' => (float) $item->revenue,
                ])->values(),
            'recentActivities' => Schema::hasTable('activity_logs')
                ? ActivityLog::query()->with('user:id,name')->latest('id')->limit(8)->get()->map(fn ($log) => [
                    'id' => $log->id,
                    'user' => $log->user?->name ?? 'System',
                    'module' => $log->module,
                    'action' => $log->action,
                    'description' => $log->description,
                    'created_at' => $log->created_at?->diffForHumans(),
                ])->values()
                : [],
            'lowStockLimit' => $lowStockLimit,
        ];
    }

    private function monthLabels(Carbon $start): array
    {
        return collect(range(0, 11))
            ->map(fn (int $offset) => $start->copy()->addMonths($offset)->format('M Y'))
            ->all();
    }

    private function monthlyValues(Collection $records, Carbon $start): array
    {
        $grouped = $records->groupBy(
            fn ($record) => $record->created_at->format('Y-m')
        );

        return collect(range(0, 11))
            ->map(function (int $offset) use ($start, $grouped): float {
                $key = $start->copy()->addMonths($offset)->format('Y-m');

                return (float) $grouped->get($key, collect())->sum('total');
            })
            ->all();
    }
}

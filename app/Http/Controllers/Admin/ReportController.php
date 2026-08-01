<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Sale;
use App\Models\SaleReturn;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        [$dateFrom, $dateTo] = $this->resolveDates($request);
        $filters = $this->defaultFilters($dateFrom, $dateTo);
        $summary = $this->salesSummary($filters);

        return Inertia::render('Admin/Reports/Dashboard', [
            'summary' => [
                ...$summary,
                'return_count' => SaleReturn::query()
                    ->where('status', 'completed')
                    ->whereHas('sale', fn (Builder $query) => $query
                        ->whereBetween('sales.created_at', [$dateFrom, $dateTo]))
                    ->count(),
            ],
            'filters' => [
                'date_from' => $dateFrom->toDateString(),
                'date_to' => $dateTo->toDateString(),
            ],
        ]);
    }

    public function sales(Request $request): Response
    {
        [$dateFrom, $dateTo] = $this->resolveDates($request);
        $filters = $this->salesFilters($request, $dateFrom, $dateTo);

        $sales = $this->salesReportQuery($filters)
            ->latest('sales.id')
            ->paginate(20)
            ->withQueryString();

        $sales->getCollection()->transform(fn (Sale $sale) => $this->formatSaleRow($sale));

        return Inertia::render('Admin/Reports/Sales/Index', [
            'sales' => $sales,
            'summary' => $this->salesSummary($filters),
            'filters' => $this->filterPayload($filters),
            'customers' => Customer::query()
                ->select(['id', 'name'])
                ->orderBy('name')
                ->get(),
            'paymentMethods' => Sale::query()
                ->whereNotNull('payment_method')
                ->where('payment_method', '!=', '')
                ->distinct()
                ->orderBy('payment_method')
                ->pluck('payment_method')
                ->values(),
        ]);
    }

    public function salesPrint(Request $request): Response
    {
        [$dateFrom, $dateTo] = $this->resolveDates($request);
        $filters = $this->salesFilters($request, $dateFrom, $dateTo);

        $sales = $this->salesReportQuery($filters)
            ->latest('sales.id')
            ->limit(5000)
            ->get()
            ->map(fn (Sale $sale) => $this->formatSaleRow($sale));

        return Inertia::render('Admin/Reports/Sales/Print', [
            'sales' => $sales,
            'summary' => $this->salesSummary($filters),
            'filters' => $this->filterPayload($filters),
            'generatedAt' => now()->format('d M Y, h:i A'),
            'generatedBy' => $request->user()?->name ?? 'System',
        ]);
    }

    public function salesExport(Request $request): StreamedResponse
    {
        [$dateFrom, $dateTo] = $this->resolveDates($request);
        $filters = $this->salesFilters($request, $dateFrom, $dateTo);
        $filename = 'sales-report-' . $dateFrom->format('Ymd') . '-to-' . $dateTo->format('Ymd') . '.csv';

        return response()->streamDownload(function () use ($filters) {
            $handle = fopen('php://output', 'w');
            fwrite($handle, "\xEF\xBB\xBF");

            fputcsv($handle, [
                'Sale Number', 'Date', 'Customer', 'Payment Method', 'Payment Status',
                'Gross Sale', 'Returned', 'Net Sale', 'Sale Status',
            ]);

            $this->salesReportQuery($filters)
                ->latest('sales.id')
                ->chunkById(500, function (Collection $sales) use ($handle) {
                    foreach ($sales as $sale) {
                        $this->formatSaleRow($sale);
                        fputcsv($handle, [
                            $sale->sale_number,
                            optional($sale->created_at)->format('Y-m-d H:i:s'),
                            $sale->customer?->name ?? 'Walk-in Customer',
                            $sale->payment_method,
                            $sale->payment_status,
                            number_format((float) $sale->gross_total, 2, '.', ''),
                            number_format((float) $sale->returned_total, 2, '.', ''),
                            number_format((float) $sale->net_total, 2, '.', ''),
                            $sale->return_status_label,
                        ]);
                    }
                }, 'sales.id', 'id');

            fclose($handle);
        }, $filename, ['Content-Type' => 'text/csv; charset=UTF-8']);
    }

    public function salesExcelExport(Request $request): StreamedResponse
    {
        [$dateFrom, $dateTo] = $this->resolveDates($request);
        $filters = $this->salesFilters($request, $dateFrom, $dateTo);
        $rows = $this->salesReportQuery($filters)
            ->latest('sales.id')
            ->limit(10000)
            ->get()
            ->map(fn (Sale $sale) => $this->formatSaleRow($sale));
        $summary = $this->salesSummary($filters);
        $filename = 'sales-report-' . $dateFrom->format('Ymd') . '-to-' . $dateTo->format('Ymd') . '.xls';

        return response()->streamDownload(function () use ($rows, $summary, $filters) {
            echo "\xEF\xBB\xBF";
            echo '<html><head><meta charset="UTF-8"><style>';
            echo 'body{font-family:Calibri,Arial,sans-serif}h1{color:#1d4ed8}table{border-collapse:collapse;width:100%}th{background:#1d4ed8;color:white;font-weight:bold}th,td{border:1px solid #cbd5e1;padding:8px}.money{text-align:right}.total{font-weight:bold;background:#eff6ff}.returned{color:#dc2626}.net{color:#15803d;font-weight:bold}';
            echo '</style></head><body>';
            echo '<h1>Sales Report</h1>';
            echo '<p>Period: ' . e($filters['date_from']->toDateString()) . ' to ' . e($filters['date_to']->toDateString()) . '</p>';
            echo '<table><thead><tr><th>Sale Number</th><th>Date</th><th>Customer</th><th>Payment Method</th><th>Payment Status</th><th>Gross Sale</th><th>Returned</th><th>Net Sale</th><th>Status</th></tr></thead><tbody>';
            foreach ($rows as $sale) {
                echo '<tr>';
                echo '<td>' . e($sale->sale_number) . '</td>';
                echo '<td>' . e(optional($sale->created_at)->format('Y-m-d H:i:s')) . '</td>';
                echo '<td>' . e($sale->customer?->name ?? 'Walk-in Customer') . '</td>';
                echo '<td>' . e($sale->payment_method) . '</td>';
                echo '<td>' . e($sale->payment_status) . '</td>';
                echo '<td class="money">' . number_format((float) $sale->gross_total, 2) . '</td>';
                echo '<td class="money returned">' . number_format((float) $sale->returned_total, 2) . '</td>';
                echo '<td class="money net">' . number_format((float) $sale->net_total, 2) . '</td>';
                echo '<td>' . e($sale->return_status_label) . '</td>';
                echo '</tr>';
            }
            echo '<tr class="total"><td colspan="5">Grand Total</td><td class="money">' . number_format((float) $summary['gross_sales'], 2) . '</td><td class="money returned">' . number_format((float) $summary['sales_returns'], 2) . '</td><td class="money net">' . number_format((float) $summary['net_sales'], 2) . '</td><td></td></tr>';
            echo '</tbody></table></body></html>';
        }, $filename, [
            'Content-Type' => 'application/vnd.ms-excel; charset=UTF-8',
            'Cache-Control' => 'max-age=0',
        ]);
    }

    private function resolveDates(Request $request): array
    {
        $dateFrom = $request->filled('date_from')
            ? Carbon::parse($request->string('date_from')->toString())->startOfDay()
            : now()->startOfMonth();
        $dateTo = $request->filled('date_to')
            ? Carbon::parse($request->string('date_to')->toString())->endOfDay()
            : now()->endOfDay();

        if ($dateFrom->greaterThan($dateTo)) {
            [$dateFrom, $dateTo] = [$dateTo->copy()->startOfDay(), $dateFrom->copy()->endOfDay()];
        }

        return [$dateFrom, $dateTo];
    }

    private function defaultFilters(Carbon $dateFrom, Carbon $dateTo): array
    {
        return [
            'date_from' => $dateFrom,
            'date_to' => $dateTo,
            'search' => '',
            'customer_id' => null,
            'payment_method' => '',
            'payment_status' => '',
        ];
    }

    private function salesFilters(Request $request, Carbon $dateFrom, Carbon $dateTo): array
    {
        return [
            'date_from' => $dateFrom,
            'date_to' => $dateTo,
            'search' => trim((string) $request->input('search', '')),
            'customer_id' => $request->filled('customer_id') ? (int) $request->input('customer_id') : null,
            'payment_method' => trim((string) $request->input('payment_method', '')),
            'payment_status' => trim((string) $request->input('payment_status', '')),
        ];
    }

    private function filterPayload(array $filters): array
    {
        return [
            'date_from' => $filters['date_from']->toDateString(),
            'date_to' => $filters['date_to']->toDateString(),
            'search' => $filters['search'],
            'customer_id' => $filters['customer_id'],
            'payment_method' => $filters['payment_method'],
            'payment_status' => $filters['payment_status'],
        ];
    }

    private function salesReportQuery(array $filters): Builder
    {
        return Sale::query()
            ->select('sales.*')
            ->with(['customer:id,name', 'user:id,name'])
            ->withSum([
                'returns as all_returned_amount' => fn (Builder $query) => $query->where('status', 'completed'),
            ], 'subtotal')
            ->whereBetween('sales.created_at', [$filters['date_from'], $filters['date_to']])
            ->when($filters['search'] !== '', function (Builder $query) use ($filters) {
                $search = $filters['search'];
                $query->where(function (Builder $query) use ($search) {
                    $query->where('sale_number', 'like', "%{$search}%")
                        ->orWhereHas('customer', fn (Builder $customerQuery) =>
                            $customerQuery->where('name', 'like', "%{$search}%"));
                });
            })
            ->when($filters['customer_id'], fn (Builder $query, int $customerId) => $query->where('customer_id', $customerId))
            ->when($filters['payment_method'] !== '', fn (Builder $query) => $query->where('payment_method', $filters['payment_method']))
            ->when($filters['payment_status'] !== '', fn (Builder $query) => $query->where('payment_status', $filters['payment_status']));
    }

    private function salesSummary(array $filters): array
    {
        $sales = $this->salesReportQuery($filters)->get();
        $gross = round((float) $sales->sum(fn (Sale $sale) => (float) $sale->total + (float) ($sale->all_returned_amount ?? 0)), 2);
        $returned = round((float) $sales->sum(fn (Sale $sale) => (float) ($sale->all_returned_amount ?? 0)), 2);
        $net = round((float) $sales->sum(fn (Sale $sale) => (float) $sale->total), 2);
        $count = $sales->count();

        return [
            'gross_sales' => $gross,
            'sales_returns' => $returned,
            'net_sales' => $net,
            'sales_count' => $count,
            'average_sale' => $count > 0 ? round($net / $count, 2) : 0,
        ];
    }

    private function formatSaleRow(Sale $sale): Sale
    {
        $returned = round((float) ($sale->all_returned_amount ?? 0), 2);
        $net = round((float) $sale->total, 2);
        $gross = round($net + $returned, 2);

        if ($returned <= 0) {
            [$status, $label] = ['completed', 'Completed'];
        } elseif ($net <= 0) {
            [$status, $label] = ['fully_returned', 'Fully Returned'];
        } else {
            [$status, $label] = ['partially_returned', 'Partially Returned'];
        }

        $sale->setAttribute('gross_total', $gross);
        $sale->setAttribute('returned_total', $returned);
        $sale->setAttribute('net_total', $net);
        $sale->setAttribute('return_status', $status);
        $sale->setAttribute('return_status_label', $label);

        return $sale;
    }
}

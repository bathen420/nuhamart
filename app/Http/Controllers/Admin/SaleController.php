<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSaleRequest;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Sale;
use App\Services\SaleService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SaleController extends Controller
{
    public function __construct(
        protected SaleService $saleService
    ) {
    }

    /**
     * Display the sales list.
     */
    public function index(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));

        $sales = Sale::query()
            ->with([
                'customer:id,name',
                'user:id,name',
            ])
            ->withSum(
                [
                    'returns as returned_amount' => function ($query) {
                        $query->where('status', 'completed');
                    },
                ],
                'subtotal'
            )
            ->withCount([
                'returns as returns_count' => function ($query) {
                    $query->where('status', 'completed');
                },
            ])
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query
                        ->where('sale_number', 'like', "%{$search}%")
                        ->orWhereHas('customer', function ($customerQuery) use ($search) {
                            $customerQuery->where(
                                'name',
                                'like',
                                "%{$search}%"
                            );
                        });
                });
            })
            ->latest('id')
            ->paginate(10)
            ->withQueryString();

        $sales->getCollection()->transform(function (Sale $sale) {
            $returnedAmount = round(
                (float) ($sale->returned_amount ?? 0),
                2
            );

            $netAmount = round(
                (float) $sale->total,
                2
            );

            $originalAmount = round(
                $netAmount + $returnedAmount,
                2
            );

            if ($returnedAmount <= 0) {
                $returnStatus = 'completed';
            } elseif ($netAmount <= 0) {
                $returnStatus = 'fully_returned';
            } else {
                $returnStatus = 'partially_returned';
            }

            $sale->setAttribute(
                'original_total',
                $originalAmount
            );

            $sale->setAttribute(
                'returned_total',
                $returnedAmount
            );

            $sale->setAttribute(
                'net_total',
                $netAmount
            );

            $sale->setAttribute(
                'return_status',
                $returnStatus
            );

            return $sale;
        });

        return Inertia::render('Admin/Sales/Index', [
            'sales' => $sales,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Display the POS screen.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/POS/Index', [
            'products' => Product::query()
                ->where('status', true)
                ->orderBy('name')
                ->get(),

            'customers' => Customer::query()
                ->orderBy('name')
                ->get(),
        ]);
    }

    /**
     * Store a new sale.
     */
    public function store(StoreSaleRequest $request)
    {
        $sale = $this->saleService->store(
            $request->validated()
        );

        return redirect()
            ->route('admin.sales.show', $sale)
            ->with(
                'success',
                'Sale completed successfully.'
            );
    }

    /**
     * Display a sale invoice.
     */
    public function show(Sale $sale): Response
    {
        $sale->load([
            'customer',
            'user',
            'items.product',
            'returns' => function ($query) {
                $query
                    ->with('items.product')
                    ->latest('id');
            },
        ]);

        $returnedAmount = round(
            (float) $sale->returns
                ->where('status', 'completed')
                ->sum('subtotal'),
            2
        );

        $netAmount = round(
            (float) $sale->total,
            2
        );

        $sale->setAttribute(
            'original_total',
            round($netAmount + $returnedAmount, 2)
        );

        $sale->setAttribute(
            'returned_total',
            $returnedAmount
        );

        $sale->setAttribute(
            'net_total',
            $netAmount
        );

        return Inertia::render('Admin/Sales/Show', [
            'sale' => $sale,
        ]);
    }

    /**
     * Completed sales must not be deleted.
     */
    public function destroy(Sale $sale)
    {
        return back()->with(
            'error',
            'Completed sales cannot be deleted. Use Sales Return to reverse stock and payment safely.'
        );
    }
}
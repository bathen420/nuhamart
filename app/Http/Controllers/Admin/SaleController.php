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

class SaleController extends Controller
{
    public function __construct(
        protected SaleService $saleService
    ) {
    }

    /**
     * Sales List
     */
    public function index(Request $request)
    {
        $sales = Sale::with(['customer', 'user'])
            ->when($request->search, function ($query, $search) {
                $query->where('sale_number', 'like', "%{$search}%")
                    ->orWhereHas('customer', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Sales/Index', [
            'sales' => $sales,
            'filters' => [
                'search' => $request->search,
            ],
        ]);
    }

    /**
     * POS Screen
     */
    public function create()
    {
        return Inertia::render('Admin/POS/Index', [
            'products' => Product::where('status', true)
                ->orderBy('name')
                ->get(),

            'customers' => Customer::orderBy('name')->get(),
        ]);
    }

    /**
     * Store Sale
     */
    public function store(StoreSaleRequest $request)
    {
        $sale = $this->saleService->store(
            $request->validated()
        );

        return redirect()
            ->route('admin.sales.show', $sale->id)
            ->with('success', 'Sale completed successfully.');
    }

    /**
     * Show Invoice
     */
    public function show(Sale $sale)
    {
        $sale->load([
            'customer',
            'user',
            'items.product',
        ]);

        return Inertia::render('Admin/Sales/Show', [
            'sale' => $sale,
        ]);
    }

    /**
     * Delete Sale
     */
    public function destroy(Sale $sale)
    {
        return back()->with(
            'error',
            'Deleting completed sales is disabled. Please implement Sale Return instead.'
        );
    }
}
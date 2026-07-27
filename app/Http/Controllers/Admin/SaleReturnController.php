<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSaleReturnRequest;
use App\Models\Sale;
use App\Models\SaleReturn;
use App\Repositories\SaleReturnRepository;
use App\Services\SaleReturnService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SaleReturnController extends Controller
{
    public function __construct(
        protected SaleReturnRepository $repository,
        protected SaleReturnService $service
    ) {
    }

    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'date_from', 'date_to']);

        return Inertia::render('Admin/SaleReturns/Index', [
            'returns' => $this->repository->paginate($filters),
            'filters' => $filters,
        ]);
    }

    public function create(Sale $sale): Response
    {
        $sale->load([
            'customer',
            'items.product',
            'items.returnItems',
        ]);

        $sale->items->each(function ($item) {
            $item->returned_quantity = (int) $item->returnItems->sum('quantity');
            $item->returnable_quantity = max(
                0,
                (int) $item->quantity - $item->returned_quantity
            );

            unset($item->returnItems);
        });

        return Inertia::render('Admin/SaleReturns/Create', [
            'sale' => $sale,
            'suggestedReturnDate' => now()->toDateString(),
        ]);
    }

    public function store(
        StoreSaleReturnRequest $request,
        Sale $sale
    ): RedirectResponse {
        $saleReturn = $this->service->create(
            $sale,
            $request->validated(),
            (int) $request->user()->id
        );

        return redirect()
            ->route('admin.sale-returns.show', $saleReturn)
            ->with('success', 'Sales return completed successfully.');
    }

    public function show(SaleReturn $saleReturn): Response
    {
        return Inertia::render('Admin/SaleReturns/Show', [
            'saleReturn' => $saleReturn->load([
                'sale',
                'customer',
                'user:id,name',
                'items.product',
            ]),
        ]);
    }
}

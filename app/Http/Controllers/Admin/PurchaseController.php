<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePurchasePaymentRequest;
use App\Http\Requests\StorePurchaseRequest;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\Supplier;
use App\Repositories\PurchaseRepository;
use App\Services\PurchaseService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;

class PurchaseController extends Controller
{
    public function __construct(
        protected PurchaseRepository $repository,
        protected PurchaseService $service
    ) {
    }

    public function index(Request $request): Response
    {
        $filters = $request->only([
            'search',
            'payment_status',
            'date_from',
            'date_to',
        ]);

        return Inertia::render('Admin/Purchases/Index', [
            'purchases' => $this->repository->paginate($filters),
            'filters' => $filters,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Purchases/Create', [
            'suppliers' => Supplier::query()
                ->where('status', true)
                ->orderBy('name')
                ->get(['id', 'name', 'phone']),
            'products' => Product::query()
                ->where('status', true)
                ->orderBy('name')
                ->get([
                    'id',
                    'name',
                    'sku',
                    'purchase_price',
                    'price',
                    'stock_quantity',
                ]),
            'suggestedPurchaseNumber' => 'PUR-'.now()->format('Ymd-His'),
        ]);
    }

    public function store(StorePurchaseRequest $request): RedirectResponse
    {
        $purchase = $this->service->create(
            $request->validated(),
            (int) $request->user()->id
        );

        return redirect()
            ->route('admin.purchases.show', $purchase)
            ->with('success', 'Purchase created successfully.');
    }

    public function show(Purchase $purchase): Response
    {
        return Inertia::render('Admin/Purchases/Show', [
            'purchase' => $purchase->load([
                'supplier',
                'user:id,name,email',
                'items.product',
                'payments.user:id,name',
            ]),
        ]);
    }

    public function addPayment(
        StorePurchasePaymentRequest $request,
        Purchase $purchase
    ): RedirectResponse {
        $this->service->addPayment(
            $purchase,
            $request->validated(),
            (int) $request->user()->id
        );

        return back()->with('success', 'Supplier payment recorded successfully.');
    }

    public function downloadPdf(Purchase $purchase): HttpResponse
    {
        $purchase->load([
            'supplier',
            'user:id,name,email',
            'items.product',
            'payments.user:id,name',
        ]);

        return Pdf::loadView('pdf.purchase-invoice', compact('purchase'))
            ->setPaper('a4', 'portrait')
            ->download("Purchase-{$purchase->purchase_number}.pdf");
    }

    public function edit(Purchase $purchase): RedirectResponse
    {
        return redirect()
            ->route('admin.purchases.show', $purchase)
            ->withErrors(['error' => 'Completed purchases cannot be edited.']);
    }

    public function update(Request $request, Purchase $purchase): RedirectResponse
    {
        return redirect()
            ->route('admin.purchases.show', $purchase)
            ->withErrors(['error' => 'Completed purchases cannot be updated.']);
    }

    public function destroy(Purchase $purchase): RedirectResponse
    {
        return back()->withErrors([
            'error' => 'Use Purchase Return instead of deleting a completed purchase.',
        ]);
    }
}

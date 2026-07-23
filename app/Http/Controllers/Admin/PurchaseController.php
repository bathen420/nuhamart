<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePurchaseRequest;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\StockHistory;
use App\Models\Supplier;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;
use Throwable;

class PurchaseController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));

        $purchases = Purchase::query()
            ->with([
                'supplier:id,name',
                'user:id,name',
            ])
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery
                        ->where('purchase_number', 'like', "%{$search}%")
                        ->orWhereHas('supplier', function ($supplierQuery) use ($search) {
                            $supplierQuery->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Purchases/Index', [
            'auth' => [
                'user' => auth()->user(),
            ],
            'purchases' => $purchases,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Purchases/Create', [
            'auth' => [
                'user' => auth()->user(),
            ],
            'suppliers' => Supplier::query()
                ->where('status', true)
                ->orderBy('name')
                ->get(),
            'products' => Product::query()
                ->where('status', true)
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function store(StorePurchaseRequest $request): RedirectResponse
    {
        try {
            $data = $request->validated();

            DB::transaction(function () use ($data) {
                $purchase = Purchase::create([
                    'purchase_number' => $data['purchase_number'],
                    'supplier_id'     => $data['supplier_id'],
                    'user_id'         => auth()->id(),
                    'subtotal'        => $data['subtotal'],
                    'discount'        => $data['discount'] ?? 0,
                    'shipping'        => $data['shipping'] ?? 0,
                    'total'           => $data['total'],
                    'note'            => $data['note'] ?? null,
                ]);

                foreach ($data['items'] as $item) {
                    $product = Product::query()
                        ->lockForUpdate()
                        ->findOrFail($item['product_id']);

                    $quantity = (int) $item['quantity'];
                    $stockBefore = (int) $product->stock_quantity;
                    $stockAfter = $stockBefore + $quantity;

                    $purchase->items()->create([
                        'product_id' => $product->id,
                        'quantity'   => $quantity,
                        'price'      => $item['price'],
                        'subtotal'   => $item['subtotal'],
                    ]);

                    $product->update([
                        'stock_quantity' => $stockAfter,
                    ]);

                    StockHistory::create([
                        'product_id'   => $product->id,
                        'user_id'      => auth()->id(),
                        'type'         => 'IN',
                        'quantity'     => $quantity,
                        'stock_before' => $stockBefore,
                        'stock_after'  => $stockAfter,
                        'reference'    => $purchase->purchase_number,
                        'note'         => 'Purchase stock added',
                    ]);
                }
            });

            return redirect()
                ->route('purchases.index')
                ->with('success', 'Purchase created successfully.');
        } catch (Throwable $exception) {
            report($exception);

            return back()
                ->withInput()
                ->withErrors([
                    'error' => 'Purchase could not be created. Please try again.',
                ]);
        }
    }

    public function show(Purchase $purchase): Response
    {
        $purchase->load([
            'supplier',
            'user:id,name,email',
            'items.product',
        ]);

        return Inertia::render('Admin/Purchases/Show', [
            'auth' => [
                'user' => auth()->user(),
            ],
            'purchase' => $purchase,
        ]);
    }

    public function downloadPdf(Purchase $purchase): HttpResponse
    {
        $purchase->load([
            'supplier',
            'user:id,name,email',
            'items.product',
        ]);

        $pdf = Pdf::loadView('pdf.purchase-invoice', [
            'purchase' => $purchase,
        ])->setPaper('a4', 'portrait');

        $fileName = 'Purchase-'.$purchase->purchase_number.'.pdf';

        return $pdf->download($fileName);
    }

    public function edit(Purchase $purchase): RedirectResponse
    {
        return redirect()
            ->route('purchases.show', $purchase)
            ->withErrors([
                'error' => 'Purchase editing is not available yet.',
            ]);
    }

    public function update(Request $request, Purchase $purchase): RedirectResponse
    {
        return redirect()
            ->route('purchases.show', $purchase)
            ->withErrors([
                'error' => 'Purchase updating is not available yet.',
            ]);
    }

    public function destroy(Purchase $purchase): RedirectResponse
    {
        try {
            DB::transaction(function () use ($purchase) {
                $purchase->load('items');

                foreach ($purchase->items as $item) {
                    $product = Product::query()
                        ->lockForUpdate()
                        ->findOrFail($item->product_id);

                    $quantity = (int) $item->quantity;
                    $stockBefore = (int) $product->stock_quantity;

                    if ($stockBefore < $quantity) {
                        throw new RuntimeException(
                            "Cannot delete this purchase because {$product->name} does not have enough current stock."
                        );
                    }

                    $stockAfter = $stockBefore - $quantity;

                    $product->update([
                        'stock_quantity' => $stockAfter,
                    ]);

                    StockHistory::create([
                        'product_id'   => $product->id,
                        'user_id'      => auth()->id(),
                        'type'         => 'OUT',
                        'quantity'     => $quantity,
                        'stock_before' => $stockBefore,
                        'stock_after'  => $stockAfter,
                        'reference'    => $purchase->purchase_number,
                        'note'         => 'Purchase deleted and stock reversed',
                    ]);
                }

                $purchase->delete();
            });

            return redirect()
                ->route('purchases.index')
                ->with('success', 'Purchase deleted and stock reversed successfully.');
        } catch (RuntimeException $exception) {
            return back()->withErrors([
                'error' => $exception->getMessage(),
            ]);
        } catch (Throwable $exception) {
            report($exception);

            return back()->withErrors([
                'error' => 'Purchase could not be deleted. Please try again.',
            ]);
        }
    }
}

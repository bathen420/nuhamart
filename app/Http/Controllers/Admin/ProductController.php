<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class ProductController extends Controller
{
    /**
     * Display a listing of products.
     */
    public function index(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));

        $products = Product::query()
            ->with([
                'category:id,name',
                'brand:id,name',
            ])
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('sku', 'like', "%{$search}%")
                        ->orWhereHas('category', function ($categoryQuery) use ($search) {
                            $categoryQuery->where('name', 'like', "%{$search}%");
                        })
                        ->orWhereHas('brand', function ($brandQuery) use ($search) {
                            $brandQuery->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Products/Index', [
            'auth' => [
                'user' => auth()->user(),
            ],

            'products' => $products,

            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Show the form for creating a new product.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Products/Create', [
            'auth' => [
                'user' => auth()->user(),
            ],

            'categories' => Category::query()
                ->where('status', true)
                ->orderBy('name')
                ->get([
                    'id',
                    'name',
                ]),

            'brands' => Brand::query()
                ->where('status', true)
                ->orderBy('name')
                ->get([
                    'id',
                    'name',
                ]),
        ]);
    }

    /**
     * Store a newly created product.
     */
    public function store(StoreProductRequest $request): RedirectResponse
    {
        try {
            $data = $request->validated();

            if ($request->hasFile('image')) {
                $data['image'] = $request
                    ->file('image')
                    ->store('products', 'public');
            }

            Product::create($data);

            return redirect()
                ->route('products.index')
                ->with('success', 'Product created successfully.');
        } catch (Throwable $exception) {
            report($exception);

            return back()
                ->withInput()
                ->withErrors([
                    'error' => 'Product could not be created. Please try again.',
                ]);
        }
    }

    /**
     * Display the specified product.
     */
    public function show(Product $product): Response
    {
        $product->load([
            'category:id,name',
            'brand:id,name',
        ]);

        return Inertia::render('Admin/Products/Show', [
            'auth' => [
                'user' => auth()->user(),
            ],

            'product' => $product,
        ]);
    }

    /**
     * Show the form for editing the specified product.
     */
    public function edit(Product $product): Response
    {
        $product->load([
            'category:id,name',
            'brand:id,name',
        ]);

        return Inertia::render('Admin/Products/Edit', [
            'auth' => [
                'user' => auth()->user(),
            ],

            'product' => $product,

            'categories' => Category::query()
                ->where('status', true)
                ->orderBy('name')
                ->get([
                    'id',
                    'name',
                ]),

            'brands' => Brand::query()
                ->where('status', true)
                ->orderBy('name')
                ->get([
                    'id',
                    'name',
                ]),
        ]);
    }

    /**
     * Update the specified product.
     */
    public function update(
        UpdateProductRequest $request,
        Product $product
    ): RedirectResponse {
        try {
            $data = $request->validated();

            if ($request->hasFile('image')) {
                if (
                    !empty($product->image)
                    && Storage::disk('public')->exists($product->image)
                ) {
                    Storage::disk('public')->delete($product->image);
                }

                $data['image'] = $request
                    ->file('image')
                    ->store('products', 'public');
            } else {
                unset($data['image']);
            }

            $product->update($data);

            return redirect()
                ->route('products.index')
                ->with('success', 'Product updated successfully.');
        } catch (Throwable $exception) {
            report($exception);

            return back()
                ->withInput()
                ->withErrors([
                    'error' => 'Product could not be updated. Please try again.',
                ]);
        }
    }

    /**
     * Remove the specified product.
     */
    public function destroy(Product $product): RedirectResponse
    {
        try {
            if (
                !empty($product->image)
                && Storage::disk('public')->exists($product->image)
            ) {
                Storage::disk('public')->delete($product->image);
            }

            $product->delete();

            return redirect()
                ->route('products.index')
                ->with('success', 'Product deleted successfully.');
        } catch (Throwable $exception) {
            report($exception);

            return back()->withErrors([
                'error' => 'Product could not be deleted. It may already be used in an order or purchase.',
            ]);
        }
    }
}

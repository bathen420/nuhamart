<?php

namespace App\Http\Controllers\Admin;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Brand;
use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;


class ProductController extends Controller
{
    /**
     * Display a listing of products.
     */
    public function index(Request $request)
        {
            $search = $request->search;

            $products = Product::with(['category', 'brand'])
                ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%");
                });
            })
                ->latest()
                ->paginate(10)
                ->withQueryString();

            return Inertia::render('Admin/Products/Index', [
                'products' => $products,
                'filters' => [
                    'search' => $search,
                ],
            ]);
        }

    /**
     * Show the form for creating a product.
     */
    public function create()
        {
            return inertia('Admin/Products/Create', [
                'categories' => Category::orderBy('name')->get(),
                'brands' => Brand::orderBy('name')->get(),
            ]);
        }

    /**
     * Store a newly created product.
     */
    public function store(StoreProductRequest $request)
    {
        $data = $request->validated();

        $data['slug'] = Str::slug($request->name);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        Product::create($data);

        return redirect()
            ->route('products.index')
            ->with('success', 'Product created successfully.');
    }


   

    /**
     * Show the form for editing a product.
     */
   public function edit(Product $product)
    {
        return inertia('Admin/Products/Edit', [
            'product' => $product,
            'categories' => Category::orderBy('name')->get(),
            'brands' => Brand::orderBy('name')->get(),
        ]);
    }

    /**
     * Update the product.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        $data = $request->validated();

        $data['slug'] = Str::slug($request->name);

        if ($request->hasFile('image')) {

            if ($product->image && Storage::disk('public')->exists($product->image)) {
                Storage::disk('public')->delete($product->image);
            }

            $data['image'] = $request->file('image')->store('products', 'public');
        }

        $product->update($data);

        return redirect()
            ->route('products.index')
            ->with('success', 'Product updated successfully.');
    }

    /**
     * Delete the product.
     */
    public function destroy(Product $product)
    {
        if ($product->image && Storage::disk('public')->exists($product->image)) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return redirect()
            ->route('products.index')
            ->with('success', 'Product deleted successfully.');
    }
}
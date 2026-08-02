<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Brand;
use App\Models\Author;
use App\Models\Publisher;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
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
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', 'in:0,1'],
            'category' => ['nullable', 'integer', 'exists:categories,id'],
            'brand' => ['nullable', 'integer', 'exists:brands,id'],
            'sort' => ['nullable', 'in:id,name,price,stock_quantity,created_at'],
            'direction' => ['nullable', 'in:asc,desc'],
            'per_page' => ['nullable', 'integer', 'in:10,25,50,100'],
        ]);

        $search = trim((string) ($validated['search'] ?? ''));
        $status = $validated['status'] ?? null;
        $categoryId = $validated['category'] ?? null;
        $brandId = $validated['brand'] ?? null;
        $sort = $validated['sort'] ?? 'created_at';
        $direction = $validated['direction'] ?? 'desc';
        $perPage = (int) ($validated['per_page'] ?? 10);

        $products = Product::query()
            ->select([
                'id',
                'category_id',
                'brand_id',
                'name',
                'sku',
                'price',
                'stock_quantity',
                'image',
                'status',
                'created_at',
            ])
            ->with([
                'category:id,name',
                'brand:id,name',
            'author:id,name',
            'publisher:id,name',
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
            ->when($status !== null, fn ($query) => $query->where('status', (bool) $status))
            ->when($categoryId, fn ($query) => $query->where('category_id', $categoryId))
            ->when($brandId, fn ($query) => $query->where('brand_id', $brandId))
            ->orderBy($sort, $direction)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Admin/Products/Index', [
            'auth' => [
                'user' => auth()->user(),
            ],
            'products' => $products,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'category' => $categoryId,
                'brand' => $brandId,
                'sort' => $sort,
                'direction' => $direction,
                'per_page' => $perPage,
            ],
            'filterOptions' => [
                'categories' => Category::query()
                    ->where('status', true)
                    ->orderBy('name')
                    ->get(['id', 'name']),
                'brands' => Brand::query()
                    ->where('status', true)
                    ->orderBy('name')
                    ->get(['id', 'name']),
            ],
        ]);
    }

    /**
     * Show the form for creating a new product.
     */
    public function create(): Response
    {
        $categories = Category::query()
            ->where('status', true)
            ->orderBy('name')
            ->get([
                'id',
                'name',
            ]);

        $brands = Brand::query()
            ->where('status', true)
            ->orderBy('name')
            ->get([
                'id',
                'name',
            ]);

        $authors = Author::where('status', true)->orderBy('name')->get(['id','name']);
        $publishers = Publisher::where('status', true)->orderBy('name')->get(['id','name']);

        return Inertia::render('Admin/Products/Create', [
            'auth' => [
                'user' => auth()->user(),
            ],

            'categories' => $categories,

            'brands' => $brands,
            'authors' => $authors,
            'publishers' => $publishers,
        ]);
    }

    /**
     * Store a newly created product.
     */
    public function store(
        StoreProductRequest $request
    ): RedirectResponse {
        try {
            $data = $request->validated();

            if ($request->hasFile('image')) {
                $data['image'] = $request->file('image')->store('products', 'public');
            }

            if ($request->hasFile('gallery_images')) {
                $data['gallery_images'] = collect($request->file('gallery_images'))
                    ->map(fn ($file) => $file->store('products/gallery', 'public'))
                    ->values()
                    ->all();
            }

            if ($request->hasFile('sample_file')) {
                $data['sample_file'] = $request->file('sample_file')->store('products/samples', 'public');
            }

            $data['slug'] = $this->generateUniqueSlug($data['name']);

            Product::create($data);

            return redirect()
                ->route('admin.products.index')
                ->with(
                    'success',
                    'Product created successfully.'
                );
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
            'author:id,name',
            'publisher:id,name',
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
            'author:id,name',
            'publisher:id,name',
        ]);

        $categories = Category::query()
            ->where('status', true)
            ->orderBy('name')
            ->get([
                'id',
                'name',
            ]);

        $brands = Brand::query()
            ->where('status', true)
            ->orderBy('name')
            ->get([
                'id',
                'name',
            ]);

        $authors = Author::where('status', true)->orderBy('name')->get(['id','name']);
        $publishers = Publisher::where('status', true)->orderBy('name')->get(['id','name']);

        return Inertia::render('Admin/Products/Edit', [
            'auth' => [
                'user' => auth()->user(),
            ],

            'product' => $product,

            'categories' => $categories,

            'brands' => $brands,
            'authors' => $authors,
            'publishers' => $publishers,
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

            if ($request->hasFile('gallery_images')) {
                foreach ((array) $product->gallery_images as $path) {
                    if ($path && Storage::disk('public')->exists($path)) {
                        Storage::disk('public')->delete($path);
                    }
                }
                $data['gallery_images'] = collect($request->file('gallery_images'))
                    ->map(fn ($file) => $file->store('products/gallery', 'public'))
                    ->values()
                    ->all();
            } else {
                unset($data['gallery_images']);
            }

            if ($request->hasFile('sample_file')) {
                if ($product->sample_file && Storage::disk('public')->exists($product->sample_file)) {
                    Storage::disk('public')->delete($product->sample_file);
                }
                $data['sample_file'] = $request->file('sample_file')->store('products/samples', 'public');
            } else {
                unset($data['sample_file']);
            }

            if (
                isset($data['name'])
                && $data['name'] !== $product->name
            ) {
                $data['slug'] = $this->generateUniqueSlug(
                    $data['name'],
                    $product->id
                );
            } elseif (empty($product->slug)) {
                $data['slug'] = $this->generateUniqueSlug(
                    $product->name,
                    $product->id
                );
            }

            $product->update($data);

            return redirect()
                ->route('admin.products.index')
                ->with(
                    'success',
                    'Product updated successfully.'
                );
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
     * Generate a unique product slug.
     */
    private function generateUniqueSlug(
        string $name,
        ?int $ignoreProductId = null
    ): string {
        $baseSlug = Str::slug($name);

        if ($baseSlug === '') {
            $baseSlug = 'product';
        }

        $slug = $baseSlug;
        $counter = 2;

        while (
            Product::query()
                ->when(
                    $ignoreProductId !== null,
                    fn ($query) => $query->whereKeyNot($ignoreProductId)
                )
                ->where('slug', $slug)
                ->exists()
        ) {
            $slug = $baseSlug.'-'.$counter;
            $counter++;
        }

        return $slug;
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

            foreach ((array) $product->gallery_images as $path) {
                if ($path && Storage::disk('public')->exists($path)) {
                    Storage::disk('public')->delete($path);
                }
            }
            if ($product->sample_file && Storage::disk('public')->exists($product->sample_file)) {
                Storage::disk('public')->delete($product->sample_file);
            }

            $product->delete();

            return redirect()
                ->route('admin.products.index')
                ->with(
                    'success',
                    'Product deleted successfully.'
                );
        } catch (Throwable $exception) {
            report($exception);

            return back()->withErrors([
                'error' => 'Product could not be deleted. It may already be used in an order or purchase.',
            ]);
        }
    }
}
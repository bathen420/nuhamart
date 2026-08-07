<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class WishlistController extends Controller
{
    public function publicIndex(Request $request): Response
    {
        return Inertia::render('Customer/Wishlist/Index', [
            'products' => $request->user()
                ? $this->productsForUser($request)
                : [],
            'isAuthenticated' => $request->user() !== null,
        ]);
    }

    public function index(Request $request): Response
    {
        return Inertia::render('Customer/Wishlist/Index', [
            'products' => $this->productsForUser($request),
            'isAuthenticated' => true,
        ]);
    }

    public function state(Request $request): JsonResponse
    {
        if (! $request->user()) {
            return response()->json([
                'product_ids' => [],
                'count' => 0,
            ]);
        }

        $ids = $request->user()
            ->wishlistItems()
            ->pluck('product_id')
            ->map(fn ($id) => (int) $id)
            ->values();

        return response()->json([
            'product_ids' => $ids,
            'count' => $ids->count(),
        ]);
    }

    public function resolve(Request $request): JsonResponse
    {
        $data = $request->validate([
            'product_ids' => ['array', 'max:100'],
            'product_ids.*' => ['integer', 'distinct', Rule::exists('products', 'id')],
        ]);

        $ids = collect($data['product_ids'] ?? [])
            ->map(fn ($id) => (int) $id)
            ->unique()
            ->values();

        if ($ids->isEmpty()) {
            return response()->json(['products' => []]);
        }

        $products = Product::query()
            ->with(['brand:id,name', 'category:id,name', 'author:id,name', 'publisher:id,name'])
            ->whereIn('id', $ids)
            ->where('status', true)
            ->get()
            ->sortBy(fn (Product $product) => $ids->search($product->id))
            ->values()
            ->map(fn (Product $product) => $this->productPayload($product));

        return response()->json(['products' => $products]);
    }

    public function store(Request $request, Product $product): JsonResponse
    {
        abort_unless($product->status, 404);

        Wishlist::query()->firstOrCreate([
            'user_id' => $request->user()->id,
            'product_id' => $product->id,
        ]);

        return $this->state($request);
    }

    public function destroy(Request $request, Product $product): JsonResponse
    {
        Wishlist::query()
            ->where('user_id', $request->user()->id)
            ->where('product_id', $product->id)
            ->delete();

        return $this->state($request);
    }

    public function merge(Request $request): JsonResponse
    {
        $data = $request->validate([
            'product_ids' => ['array', 'max:100'],
            'product_ids.*' => ['integer', 'distinct', Rule::exists('products', 'id')],
        ]);

        $validIds = Product::query()
            ->whereIn('id', $data['product_ids'] ?? [])
            ->where('status', true)
            ->pluck('id');

        $now = now();

        $rows = $validIds->map(fn ($productId) => [
            'user_id' => $request->user()->id,
            'product_id' => $productId,
            'created_at' => $now,
            'updated_at' => $now,
        ])->all();

        if ($rows !== []) {
            Wishlist::query()->insertOrIgnore($rows);
        }

        return $this->state($request);
    }

    private function productsForUser(Request $request): array
    {
        return $request->user()
            ->wishlistProducts()
            ->with(['brand:id,name', 'category:id,name', 'author:id,name', 'publisher:id,name'])
            ->where('products.status', true)
            ->orderByPivot('created_at', 'desc')
            ->get()
            ->map(fn (Product $product) => $this->productPayload($product))
            ->values()
            ->all();
    }

    private function productPayload(Product $product): array
    {
        $price = (float) $product->price;
        $salePrice = $product->discount_price !== null
            ? (float) $product->discount_price
            : null;

        $discount = ($salePrice !== null && $price > 0 && $salePrice < $price)
            ? (int) round((($price - $salePrice) / $price) * 100)
            : 0;

        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'image' => $this->imageUrl($product->image),
            'brand' => $product->brand ? ['name' => $product->brand->name] : null,
            'category' => $product->category ? ['name' => $product->category->name] : null,
            'author' => $product->author ? ['name' => $product->author->name] : null,
            'publisher' => $product->publisher ? ['name' => $product->publisher->name] : null,
            'price' => $price,
            'sale_price' => $salePrice,
            'discount' => $discount,
            'stock' => (int) $product->stock_quantity,
            'product_type' => $product->product_type,
            'is_new' => (bool) $product->is_new_arrival,
            'is_featured' => (bool) $product->is_featured,
            'rating' => 0,
            'review_count' => 0,
            'sold' => 0,
        ];
    }

    private function imageUrl(?string $image): ?string
    {
        if (! $image) {
            return null;
        }

        if (str_starts_with($image, 'http://')
            || str_starts_with($image, 'https://')
            || str_starts_with($image, '/')) {
            return $image;
        }

        return Storage::disk('public')->url($image);
    }
}

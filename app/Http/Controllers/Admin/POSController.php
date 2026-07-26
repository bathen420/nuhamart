<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSaleRequest;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Customer;
use App\Models\Product;
use App\Services\SaleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class POSController extends Controller
{
    public function __construct(
        protected SaleService $saleService
    ) {
    }

    /**
     * Display the POS screen.
     */
    public function index(Request $request): Response
    {
        $products = Product::query()
            ->with([
                'category:id,name',
                'brand:id,name',
            ])
            ->where('status', true)
            ->where('stock_quantity', '>', 0)
            ->orderBy('name')
            ->paginate(20)
            ->through(function (Product $product) {
                return $this->formatProduct($product);
            });

        $customers = Customer::query()
            ->select([
                'id',
                'name',
                'phone',
                'email',
            ])
            ->orderBy('name')
            ->limit(100)
            ->get();

        $categories = Category::query()
            ->select([
                'id',
                'name',
            ])
            ->where('status', true)
            ->orderBy('name')
            ->get();

        $brands = Brand::query()
            ->select([
                'id',
                'name',
            ])
            ->where('status', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/POS/Index', [
            'products' => $products,
            'customers' => $customers,
            'categories' => $categories,
            'brands' => $brands,

            'filters' => [
                'search' => $request->string('search')->toString(),
                'category_id' => $request->input('category_id'),
                'brand_id' => $request->input('brand_id'),
            ],
        ]);
    }

    /**
     * Search products from the POS screen.
     */
    public function searchProducts(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search' => [
                'nullable',
                'string',
                'max:255',
            ],

            'category_id' => [
                'nullable',
                'integer',
                'exists:categories,id',
            ],

            'brand_id' => [
                'nullable',
                'integer',
                'exists:brands,id',
            ],

            'page' => [
                'nullable',
                'integer',
                'min:1',
            ],
        ]);

        $search = trim($validated['search'] ?? '');

        $products = Product::query()
            ->with([
                'category:id,name',
                'brand:id,name',
            ])
            ->where('status', true)
            ->where('stock_quantity', '>', 0)

            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($productQuery) use ($search) {
                    $productQuery
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('sku', 'like', "%{$search}%");
                });
            })

            ->when(
                !empty($validated['category_id']),
                function ($query) use ($validated) {
                    $query->where(
                        'category_id',
                        $validated['category_id']
                    );
                }
            )

            ->when(
                !empty($validated['brand_id']),
                function ($query) use ($validated) {
                    $query->where(
                        'brand_id',
                        $validated['brand_id']
                    );
                }
            )

            ->orderBy('name')
            ->paginate(20)
            ->through(function (Product $product) {
                return $this->formatProduct($product);
            });

        return response()->json($products);
    }

    /**
     * Search customers from the POS screen.
     */
    public function searchCustomers(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search' => [
                'nullable',
                'string',
                'max:255',
            ],
        ]);

        $search = trim($validated['search'] ?? '');

        $customers = Customer::query()
            ->select([
                'id',
                'name',
                'phone',
                'email',
            ])

            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($customerQuery) use ($search) {
                    $customerQuery
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })

            ->orderBy('name')
            ->limit(20)
            ->get();

        return response()->json([
            'customers' => $customers,
        ]);
    }

    /**
     * Complete a POS sale.
     */
    public function checkout(
        StoreSaleRequest $request
    ): RedirectResponse {
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
     * Format a product for the POS frontend.
     */
    private function formatProduct(Product $product): array
    {
        $regularPrice = (float) $product->price;

        $sellingPrice = $product->discount_price !== null
            && (float) $product->discount_price > 0
                ? (float) $product->discount_price
                : $regularPrice;

        return [
            'id' => $product->id,
            'name' => $product->name,
            'sku' => $product->sku,
            'price' => $regularPrice,
            'discount_price' => $product->discount_price !== null
                ? (float) $product->discount_price
                : null,
            'selling_price' => $sellingPrice,
            'stock_quantity' => (int) $product->stock_quantity,
            'image' => $product->image,

            'category' => $product->category
                ? [
                    'id' => $product->category->id,
                    'name' => $product->category->name,
                ]
                : null,

            'brand' => $product->brand
                ? [
                    'id' => $product->brand->id,
                    'name' => $product->brand->name,
                ]
                : null,
        ];
    }
}
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Services\BarcodeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BarcodeLabelController extends Controller
{
    public function __construct(private readonly BarcodeService $barcodeService)
    {
    }

    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'brand_id' => ['nullable', 'integer', 'exists:brands,id'],
            'source' => ['nullable', 'in:products,variants'],
            'per_page' => ['nullable', 'integer', 'in:10,25,50,100'],
        ]);

        $source = $filters['source'] ?? 'products';
        $search = trim((string) ($filters['search'] ?? ''));
        $perPage = (int) ($filters['per_page'] ?? 25);

        if ($source === 'variants') {
            $items = ProductVariant::query()
                ->with(['product:id,name,category_id,brand_id', 'unit:id,name'])
                ->when($search !== '', fn ($query) => $query->where(function ($sub) use ($search) {
                    $sub->where('name', 'like', "%{$search}%")
                        ->orWhere('sku', 'like', "%{$search}%")
                        ->orWhere('barcode', 'like', "%{$search}%")
                        ->orWhereHas('product', fn ($product) => $product->where('name', 'like', "%{$search}%"));
                }))
                ->when($filters['category_id'] ?? null, fn ($query, $id) => $query->whereHas('product', fn ($product) => $product->where('category_id', $id)))
                ->when($filters['brand_id'] ?? null, fn ($query, $id) => $query->whereHas('product', fn ($product) => $product->where('brand_id', $id)))
                ->latest('id')
                ->paginate($perPage)
                ->withQueryString();
        } else {
            $items = Product::query()
                ->with(['category:id,name', 'brand:id,name'])
                ->when($search !== '', fn ($query) => $query->where(function ($sub) use ($search) {
                    $sub->where('name', 'like', "%{$search}%")
                        ->orWhere('sku', 'like', "%{$search}%")
                        ->orWhere('barcode', 'like', "%{$search}%");
                }))
                ->when($filters['category_id'] ?? null, fn ($query, $id) => $query->where('category_id', $id))
                ->when($filters['brand_id'] ?? null, fn ($query, $id) => $query->where('brand_id', $id))
                ->latest('id')
                ->paginate($perPage)
                ->withQueryString();
        }

        return Inertia::render('Admin/BarcodeLabels/Index', [
            'items' => $items,
            'filters' => array_merge($filters, ['source' => $source]),
            'categories' => Category::query()->where('status', true)->orderBy('name')->get(['id', 'name']),
            'brands' => Brand::query()->where('status', true)->orderBy('name')->get(['id', 'name']),
            'presets' => $this->presets(),
        ]);
    }

    public function generate(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'source' => ['required', 'in:products,variants'],
            'ids' => ['required', 'array', 'min:1', 'max:500'],
            'ids.*' => ['integer'],
            'barcode_type' => ['required', 'in:code128,ean13'],
            'only_missing' => ['nullable', 'boolean'],
        ]);

        $generated = 0;
        $onlyMissing = (bool) ($data['only_missing'] ?? true);

        if ($data['source'] === 'variants') {
            ProductVariant::query()->whereKey($data['ids'])->get()->each(function (ProductVariant $variant) use ($data, $onlyMissing, &$generated) {
                if ($onlyMissing && filled($variant->barcode)) {
                    return;
                }
                $this->barcodeService->generateForVariant($variant, $data['barcode_type']);
                $generated++;
            });
        } else {
            Product::query()->whereKey($data['ids'])->get()->each(function (Product $product) use ($data, $onlyMissing, &$generated) {
                if ($onlyMissing && filled($product->barcode)) {
                    return;
                }
                $this->barcodeService->generateForProduct($product, $data['barcode_type']);
                $generated++;
            });
        }

        return back()->with('success', "{$generated} barcode(s) generated successfully.");
    }

    public function print(Request $request): Response
    {
        $data = $request->validate([
            'source' => ['required', 'in:products,variants'],
            'ids' => ['required', 'array', 'min:1', 'max:500'],
            'ids.*' => ['integer'],
            'quantities' => ['nullable', 'array'],
            'quantities.*' => ['integer', 'min:1', 'max:500'],
            'preset' => ['nullable', 'in:38x25,50x25,100x50,a4-24,custom'],
            'width_mm' => ['nullable', 'numeric', 'min:20', 'max:210'],
            'height_mm' => ['nullable', 'numeric', 'min:15', 'max:297'],
            'columns' => ['nullable', 'integer', 'min:1', 'max:8'],
            'show_name' => ['nullable', 'boolean'],
            'show_price' => ['nullable', 'boolean'],
            'show_sku' => ['nullable', 'boolean'],
            'show_company' => ['nullable', 'boolean'],
        ]);

        $ids = array_values(array_unique(array_map('intval', $data['ids'])));
        $quantities = $data['quantities'] ?? [];
        $labels = [];

        if ($data['source'] === 'variants') {
            $records = ProductVariant::query()->with('product:id,name,price')->whereKey($ids)->get()->keyBy('id');
            foreach ($ids as $id) {
                $variant = $records->get($id);
                if (! $variant) continue;
                $quantity = max(1, min(500, (int) ($quantities[$id] ?? 1)));
                for ($i = 0; $i < $quantity; $i++) {
                    $labels[] = [
                        'id' => $variant->id,
                        'name' => $variant->product?->name.' - '.($variant->name ?: $variant->sku),
                        'sku' => $variant->sku,
                        'barcode' => $variant->barcode ?: $variant->sku,
                        'barcode_type' => preg_match('/^\d{13}$/', (string) ($variant->barcode ?: '')) ? 'ean13' : 'code128',
                        'price' => $variant->selling_price ?: $variant->product?->price,
                    ];
                }
            }
        } else {
            $records = Product::query()->whereKey($ids)->get()->keyBy('id');
            foreach ($ids as $id) {
                $product = $records->get($id);
                if (! $product) continue;
                $quantity = max(1, min(500, (int) ($quantities[$id] ?? 1)));
                for ($i = 0; $i < $quantity; $i++) {
                    $labels[] = [
                        'id' => $product->id,
                        'name' => $product->name,
                        'sku' => $product->sku,
                        'barcode' => $product->barcode ?: $product->sku,
                        'barcode_type' => $product->barcode_type ?: (preg_match('/^\d{13}$/', (string) ($product->barcode ?: '')) ? 'ean13' : 'code128'),
                        'price' => $product->discount_price ?: $product->price,
                    ];
                }
            }
        }

        $presetName = $data['preset'] ?? '50x25';
        $preset = $this->presets()[$presetName] ?? $this->presets()['50x25'];

        if ($presetName === 'custom') {
            $preset['width_mm'] = (float) ($data['width_mm'] ?? 50);
            $preset['height_mm'] = (float) ($data['height_mm'] ?? 25);
            $preset['columns'] = (int) ($data['columns'] ?? 4);
        }

        return Inertia::render('Admin/BarcodeLabels/Print', [
            'labels' => $labels,
            'preset' => $preset,
            'options' => [
                'show_name' => (bool) ($data['show_name'] ?? true),
                'show_price' => (bool) ($data['show_price'] ?? true),
                'show_sku' => (bool) ($data['show_sku'] ?? true),
                'show_company' => (bool) ($data['show_company'] ?? true),
            ],
        ]);
    }

    private function presets(): array
    {
        return [
            '38x25' => ['label' => '38 × 25 mm', 'width_mm' => 38, 'height_mm' => 25, 'columns' => 5, 'page' => 'A4'],
            '50x25' => ['label' => '50 × 25 mm', 'width_mm' => 50, 'height_mm' => 25, 'columns' => 4, 'page' => 'A4'],
            '100x50' => ['label' => '100 × 50 mm', 'width_mm' => 100, 'height_mm' => 50, 'columns' => 2, 'page' => 'A4'],
            'a4-24' => ['label' => 'A4 — 24 labels', 'width_mm' => 63.5, 'height_mm' => 33.9, 'columns' => 3, 'page' => 'A4'],
            'custom' => ['label' => 'Custom size', 'width_mm' => 50, 'height_mm' => 25, 'columns' => 4, 'page' => 'A4'],
        ];
    }
}

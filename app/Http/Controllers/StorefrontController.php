<?php

namespace App\Http\Controllers;

use App\Models\Author;
use App\Models\Category;
use App\Models\HomepageBanner;
use App\Models\HomepagePromotion;
use App\Models\Product;
use App\Models\Publisher;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class StorefrontController extends Controller
{
    public function home(): Response
    {
        $base = Product::query()->where('status', true)->with($this->relations());

        return Inertia::render('Storefront/Home', [
            'heroBanners' => HomepageBanner::query()->where('is_active', true)->orderBy('sort_order')->orderBy('id')->get()->map(fn ($banner) => [
                'id' => $banner->id,
                'badge' => $this->localizedValue($banner, 'badge'),
                'title' => $this->localizedValue($banner, 'title'),
                'highlight' => $this->localizedValue($banner, 'highlight'),
                'subtitle' => $this->localizedValue($banner, 'subtitle'),
                'primary_button_text' => $this->localizedValue($banner, 'primary_button_text'),
                'primary_button_url' => $banner->primary_button_url,
                'secondary_button_text' => $this->localizedValue($banner, 'secondary_button_text'),
                'secondary_button_url' => $banner->secondary_button_url,
                'image' => $banner->image,
                'background_from' => $banner->background_from,
                'background_to' => $banner->background_to,
                'text_color' => $banner->text_color,
            ]),
            'promotions' => HomepagePromotion::query()->where('is_active', true)->orderBy('sort_order')->orderBy('id')->get()->map(fn ($promotion) => [
                'id' => $promotion->id,
                'title' => $this->localizedValue($promotion, 'title'),
                'subtitle' => $this->localizedValue($promotion, 'subtitle'),
                'button_text' => $this->localizedValue($promotion, 'button_text'),
                'button_url' => $promotion->button_url,
                'image' => $promotion->image,
                'theme' => $promotion->theme,
            ]),
            'flashSale' => (clone $base)->whereNotNull('discount_price')->whereColumn('discount_price', '<', 'price')->orderByRaw('(price - discount_price) desc')->limit(8)->get()->map(fn ($p) => $this->card($p)),
            'featured' => (clone $base)->where('is_featured', true)->orderBy('sort_order')->limit(8)->get()->map(fn ($p) => $this->card($p)),
            'newArrivals' => (clone $base)->where('is_new_arrival', true)->latest()->limit(8)->get()->map(fn ($p) => $this->card($p)),
            'bestSellers' => (clone $base)->where('is_best_seller', true)->orderBy('sort_order')->limit(8)->get()->map(fn ($p) => $this->card($p)),
            'ebooks' => (clone $base)->whereIn('product_type', ['ebook', 'both'])->latest()->limit(8)->get()->map(fn ($p) => $this->card($p)),
            'categories' => $this->categoryOptions(12),
            'authors' => Author::where('status', true)->withCount(['products' => fn ($q) => $q->where('status', true)])->orderBy('sort_order')->limit(12)->get()->map(fn ($x) => ['id'=>$x->id,'name'=>$x->localized('name'),'slug'=>$x->slug,'products_count'=>$x->products_count]),
            'publishers' => Publisher::where('status', true)->withCount(['products' => fn ($q) => $q->where('status', true)])->orderBy('sort_order')->limit(12)->get()->map(fn ($x) => ['id'=>$x->id,'name'=>$x->localized('name'),'slug'=>$x->slug,'products_count'=>$x->products_count]),
        ]);
    }

    public function suggestions(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'q' => ['required', 'string', 'min:2', 'max:80'],
        ]);

        $term = trim($validated['q']);
        $cacheKey = 'storefront-search-suggestions:'.app()->getLocale().':'.mb_strtolower($term);

        $payload = Cache::remember($cacheKey, now()->addMinutes(2), function () use ($term) {
            $products = Product::query()
                ->where('status', true)
                ->with(['author:id,name,name_bn,slug', 'publisher:id,name,name_bn,slug'])
                ->where(function (Builder $query) use ($term) {
                    $query->where('name', 'like', "%{$term}%")
                        ->orWhere('name_bn', 'like', "%{$term}%")
                        ->orWhere('sku', 'like', "%{$term}%")
                        ->orWhere('isbn', 'like', "%{$term}%")
                        ->orWhere('barcode', 'like', "%{$term}%");
                })
                ->orderByDesc('is_best_seller')
                ->limit(6)
                ->get()
                ->map(fn (Product $product) => [
                    'id' => $product->id,
                    'type' => 'product',
                    'name' => $product->localized('name'),
                    'subtitle' => $product->author?->localized('name')
                        ?? $product->publisher?->localized('name')
                        ?? $product->sku,
                    'url' => route('storefront.products.show', $product->slug),
                    'image' => $product->image ? '/storage/'.$product->image : null,
                    'price' => (float) ($product->discount_price ?? $product->price),
                ]);

            $authors = Author::query()
                ->where('status', true)
                ->where(fn (Builder $query) => $query
                    ->where('name', 'like', "%{$term}%")
                    ->orWhere('name_bn', 'like', "%{$term}%"))
                ->withCount(['products' => fn ($query) => $query->where('status', true)])
                ->limit(4)
                ->get()
                ->map(fn (Author $author) => [
                    'id' => $author->id,
                    'type' => 'author',
                    'name' => $author->localized('name'),
                    'subtitle' => $author->products_count.' products',
                    'url' => route('storefront.author', $author->slug),
                ]);

            $publishers = Publisher::query()
                ->where('status', true)
                ->where(fn (Builder $query) => $query
                    ->where('name', 'like', "%{$term}%")
                    ->orWhere('name_bn', 'like', "%{$term}%"))
                ->withCount(['products' => fn ($query) => $query->where('status', true)])
                ->limit(4)
                ->get()
                ->map(fn (Publisher $publisher) => [
                    'id' => $publisher->id,
                    'type' => 'publisher',
                    'name' => $publisher->localized('name'),
                    'subtitle' => $publisher->products_count.' products',
                    'url' => route('storefront.publisher', $publisher->slug),
                ]);

            $categories = Category::query()
                ->where('status', true)
                ->where(fn (Builder $query) => $query
                    ->where('name', 'like', "%{$term}%")
                    ->orWhere('name_bn', 'like', "%{$term}%"))
                ->withCount(['products' => fn ($query) => $query->where('status', true)])
                ->limit(4)
                ->get()
                ->map(fn (Category $category) => [
                    'id' => $category->id,
                    'type' => 'category',
                    'name' => $category->localized('name'),
                    'subtitle' => $category->products_count.' products',
                    'url' => route('storefront.catalog', ['category' => $category->slug]),
                ]);

            return compact('products', 'authors', 'publishers', 'categories');
        });

        return response()->json([
            'query' => $term,
            'results' => $payload,
        ]);
    }

    public function catalog(Request $request): Response
    {
        $products = Product::query()->where('status', true)->with($this->relations());
        $this->filters($products, $request);
        match ($request->string('sort')->toString()) {
            'price_low' => $products->orderByRaw('COALESCE(discount_price, price) asc'),
            'price_high' => $products->orderByRaw('COALESCE(discount_price, price) desc'),
            'name' => $products->orderBy(app()->getLocale() === 'bn' ? 'name_bn' : 'name'),
            'newest' => $products->latest(),
            'discount' => $products->orderByRaw('(price - COALESCE(discount_price, price)) desc'),
            'popular' => $products->orderByDesc('is_best_seller')->orderBy('sort_order'),
            default => $products->latest(),
        };
        $page = $products->paginate(20)->withQueryString();
        $page->through(fn ($p) => $this->card($p));

        return Inertia::render('Storefront/Catalog', [
            'products' => $page,
            'filters' => $request->only(['search','category','author','publisher','language','binding','product_type','in_stock','sort','min_price','max_price']),
            'filterOptions' => [
                'categories' => $this->categoryOptions(),
                'authors' => Author::where('status', true)->orderBy('name')->get()->map(fn($x)=>['id'=>$x->id,'name'=>$x->localized('name'),'slug'=>$x->slug]),
                'publishers' => Publisher::where('status', true)->orderBy('name')->get()->map(fn($x)=>['id'=>$x->id,'name'=>$x->localized('name'),'slug'=>$x->slug]),
                'languages' => Product::whereNotNull('language')->distinct()->orderBy('language')->pluck('language'),
                'bindings' => Product::whereNotNull('binding')->distinct()->orderBy('binding')->pluck('binding'),
            ],
        ]);
    }

    public function show(Product $product): Response
    {
        abort_unless($product->status, 404);
        $product->load($this->relations());
        $related = Product::where('status', true)->whereKeyNot($product->id)->where('category_id', $product->category_id)->with($this->relations())->limit(8)->get()->map(fn ($p) => $this->card($p));
        return Inertia::render('Storefront/ProductShow', ['product' => $this->detail($product), 'related' => $related]);
    }

    public function author(Author $author): Response
    {
        abort_unless($author->status, 404);
        $products = Product::where('status', true)->where('author_id', $author->id)->with($this->relations())->paginate(20);
        $products->through(fn ($p) => $this->card($p));
        return Inertia::render('Storefront/Collection', ['title' => $author->localized('name'), 'subtitle' => $author->localized('biography'), 'products' => $products, 'type' => 'Author']);
    }

    public function publisher(Publisher $publisher): Response
    {
        abort_unless($publisher->status, 404);
        $products = Product::where('status', true)->where('publisher_id', $publisher->id)->with($this->relations())->paginate(20);
        $products->through(fn ($p) => $this->card($p));
        return Inertia::render('Storefront/Collection', ['title' => $publisher->localized('name'), 'subtitle' => $publisher->localized('description'), 'products' => $products, 'type' => 'Publisher']);
    }

    private function filters(Builder $q, Request $r): void
    {
        $q->when($r->filled('search'), function ($q) use ($r) {
            $s = trim((string) $r->input('search'));
            $q->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")->orWhere('name_bn', 'like', "%{$s}%")->orWhere('sku', 'like', "%{$s}%")->orWhere('isbn', 'like', "%{$s}%")
                    ->orWhereHas('author', fn ($x) => $x->where('name', 'like', "%{$s}%")->orWhere('name_bn', 'like', "%{$s}%"))
                    ->orWhereHas('publisher', fn ($x) => $x->where('name', 'like', "%{$s}%")->orWhere('name_bn', 'like', "%{$s}%"));
            });
        });
        $q->when($r->filled('category'), fn ($q) => $q->whereHas('category', fn ($x) => $x->where('slug', $r->input('category'))));
        $q->when($r->filled('author'), fn ($q) => $q->whereHas('author', fn ($x) => $x->where('slug', $r->input('author'))));
        $q->when($r->filled('publisher'), fn ($q) => $q->whereHas('publisher', fn ($x) => $x->where('slug', $r->input('publisher'))));
        $q->when($r->filled('language'), fn ($q) => $q->where('language', $r->input('language')));
        $q->when($r->filled('binding'), fn ($q) => $q->where('binding', $r->input('binding')));
        $q->when($r->filled('product_type'), fn ($q) => $q->where('product_type', $r->input('product_type')));
        $q->when($r->boolean('in_stock'), fn ($q) => $q->where('stock_quantity', '>', 0));
        $q->when($r->filled('min_price'), fn ($q) => $q->whereRaw('COALESCE(discount_price, price) >= ?', [(float) $r->input('min_price')]));
        $q->when($r->filled('max_price'), fn ($q) => $q->whereRaw('COALESCE(discount_price, price) <= ?', [(float) $r->input('max_price')]));
    }

    private function relations(): array
    {
        return ['category:id,name,name_bn,slug','brand:id,name,slug','author:id,name,name_bn,slug','publisher:id,name,name_bn,slug'];
    }

    private function card(Product $p): array
    {
        $discount = $p->discount_price && $p->price > 0 ? max(0, round((($p->price - $p->discount_price) / $p->price) * 100)) : 0;
        return [
            'id'=>$p->id,'name'=>$p->localized('name'),'slug'=>$p->slug,'image'=>$p->image ? '/storage/'.$p->image : null,
            'brand'=>$p->brand,
            'category'=>$p->category ? ['id'=>$p->category->id,'name'=>$p->category->localized('name'),'slug'=>$p->category->slug] : null,
            'author'=>$p->author ? ['id'=>$p->author->id,'name'=>$p->author->localized('name'),'slug'=>$p->author->slug] : null,
            'publisher'=>$p->publisher ? ['id'=>$p->publisher->id,'name'=>$p->publisher->localized('name'),'slug'=>$p->publisher->slug] : null,
            'price'=>(float)$p->price,'sale_price'=>$p->discount_price !== null ? (float)$p->discount_price : null,'ebook_price'=>$p->ebook_price !== null ? (float)$p->ebook_price : null,
            'discount'=>$discount,'stock'=>(int)$p->stock_quantity,'product_type'=>$p->product_type,'isbn'=>$p->isbn,'is_new'=>(bool)$p->is_new_arrival,'is_featured'=>(bool)$p->is_featured,'rating'=>0,'review_count'=>0,'sold'=>0,
        ];
    }

    private function detail(Product $p): array
    {
        return array_merge($this->card($p), ['sku'=>$p->sku,'short_description'=>$p->localized('short_description'),'description'=>$p->localized('description'),'edition'=>$p->edition,'language'=>$p->language,'pages'=>$p->pages,'publication_year'=>$p->publication_year,'binding'=>$p->binding,'weight'=>$p->weight,'dimensions'=>$p->dimensions]);
    }

    private function categoryOptions(?int $limit = null)
    {
        $query = Category::where('status', true)->withCount(['products' => fn($q) => $q->where('status', true)])->orderBy('sort_order')->orderBy('name');
        if ($limit) $query->limit($limit);
        return $query->get()->map(fn($x)=>['id'=>$x->id,'name'=>$x->localized('name'),'slug'=>$x->slug,'products_count'=>$x->products_count]);
    }

    private function localizedValue(object $model, string $field): mixed
    {
        $bn = $field.'_bn';
        return app()->getLocale() === 'bn' && filled($model->{$bn}) ? $model->{$bn} : $model->{$field};
    }
}

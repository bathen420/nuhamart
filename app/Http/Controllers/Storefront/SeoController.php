<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Author;
use App\Models\Category;
use App\Models\Product;
use App\Models\Publisher;
use Illuminate\Http\Response;

class SeoController extends Controller
{
    public function sitemap(): Response
    {
        $urls = collect([
            ['loc' => route('home'), 'lastmod' => now()->toDateString()],
            ['loc' => route('storefront.catalog'), 'lastmod' => now()->toDateString()],
        ]);

        Product::query()->where('status', true)->select('slug', 'updated_at')->chunkById(500, function ($items) use ($urls) {
            foreach ($items as $item) $urls->push(['loc' => route('storefront.products.show', $item->slug), 'lastmod' => $item->updated_at?->toDateString()]);
        });
        Category::query()->where('status', true)->select('slug', 'updated_at')->each(fn ($item) => $urls->push(['loc' => route('storefront.catalog', ['category' => $item->slug]), 'lastmod' => $item->updated_at?->toDateString()]));
        Author::query()->where('status', true)->select('slug', 'updated_at')->each(fn ($item) => $urls->push(['loc' => route('storefront.author', $item->slug), 'lastmod' => $item->updated_at?->toDateString()]));
        Publisher::query()->where('status', true)->select('slug', 'updated_at')->each(fn ($item) => $urls->push(['loc' => route('storefront.publisher', $item->slug), 'lastmod' => $item->updated_at?->toDateString()]));

        return response()->view('seo.sitemap', ['urls' => $urls])->header('Content-Type', 'application/xml');
    }
}

<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\HomepageBanner;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ModernStorefrontTest extends TestCase
{
    use RefreshDatabase;

    public function test_modern_homepage_receives_bilingual_navigation_content(): void
    {
        Category::create([
            'name' => 'Books',
            'name_bn' => 'বই',
            'slug' => 'books',
            'status' => true,
            'sort_order' => 1,
        ]);

        HomepageBanner::create([
            'title' => 'Read More',
            'title_bn' => 'আরও পড়ুন',
            'highlight' => 'Live Better',
            'highlight_bn' => 'ভালো থাকুন',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        $this->withSession(['locale' => 'bn'])
            ->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Storefront/Home')
                ->where('heroBanners.0.title', 'আরও পড়ুন')
                ->where('categories.0.name', 'বই')
            );
    }

    public function test_storefront_catalog_search_route_remains_available(): void
    {
        $this->get(route('storefront.catalog', ['search' => 'book']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Storefront/Catalog'));
    }
}

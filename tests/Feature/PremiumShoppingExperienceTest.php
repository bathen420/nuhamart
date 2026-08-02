<?php

namespace Tests\Feature;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class PremiumShoppingExperienceTest extends TestCase
{
    use RefreshDatabase;

    public function test_smart_search_route_is_registered(): void
    {
        $this->assertTrue(Route::has('storefront.search.suggestions'));
    }

    public function test_smart_search_returns_matching_products(): void
    {
        Product::factory()->create([
            'name' => 'Clean Code',
            'name_bn' => 'ক্লিন কোড',
            'sku' => 'BOOK-CLEAN-001',
            'isbn' => '9780132350884',
            'status' => true,
        ]);

        $response = $this->getJson(route('storefront.search.suggestions', ['q' => 'Clean']));

        $response->assertOk()
            ->assertJsonPath('query', 'Clean')
            ->assertJsonPath('results.products.0.name', 'Clean Code')
            ->assertJsonPath('results.products.0.type', 'product');
    }

    public function test_smart_search_rejects_too_short_query(): void
    {
        $this->getJson(route('storefront.search.suggestions', ['q' => 'a']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('q');
    }
}

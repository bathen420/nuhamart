<?php

namespace Tests\Feature;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PremiumProductExperienceTest extends TestCase
{
    use RefreshDatabase;

    public function test_product_page_exposes_gallery_and_sample_fields(): void
    {
        $category = Category::factory()->create();

        $brand = Brand::factory()->create();

        $product = Product::factory()->create([
            'category_id' => $category->id,
            'brand_id' => $brand->id,
            'slug' => 'premium-product-test',
            'gallery_images' => [
                'products/gallery/image-1.jpg',
                'products/gallery/image-2.jpg',
            ],
            'sample_file' => 'products/samples/sample.pdf',
        ]);

        $this->get(route('storefront.products.show', $product->slug))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Storefront/ProductShow')
                ->where('product.id', $product->id)
                ->where('product.slug', 'premium-product-test')
                ->where(
                    'product.gallery_images.0',
                    '/storage/products/gallery/image-1.jpg'
                )
                ->where(
                    'product.gallery_images.1',
                    '/storage/products/gallery/image-2.jpg'
                )
                ->where(
                    'product.sample_file',
                    '/storage/products/samples/sample.pdf'
                )
            );
    }
}
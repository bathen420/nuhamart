<?php

namespace Database\Factories;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * The model associated with the factory.
     *
     * @var class-string<Product>
     */
    protected $model = Product::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $category = Category::query()->firstOrCreate(
            ['slug' => 'factory-category'],
            [
                'name' => 'Factory Category',
                'description' => 'Default category created for automated tests.',
                'status' => true,
                'sort_order' => 0,
            ]
        );

        $brand = Brand::query()->firstOrCreate(
            ['slug' => 'factory-brand'],
            [
                'name' => 'Factory Brand',
                'description' => 'Default brand created for automated tests.',
                'status' => true,
                'sort_order' => 0,
            ]
        );

        $name = fake()->unique()->words(3, true);

        return [
            'category_id' => $category->id,
            'brand_id' => $brand->id,
            'name' => Str::title($name),
            'slug' => Str::slug($name) . '-' . Str::lower(Str::random(6)),
            'sku' => 'SKU-' . Str::upper(Str::random(10)),
            'short_description' => fake()->optional()->sentence(),
            'description' => fake()->optional()->paragraph(),
            'price' => fake()->randomFloat(2, 50, 5000),
            'discount_price' => null,
            'stock_quantity' => fake()->numberBetween(0, 100),
            'image' => null,
            'status' => true,
            'sort_order' => 0,
        ];
    }
}

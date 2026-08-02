<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CategoryFactory extends Factory
{
    protected $model = Category::class;

    public function definition(): array
    {
        $name = fake()->unique()->words(2, true);

        return [
            'name' => ucfirst($name),
            'name_bn' => null,
            'slug' => Str::slug($name) . '-' . fake()->unique()->numberBetween(1000, 999999),
            'description' => fake()->sentence(),
            'description_bn' => null,
            'status' => true,
            'sort_order' => fake()->numberBetween(0, 100),
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn () => [
            'status' => false,
        ]);
    }
}
<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * The name of the model that this factory creates.
     *
     * @var string
     */
    protected $model = Order::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subtotal = fake()->numberBetween(500, 5000);
        $discount = fake()->numberBetween(0, 500);
        $shipping = fake()->randomElement([0, 60, 100, 120]);
        $total = $subtotal - $discount + $shipping;

        return [
            'order_number' => 'ORD-' . strtoupper(Str::random(8)),

            'user_id' => User::factory(),

            'customer_name' => fake()->name(),
            'customer_phone' => fake()->phoneNumber(),
            'customer_email' => fake()->safeEmail(),
            'customer_address' => fake()->address(),

            'subtotal' => $subtotal,
            'discount' => $discount,
            'shipping' => $shipping,
            'total' => $total,

            'payment_method' => fake()->randomElement([
                'Cash On Delivery',
                'Bkash',
                'Nagad',
                'Rocket',
            ]),

            'payment_status' => fake()->randomElement([
                'Pending',
                'Paid',
                'Failed',
            ]),

            'order_status' => fake()->randomElement([
                'Pending',
                'Processing',
                'Shipped',
                'Delivered',
                'Cancelled',
            ]),

            'note' => fake()->optional()->sentence(),

            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
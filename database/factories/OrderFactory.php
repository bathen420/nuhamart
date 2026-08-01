<?php

namespace Database\Factories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * The model associated with this factory.
     *
     * @var class-string<Order>
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
        $shippingCharge = fake()->randomElement([
            0,
            60,
            100,
            120,
        ]);
        $discount = fake()->numberBetween(0, 500);

        $total = max(
            0,
            $subtotal + $shippingCharge - $discount
        );

        return [
            'order_no' => 'ORD-' . strtoupper(Str::random(8)),

            'customer_id' => null,

            'customer_name' => fake()->name(),

            'customer_phone' => '01' . fake()->numerify('#########'),

            'customer_email' => fake()->optional()->safeEmail(),

            'division' => fake()->randomElement([
                'Dhaka',
                'Chattogram',
                'Rajshahi',
                'Khulna',
                'Barishal',
                'Sylhet',
                'Rangpur',
                'Mymensingh',
            ]),

            'district' => fake()->city(),

            'area' => fake()->streetName(),

            'address' => fake()->address(),

            'note' => fake()->optional()->sentence(),

            'subtotal' => $subtotal,

            'shipping_charge' => $shippingCharge,

            'discount' => $discount,

            'total' => $total,

            'payment_method' => fake()->randomElement([
                'cod',
                'sslcommerz',
                'bkash',
                'nagad',
            ]),

            'payment_status' => fake()->randomElement([
                'pending',
                'paid',
                'failed',
            ]),

            'status' => fake()->randomElement([
                'pending',
                'confirmed',
                'processing',
                'shipped',
                'delivered',
                'cancelled',
            ]),

            'ordered_at' => fake()->dateTimeBetween(
                '-3 months',
                'now'
            ),
        ];
    }
}
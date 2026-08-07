<?php

namespace Tests\Feature;

use App\Models\CustomerAddress;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CheckoutExperienceV2Test extends TestCase
{
    use RefreshDatabase;

    public function test_checkout_page_exposes_customer_and_default_address(): void
    {
        $user = User::factory()->create([
            'phone' => '01712345678',
        ]);

        CustomerAddress::query()->create([
            'user_id' => $user->id,
            'label' => 'Home',
            'name' => $user->name,
            'phone' => '01712345678',
            'division' => 'Dhaka',
            'district' => 'Dhaka',
            'area' => 'Uttara',
            'address' => 'House 1',
            'is_default' => true,
        ]);

        $this->actingAs($user)
            ->get(route('checkout.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Checkout/Index')
                ->where('customer.name', $user->name)
                ->where('customer.phone', '01712345678')
                ->where('savedAddresses.0.label', 'Home')
                ->where('savedAddresses.0.is_default', true)
            );
    }

    public function test_checkout_normalizes_formatted_bangladesh_phone_number(): void
    {
        $request = new \App\Http\Requests\Checkout\StoreOrderRequest();

        $request->merge([
            'name' => 'Customer',
            'phone' => '017-1234-5678',
            'shipping_method' => 'store_pickup',
            'payment_method' => 'cod',
            'items' => [
                ['product_id' => 1, 'quantity' => 1],
            ],
        ]);

        $method = new \ReflectionMethod($request, 'prepareForValidation');
        $method->setAccessible(true);
        $method->invoke($request);

        $this->assertSame('01712345678', $request->input('phone'));
    }
}

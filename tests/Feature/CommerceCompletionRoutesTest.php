<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class CommerceCompletionRoutesTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_commerce_routes_are_registered(): void
    {
        foreach ([
            'orders.track',
            'orders.track.search',
            'customer.dashboard',
            'customer.orders.index',
            'customer.orders.show',
            'customer.addresses.index',
            'customer.addresses.store',
        ] as $name) {
            $this->assertTrue(Route::has($name), $name);
        }
    }

    public function test_customer_account_requires_authentication(): void
    {
        $this->get(route('customer.dashboard'))->assertRedirect(route('login'));
    }
}

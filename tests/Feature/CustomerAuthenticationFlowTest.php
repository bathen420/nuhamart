<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerAuthenticationFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_login_page_is_available(): void
    {
        $this->get(route('customer.login'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Customer/Auth/Login'));
    }

    public function test_customer_can_login_through_customer_endpoint(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password'),
        ]);

        $response = $this->post(route('customer.login.store'), [
            'email' => $user->email,
            'password' => 'password',
            'remember' => false,
        ]);

        $this->assertAuthenticatedAs($user);
        $response->assertRedirect(route('customer.dashboard'));
    }

    public function test_customer_can_register_through_customer_endpoint(): void
    {
        $response = $this->post(route('customer.register.store'), [
            'name' => 'Test Customer',
            'email' => 'customer@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('customer.dashboard'));
    }
}

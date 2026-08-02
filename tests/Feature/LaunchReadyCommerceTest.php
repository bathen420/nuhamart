<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class LaunchReadyCommerceTest extends TestCase
{
    use RefreshDatabase;

    public function test_launch_ready_routes_are_registered(): void
    {
        $this->assertTrue(Route::has('seo.sitemap'));
        $this->assertTrue(Route::has('admin.orders.workflow.update'));
    }

    public function test_launch_ready_fields_are_migrated(): void
    {
        $this->assertTrue(Schema::hasColumns('orders', ['courier_name', 'tracking_number', 'admin_note']));
        $this->assertTrue(Schema::hasColumns('business_settings', ['shipping_dhaka', 'shipping_outside_dhaka', 'free_shipping_threshold', 'bkash_number', 'nagad_number']));
        $this->assertTrue(Schema::hasColumns('products', ['seo_title', 'seo_description']));
    }
}

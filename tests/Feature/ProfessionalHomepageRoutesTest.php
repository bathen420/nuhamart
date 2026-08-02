<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class ProfessionalHomepageRoutesTest extends TestCase
{
    use RefreshDatabase;

    public function test_professional_homepage_routes_are_registered(): void
    {
        foreach ([
            'home',
            'storefront.catalog',
            'admin.homepage-content.index',
            'admin.homepage-content.banners.store',
            'admin.homepage-content.promotions.store',
        ] as $name) {
            $this->assertTrue(Route::has($name), $name);
        }
    }
}

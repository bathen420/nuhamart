<?php

namespace Tests\Feature;

use App\Models\HomepageSetting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class HomepageCmsTest extends TestCase
{
    use RefreshDatabase;

    public function test_homepage_cms_routes_are_registered(): void
    {
        $this->assertTrue(Route::has('admin.homepage-content.index'));
        $this->assertTrue(Route::has('admin.homepage-content.settings.update'));
        $this->assertTrue(Route::has('admin.homepage-content.banners.store'));
        $this->assertTrue(Route::has('admin.homepage-content.promotions.store'));
    }

    public function test_homepage_settings_have_safe_defaults(): void
    {
        $settings = HomepageSetting::payload();

        $this->assertSame('book_store', $settings['general']['preset']);
        $this->assertTrue($settings['sections']['hero']['enabled']);
        $this->assertArrayHasKey('flash_sale', $settings['sections']);
    }
}

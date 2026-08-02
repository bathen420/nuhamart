<?php

namespace Tests\Feature;

use App\Models\HomepageBanner;
use App\Models\HomepagePromotion;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProfessionalHomepageTest extends TestCase
{
    use RefreshDatabase;

    public function test_homepage_receives_dynamic_banner_and_promotion_content(): void
    {
        HomepageBanner::create([
            'title' => 'Test Hero',
            'highlight' => 'Special Offer',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        HomepagePromotion::create([
            'title' => 'E-Books Library',
            'theme' => 'mint',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Storefront/Home')
                ->has('heroBanners', 1)
                ->where('heroBanners.0.title', 'Test Hero')
                ->has('promotions', 1)
                ->has('flashSale')
            );
    }
}

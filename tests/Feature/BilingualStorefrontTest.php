<?php
namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BilingualStorefrontTest extends TestCase
{
    use RefreshDatabase;

    public function test_language_switch_route_stores_supported_locale(): void
    {
        $this->from('/')->get(route('language.switch', 'bn'))->assertRedirect('/');
        $this->assertSame('bn', session('locale'));
    }

    public function test_unsupported_locale_is_rejected(): void
    {
        $this->get('/language/fr')->assertNotFound();
    }
}

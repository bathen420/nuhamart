<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Services\BarcodeService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BarcodeServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_generates_valid_unique_ean13_for_a_product(): void
    {
        $product = Product::factory()->create(['barcode' => null]);
        $barcode = app(BarcodeService::class)->generateForProduct($product, 'ean13');

        $this->assertMatchesRegularExpression('/^\d{13}$/', $barcode);
        $this->assertSame($barcode, $product->fresh()->barcode);
        $this->assertSame('ean13', $product->fresh()->barcode_type);
    }

    public function test_ean13_check_digit_is_calculated(): void
    {
        $service = app(BarcodeService::class);

        // GS1 example: 400638133393 + check digit 1 = 4006381333931.
        $this->assertSame('1', $service->ean13CheckDigit('400638133393'));
        $this->assertSame('4006381333931', $service->normalizeEan13('400638133393'));
    }

    public function test_normalize_ean13_accepts_an_existing_valid_code(): void
    {
        $service = app(BarcodeService::class);

        $this->assertSame('4006381333931', $service->normalizeEan13('4006381333931'));
    }
}

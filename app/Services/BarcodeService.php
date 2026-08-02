<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class BarcodeService
{
    public function generateForProduct(Product $product, string $type = 'code128'): string
    {
        $barcode = $type === 'ean13'
            ? $this->ean13FromId($product->id, '20')
            : $this->code128Value('P', $product->id, $product->sku);

        $this->assertProductBarcodeUnique($barcode, $product->id);

        $product->forceFill([
            'barcode' => $barcode,
            'barcode_type' => $type,
        ])->save();

        return $barcode;
    }

    public function generateForVariant(ProductVariant $variant, string $type = 'code128'): string
    {
        $barcode = $type === 'ean13'
            ? $this->ean13FromId($variant->id, '21')
            : $this->code128Value('V', $variant->id, $variant->sku);

        if (ProductVariant::query()
            ->where('barcode', $barcode)
            ->whereKeyNot($variant->id)
            ->exists()) {
            throw ValidationException::withMessages([
                'barcode' => 'Generated barcode already belongs to another variant.',
            ]);
        }

        $variant->forceFill(['barcode' => $barcode])->save();

        return $barcode;
    }

    public function normalizeEan13(string $value): string
    {
        $digits = preg_replace('/\D+/', '', $value) ?? '';

        if (strlen($digits) === 12) {
            return $digits.$this->ean13CheckDigit($digits);
        }

        if (strlen($digits) !== 13 || $this->ean13CheckDigit(substr($digits, 0, 12)) !== $digits[12]) {
            throw ValidationException::withMessages([
                'barcode' => 'EAN-13 must contain 12 digits (check digit will be added) or a valid 13-digit code.',
            ]);
        }

        return $digits;
    }

    public function ean13CheckDigit(string $twelveDigits): string
    {
        if (! preg_match('/^\d{12}$/', $twelveDigits)) {
            throw ValidationException::withMessages([
                'barcode' => 'EAN-13 base must contain exactly 12 digits.',
            ]);
        }

        $sum = 0;
        foreach (str_split($twelveDigits) as $index => $digit) {
            $sum += (int) $digit * ($index % 2 === 0 ? 1 : 3);
        }

        return (string) ((10 - ($sum % 10)) % 10);
    }

    private function ean13FromId(int $id, string $prefix): string
    {
        $base = $prefix.str_pad((string) $id, 10, '0', STR_PAD_LEFT);
        $base = substr($base, 0, 12);

        return $base.$this->ean13CheckDigit($base);
    }

    private function code128Value(string $prefix, int $id, ?string $sku): string
    {
        $safeSku = Str::upper(preg_replace('/[^A-Za-z0-9\-_.]/', '', (string) $sku) ?: 'ITEM');

        return substr($prefix.'-'.$id.'-'.$safeSku, 0, 100);
    }

    private function assertProductBarcodeUnique(string $barcode, int $ignoreId): void
    {
        if (Product::query()->where('barcode', $barcode)->whereKeyNot($ignoreId)->exists()) {
            throw ValidationException::withMessages([
                'barcode' => 'Generated barcode already belongs to another product.',
            ]);
        }
    }
}

<?php

namespace App\Services;

use App\Models\Coupon;
use App\Models\Product;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

class CouponService
{
    public function evaluate(?string $code, Collection $lines, float $subtotal, float $shipping, ?int $userId, ?string $phone): array
    {
        if (! $code) return ['coupon' => null, 'discount' => 0.0, 'shipping_discount' => 0.0];

        $coupon = Coupon::query()->currentlyActive()->whereRaw('UPPER(code) = ?', [strtoupper(trim($code))])->first();
        if (! $coupon) throw ValidationException::withMessages(['coupon_code' => 'Coupon is invalid, inactive or expired.']);
        if ($subtotal < (float) $coupon->minimum_order) throw ValidationException::withMessages(['coupon_code' => 'Minimum order amount for this coupon is ৳'.number_format((float)$coupon->minimum_order, 2).'.']);
        if ($coupon->usage_limit !== null && $coupon->used_count >= $coupon->usage_limit) throw ValidationException::withMessages(['coupon_code' => 'This coupon has reached its usage limit.']);

        $usedByCustomer = $coupon->redemptions()->where(function ($q) use ($userId, $phone) {
            if ($userId) $q->where('user_id', $userId);
            elseif ($phone) $q->where('customer_phone', $phone);
        })->count();
        if ($usedByCustomer >= $coupon->per_customer_limit) throw ValidationException::withMessages(['coupon_code' => 'You have already used this coupon.']);

        $eligibleSubtotal = $this->eligibleSubtotal($coupon, $lines);
        if ($eligibleSubtotal <= 0) throw ValidationException::withMessages(['coupon_code' => 'This coupon does not apply to the selected products.']);

        $discount = match ($coupon->type) {
            'percentage' => $eligibleSubtotal * ((float)$coupon->value / 100),
            'fixed' => min((float)$coupon->value, $eligibleSubtotal),
            default => 0.0,
        };
        if ($coupon->maximum_discount !== null) $discount = min($discount, (float)$coupon->maximum_discount);
        $shippingDiscount = $coupon->type === 'free_shipping' ? $shipping : 0.0;

        return ['coupon'=>$coupon, 'discount'=>round($discount,2), 'shipping_discount'=>round($shippingDiscount,2)];
    }

    private function eligibleSubtotal(Coupon $coupon, Collection $lines): float
    {
        if ($coupon->scope_type === 'all') return (float)$lines->sum('lineSubtotal');
        $ids = collect($coupon->scope_ids ?? [])->map(fn($id)=>(int)$id);
        return (float)$lines->filter(function ($line) use ($coupon, $ids) {
            /** @var Product $product */ $product = $line['product'];
            return match ($coupon->scope_type) {
                'product' => $ids->contains($product->id),
                'category' => $ids->contains((int)$product->category_id),
                'brand' => $ids->contains((int)$product->brand_id),
                default => false,
            };
        })->sum('lineSubtotal');
    }
}

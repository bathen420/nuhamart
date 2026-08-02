<?php

namespace App\Repositories;

use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use RuntimeException;

class OrderRepository
{
    public function create(array $data): Order
    {
        return DB::transaction(function () use ($data) {
            $subtotal = 0.0;
            $preparedItems = [];
            $containsPhysicalItem = false;

            foreach ($data['items'] as $item) {
                $product = Product::query()->lockForUpdate()->findOrFail($item['product_id']);

                if (! $product->status) {
                    throw new RuntimeException("{$product->name} is no longer available.");
                }

                $quantity = (int) $item['quantity'];
                $isDigitalOnly = $product->product_type === 'ebook';
                $containsPhysicalItem = $containsPhysicalItem || ! $isDigitalOnly;

                if (! $isDigitalOnly && (int) $product->stock_quantity < $quantity) {
                    throw new RuntimeException("Only {$product->stock_quantity} unit(s) of {$product->name} are available.");
                }

                $unitPrice = $isDigitalOnly
                    ? (float) ($product->ebook_price ?? $product->discount_price ?? $product->price)
                    : (float) ($product->discount_price ?? $product->price);

                if ($unitPrice < 0) {
                    throw new RuntimeException("Invalid price for {$product->name}.");
                }

                $lineSubtotal = round($unitPrice * $quantity, 2);
                $subtotal += $lineSubtotal;

                $preparedItems[] = compact('product', 'quantity', 'unitPrice', 'lineSubtotal', 'isDigitalOnly');
            }

            $shippingCharge = $containsPhysicalItem ? $this->shippingCharge($data['district']) : 0.0;
            $discount = 0.0;
            $total = max(0, round($subtotal + $shippingCharge - $discount, 2));
            $customer = $this->resolveCustomer($data);

            $order = Order::create([
                'order_no' => $this->generateOrderNo(),
                'customer_id' => $customer?->id,
                'user_id' => $data['user_id'] ?? null,
                'customer_name' => $data['name'],
                'customer_phone' => $data['phone'],
                'customer_email' => $data['email'] ?? null,
                'division' => $data['division'],
                'district' => $data['district'],
                'area' => $data['area'],
                'address' => $data['address'],
                'note' => $data['note'] ?? null,
                'subtotal' => round($subtotal, 2),
                'shipping_charge' => $shippingCharge,
                'shipping_method' => $data['shipping_method'] ?? 'standard',
                'discount' => $discount,
                'total' => $total,
                'payment_method' => $data['payment_method'],
                'payment_reference' => $data['payment_reference'] ?? null,
                'payment_status' => 'pending',
                'status' => 'pending',
                'ordered_at' => now(),
            ]);

            foreach ($preparedItems as $line) {
                $product = $line['product'];

                $order->items()->create([
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'sku' => $product->sku,
                    'unit_price' => $line['unitPrice'],
                    'quantity' => $line['quantity'],
                    'subtotal' => $line['lineSubtotal'],
                ]);

                if (! $line['isDigitalOnly']) {
                    $product->decrement('stock_quantity', $line['quantity']);
                }
            }

            return $order->load('items.product');
        });
    }

    private function resolveCustomer(array $data): ?Customer
    {
        return Customer::query()->where('phone', $data['phone'])->first();
    }

    private function shippingCharge(string $district): float
    {
        return strcasecmp(trim($district), 'Dhaka') === 0
            ? (float) config('commerce.shipping.dhaka', 60)
            : (float) config('commerce.shipping.outside_dhaka', 120);
    }

    private function generateOrderNo(): string
    {
        do {
            $orderNo = 'NM-' . now()->format('ymdHis') . '-' . strtoupper(Str::random(4));
        } while (Order::where('order_no', $orderNo)->exists());

        return $orderNo;
    }
}

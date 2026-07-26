<?php

namespace App\Repositories;

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

            $subtotal = 0;
            $preparedItems = [];

            foreach ($data['items'] as $item) {
                $product = Product::query()
                    ->lockForUpdate()
                    ->findOrFail($item['product_id']);

                $quantity = (int) $item['quantity'];

                if ($product->stock_quantity < $quantity) {
                    throw new RuntimeException(
                        "Insufficient stock for {$product->name}."
                    );
                }

                $unitPrice = (float) $product->price;
                $itemSubtotal = $unitPrice * $quantity;
                $subtotal += $itemSubtotal;

                $preparedItems[] = [
                    'product' => $product,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'subtotal' => $itemSubtotal,
                ];
            }

            $shippingCharge = 0;
            $discount = 0;
            $total = $subtotal + $shippingCharge - $discount;

            $order = Order::create([
                'order_no' => $this->generateOrderNo(),

                'customer_id' => auth()->id(),

                'customer_name' => $data['name'],
                'customer_phone' => $data['phone'],
                'customer_email' => $data['email'] ?? null,

                'division' => $data['division'],
                'district' => $data['district'],
                'area' => $data['area'],
                'address' => $data['address'],

                'note' => $data['note'] ?? null,

                'subtotal' => $subtotal,
                'shipping_charge' => $shippingCharge,
                'discount' => $discount,
                'total' => $total,

                'payment_method' => $data['payment_method'],
                'payment_status' => 'pending',
                'status' => 'pending',

                'ordered_at' => now(),
            ]);

            foreach ($preparedItems as $preparedItem) {
                $product = $preparedItem['product'];

                $order->items()->create([
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'sku' => $product->sku ?? null,
                    'unit_price' => $preparedItem['unit_price'],
                    'quantity' => $preparedItem['quantity'],
                    'subtotal' => $preparedItem['subtotal'],
                ]);

                $product->decrement(
                    'stock_quantity',
                    $preparedItem['quantity']
                );
            }

            return $order->load('items');
        });
    }

    private function generateOrderNo(): string
    {
        do {
            $orderNo = 'ORD-'
                . now()->format('YmdHis')
                . '-'
                . strtoupper(Str::random(4));
        } while (
            Order::where('order_no', $orderNo)->exists()
        );

        return $orderNo;
    }
}
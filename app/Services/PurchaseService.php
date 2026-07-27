<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Purchase;
use App\Models\StockHistory;
use App\Repositories\PurchaseRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PurchaseService
{
    public function __construct(
        protected PurchaseRepository $repository
    ) {
    }

    public function create(array $data, int $userId): Purchase
    {
        return DB::transaction(function () use ($data, $userId) {
            $items = [];
            $subtotal = 0;

            foreach ($data['items'] as $row) {
                $quantity = (int) $row['quantity'];
                $price = (float) $row['price'];
                $lineSubtotal = round($quantity * $price, 2);
                $subtotal += $lineSubtotal;

                $items[] = [
                    'product_id' => (int) $row['product_id'],
                    'quantity' => $quantity,
                    'price' => $price,
                    'subtotal' => $lineSubtotal,
                ];
            }

            $discount = max(0, (float) ($data['discount'] ?? 0));
            $shipping = max(0, (float) ($data['shipping'] ?? 0));
            $total = max(0, round($subtotal - $discount + $shipping, 2));
            $paid = min(max(0, (float) $data['paid_amount']), $total);
            $due = round($total - $paid, 2);

            $purchase = $this->repository->create([
                'purchase_number' => $data['purchase_number'],
                'supplier_id' => $data['supplier_id'],
                'user_id' => $userId,
                'purchase_date' => $data['purchase_date'],
                'subtotal' => $subtotal,
                'discount' => $discount,
                'shipping' => $shipping,
                'total' => $total,
                'paid_amount' => $paid,
                'due_amount' => $due,
                'payment_method' => $data['payment_method'],
                'payment_status' => $this->paymentStatus($paid, $total),
                'note' => $data['note'] ?? null,
            ]);

            foreach ($items as $item) {
                $product = Product::query()
                    ->lockForUpdate()
                    ->findOrFail($item['product_id']);

                $before = (int) $product->stock_quantity;
                $after = $before + $item['quantity'];

                $purchase->items()->create($item);

                $product->update([
                    'stock_quantity' => $after,
                ]);

                StockHistory::create([
                    'product_id' => $product->id,
                    'user_id' => $userId,
                    'type' => 'IN',
                    'quantity' => $item['quantity'],
                    'stock_before' => $before,
                    'stock_after' => $after,
                    'reference' => $purchase->purchase_number,
                    'note' => 'Purchase stock added',
                ]);
            }

            if ($paid > 0) {
                $purchase->payments()->create([
                    'user_id' => $userId,
                    'amount' => $paid,
                    'payment_method' => $data['payment_method'],
                    'payment_date' => $data['purchase_date'],
                    'reference' => $purchase->purchase_number,
                    'note' => 'Initial purchase payment',
                ]);
            }

            return $purchase->load(['supplier', 'user', 'items.product', 'payments.user']);
        });
    }

    public function addPayment(
        Purchase $purchase,
        array $data,
        int $userId
    ): Purchase {
        return DB::transaction(function () use ($purchase, $data, $userId) {
            $purchase = Purchase::query()->lockForUpdate()->findOrFail($purchase->id);
            $amount = round((float) $data['amount'], 2);
            $due = (float) $purchase->due_amount;

            if ($amount > $due) {
                throw ValidationException::withMessages([
                    'amount' => "Payment cannot exceed due amount of {$due}.",
                ]);
            }

            $purchase->payments()->create([
                'user_id' => $userId,
                'amount' => $amount,
                'payment_method' => $data['payment_method'],
                'payment_date' => $data['payment_date'],
                'reference' => $data['reference'] ?? null,
                'note' => $data['note'] ?? null,
            ]);

            $paid = round((float) $purchase->paid_amount + $amount, 2);
            $remainingDue = round((float) $purchase->total - $paid, 2);

            $purchase->update([
                'paid_amount' => $paid,
                'due_amount' => $remainingDue,
                'payment_status' => $this->paymentStatus($paid, (float) $purchase->total),
            ]);

            return $purchase->refresh()->load(['payments.user']);
        });
    }

    private function paymentStatus(float $paid, float $total): string
    {
        if ($paid <= 0) {
            return 'unpaid';
        }

        return $paid >= $total ? 'paid' : 'partial';
    }
}

<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Sale;
use App\Models\StockHistory;
use App\Repositories\SaleRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SaleService
{
    public function __construct(
        protected SaleRepository $saleRepository,
        protected AccountingService $accounting,
        protected CrmLoyaltyService $crm
    ) {
    }

    public function store(array $data): Sale
    {
        return DB::transaction(function () use ($data): Sale {
            $products = Product::query()
                ->whereIn('id', collect($data['items'])->pluck('product_id')->all())
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            $items = [];
            $subtotal = 0.0;

            foreach ($data['items'] as $row) {
                $product = $products->get((int) $row['product_id']);

                if (! $product) {
                    throw ValidationException::withMessages([
                        'items' => 'One or more selected products were not found.',
                    ]);
                }

                $quantity = (int) $row['quantity'];
                $available = (int) $product->stock_quantity;

                if ($quantity > $available) {
                    throw ValidationException::withMessages([
                        'items' => "Insufficient stock for {$product->name}. Available: {$available}.",
                    ]);
                }

                $price = $product->discount_price !== null && (float) $product->discount_price > 0
                    ? (float) $product->discount_price
                    : (float) $product->price;

                $lineSubtotal = round($price * $quantity, 2);
                $subtotal += $lineSubtotal;

                $items[] = [
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'price' => $price,
                    'subtotal' => $lineSubtotal,
                ];
            }

            $discount = max(0, (float) ($data['discount'] ?? 0));
            $tax = max(0, (float) ($data['tax'] ?? 0));
            $shipping = max(0, (float) ($data['shipping'] ?? 0));
            $total = max(0, round($subtotal - $discount + $tax + $shipping, 2));
            $paid = min(max(0, (float) ($data['paid_amount'] ?? 0)), $total);
            $due = round($total - $paid, 2);

            $sale = $this->saleRepository->create([
                'sale_number' => $this->saleRepository->generateSaleNumber(),
                'customer_id' => $data['customer_id'] ?? null,
                'user_id' => Auth::id(),
                'subtotal' => round($subtotal, 2),
                'discount' => round($discount, 2),
                'tax' => round($tax, 2),
                'shipping' => round($shipping, 2),
                'total' => $total,
                'paid_amount' => round($paid, 2),
                'due_amount' => $due,
                'payment_method' => $data['payment_method'],
                'payment_status' => $due <= 0 ? 'Paid' : ($paid > 0 ? 'Partial' : 'Due'),
                'sale_status' => 'Completed',
                'note' => $data['note'] ?? null,
            ]);

            $this->saleRepository->createItems($sale, $items);

            foreach ($items as $item) {
                /** @var Product $product */
                $product = $products->get($item['product_id']);
                $before = (int) $product->stock_quantity;
                $after = $before - $item['quantity'];

                $product->update(['stock_quantity' => $after]);

                StockHistory::create([
                    'product_id' => $product->id,
                    'user_id' => Auth::id(),
                    'type' => 'OUT',
                    'quantity' => $item['quantity'],
                    'stock_before' => $before,
                    'stock_after' => $after,
                    'reference' => $sale->sale_number,
                    'note' => 'Product sold through POS.',
                ]);
            }

            $this->accounting->postSale($sale, (int) Auth::id());
            $this->crm->recordSale($sale, Auth::id());

            return $sale->load(['customer', 'user', 'items.product']);
        });
    }
}

<?php

namespace App\Services;

use App\Models\Product;
use App\Models\StockHistory;
use App\Repositories\SaleRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class SaleService
{
    public function __construct(
        protected SaleRepository $saleRepository
    ) {
    }

    /**
     * Process Sale
     */
    public function store(array $data)
    {
        return DB::transaction(function () use ($data) {

            // Generate Invoice Number
            $saleNumber = $this->saleRepository->generateSaleNumber();

            // Calculate Due
            $dueAmount = $data['total'] - $data['paid_amount'];

            // Payment Status
            $paymentStatus = $dueAmount <= 0
                ? 'Paid'
                : ($data['paid_amount'] > 0 ? 'Partial' : 'Due');

            // Create Sale
            $sale = $this->saleRepository->create([
                'sale_number'     => $saleNumber,
                'customer_id'     => $data['customer_id'] ?? null,
                'user_id'         => Auth::id(),
                'subtotal'        => $data['subtotal'],
                'discount'        => $data['discount'] ?? 0,
                'tax'             => $data['tax'] ?? 0,
                'shipping'        => $data['shipping'] ?? 0,
                'total'           => $data['total'],
                'paid_amount'     => $data['paid_amount'],
                'due_amount'      => max($dueAmount, 0),
                'payment_method'  => $data['payment_method'],
                'payment_status'  => $paymentStatus,
                'sale_status'     => 'Completed',
                'note'            => $data['note'] ?? null,
            ]);

            // Save Sale Items
            $this->saleRepository->createItems($sale, $data['items']);

            // Update Stock
            foreach ($data['items'] as $item) {

                $product = Product::lockForUpdate()->findOrFail($item['product_id']);

                if ($product->stock_quantity < $item['quantity']) {
                    throw new RuntimeException(
                        "{$product->name} does not have enough stock."
                    );
                }

                $before = $product->stock_quantity;

                $product->decrement('stock_quantity', $item['quantity']);

                StockHistory::create([
                    'product_id' => $product->id,
                    'user_id' => Auth::id(),
                    'type' => 'OUT',
                    'quantity' => $item['quantity'],
                    'before_stock' => $before,
                    'after_stock' => $before - $item['quantity'],
                    'reference_type' => 'Sale',
                    'reference_id' => $sale->id,
                    'remarks' => 'Product Sold',
                ]);
            }

            return $sale;
        });
    }
}
<?php

namespace App\Repositories;

use App\Models\Sale;

class SaleRepository
{
    /**
     * Generate Sale Number
     */
    public function generateSaleNumber(): string
    {
        $lastSale = Sale::latest('id')->first();

        $next = $lastSale ? ($lastSale->id + 1) : 1;

        return 'INV-' . date('Ymd') . '-' . str_pad($next, 5, '0', STR_PAD_LEFT);
    }

    /**
     * Create Sale
     */
    public function create(array $data): Sale
    {
        return Sale::create($data);
    }

    /**
     * Create Sale Items
     */
    public function createItems(Sale $sale, array $items): void
    {
        foreach ($items as $item) {

            $sale->items()->create([
                'product_id' => $item['product_id'],
                'quantity'   => $item['quantity'],
                'price'      => $item['price'],
                'subtotal'   => $item['subtotal'],
            ]);

        }
    }
}
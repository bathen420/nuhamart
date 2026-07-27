<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\SaleReturn;
use App\Models\StockHistory;
use App\Repositories\SaleReturnRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SaleReturnService
{
    public function __construct(
        protected SaleReturnRepository $repository
    ) {
    }

    public function create(Sale $sale, array $data, int $userId): SaleReturn
    {
        return DB::transaction(function () use ($sale, $data, $userId) {
            $sale = Sale::query()->lockForUpdate()->findOrFail($sale->id);

            $requestedItems = collect($data['items'])
                ->filter(fn ($row) => (int) ($row['quantity'] ?? 0) > 0)
                ->values();

            if ($requestedItems->isEmpty()) {
                throw ValidationException::withMessages([
                    'items' => 'Select at least one product and enter a return quantity.',
                ]);
            }

            $saleItems = SaleItem::query()
                ->where('sale_id', $sale->id)
                ->whereIn('id', $requestedItems->pluck('sale_item_id'))
                ->withSum('returnItems as returned_quantity', 'quantity')
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            $returnLines = [];
            $subtotal = 0;

            foreach ($requestedItems as $row) {
                $saleItem = $saleItems->get((int) $row['sale_item_id']);

                if (! $saleItem) {
                    throw ValidationException::withMessages([
                        'items' => 'One or more items do not belong to this sale.',
                    ]);
                }

                $alreadyReturned = (int) ($saleItem->returned_quantity ?? 0);
                $availableToReturn = (int) $saleItem->quantity - $alreadyReturned;
                $quantity = (int) $row['quantity'];

                if ($quantity > $availableToReturn) {
                    throw ValidationException::withMessages([
                        'items' => "Maximum return quantity for item {$saleItem->id} is {$availableToReturn}.",
                    ]);
                }

                $lineSubtotal = round((float) $saleItem->price * $quantity, 2);
                $subtotal += $lineSubtotal;

                $returnLines[] = [
                    'sale_item_id' => $saleItem->id,
                    'product_id' => $saleItem->product_id,
                    'quantity' => $quantity,
                    'price' => $saleItem->price,
                    'subtotal' => $lineSubtotal,
                ];
            }

            $refundAmount = round(min($subtotal, (float) $sale->paid_amount), 2);

            $saleReturn = $this->repository->create([
                'return_number' => $this->repository->generateReturnNumber(),
                'sale_id' => $sale->id,
                'customer_id' => $sale->customer_id,
                'user_id' => $userId,
                'return_date' => $data['return_date'],
                'subtotal' => $subtotal,
                'refund_amount' => $refundAmount,
                'refund_method' => $data['refund_method'],
                'status' => 'completed',
                'reason' => $data['reason'] ?? null,
            ]);

            foreach ($returnLines as $line) {
                $saleReturn->items()->create($line);

                $product = Product::query()
                    ->lockForUpdate()
                    ->findOrFail($line['product_id']);

                $before = (int) $product->stock_quantity;
                $after = $before + (int) $line['quantity'];

                $product->update(['stock_quantity' => $after]);

                StockHistory::create([
                    'product_id' => $product->id,
                    'user_id' => $userId,
                    'type' => 'IN',
                    'quantity' => $line['quantity'],
                    'stock_before' => $before,
                    'stock_after' => $after,
                    'reference' => $saleReturn->return_number,
                    'note' => "Sales return for {$sale->sale_number}.",
                ]);
            }

            $newTotal = max(0, round((float) $sale->total - $subtotal, 2));
            $newPaid = max(0, round((float) $sale->paid_amount - $refundAmount, 2));
            $newDue = max(0, round($newTotal - $newPaid, 2));

            $allReturned = $sale->items()
                ->withSum('returnItems as returned_quantity', 'quantity')
                ->get()
                ->every(fn ($item) => (int) $item->returned_quantity >= (int) $item->quantity);

            $sale->update([
                'total' => $newTotal,
                'paid_amount' => $newPaid,
                'due_amount' => $newDue,
                'payment_status' => $newDue <= 0 ? 'Paid' : ($newPaid > 0 ? 'Partial' : 'Due'),
                'sale_status' => $allReturned ? 'Returned' : 'Partially Returned',
            ]);

            return $saleReturn->load([
                'sale',
                'customer',
                'user:id,name',
                'items.product',
            ]);
        });
    }
}

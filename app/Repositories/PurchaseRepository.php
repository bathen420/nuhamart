<?php

namespace App\Repositories;

use App\Models\Purchase;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PurchaseRepository
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return Purchase::query()
            ->with(['supplier:id,name,phone', 'user:id,name'])
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery
                        ->where('purchase_number', 'like', "%{$search}%")
                        ->orWhereHas('supplier', fn ($supplierQuery) =>
                            $supplierQuery->where('name', 'like', "%{$search}%")
                        );
                });
            })
            ->when($filters['payment_status'] ?? null, fn ($query, $status) =>
                $query->where('payment_status', $status)
            )
            ->when($filters['date_from'] ?? null, fn ($query, $date) =>
                $query->whereDate('purchase_date', '>=', $date)
            )
            ->when($filters['date_to'] ?? null, fn ($query, $date) =>
                $query->whereDate('purchase_date', '<=', $date)
            )
            ->latest('id')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function create(array $data): Purchase
    {
        return Purchase::create($data);
    }
}

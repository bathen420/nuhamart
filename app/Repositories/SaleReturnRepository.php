<?php

namespace App\Repositories;

use App\Models\SaleReturn;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class SaleReturnRepository
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return SaleReturn::query()
            ->with(['sale:id,sale_number', 'customer:id,name,phone', 'user:id,name'])
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery
                        ->where('return_number', 'like', "%{$search}%")
                        ->orWhereHas('sale', fn ($saleQuery) =>
                            $saleQuery->where('sale_number', 'like', "%{$search}%")
                        )
                        ->orWhereHas('customer', fn ($customerQuery) =>
                            $customerQuery->where('name', 'like', "%{$search}%")
                        );
                });
            })
            ->when($filters['date_from'] ?? null, fn ($query, $date) =>
                $query->whereDate('return_date', '>=', $date)
            )
            ->when($filters['date_to'] ?? null, fn ($query, $date) =>
                $query->whereDate('return_date', '<=', $date)
            )
            ->latest('id')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function create(array $data): SaleReturn
    {
        return SaleReturn::create($data);
    }

    public function generateReturnNumber(): string
    {
        $next = (SaleReturn::max('id') ?? 0) + 1;

        return 'SRN-'.now()->format('Ymd').'-'.str_pad((string) $next, 5, '0', STR_PAD_LEFT);
    }
}

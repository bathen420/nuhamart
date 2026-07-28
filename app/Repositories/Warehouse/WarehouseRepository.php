<?php

namespace App\Repositories\Warehouse;

use App\Models\Warehouse;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class WarehouseRepository implements WarehouseRepositoryInterface
{
    public function paginate(array $filters = []): LengthAwarePaginator
    {
        $search = trim((string) ($filters['search'] ?? ''));
        $status = $filters['status'] ?? null;
        $perPage = min(max((int) ($filters['per_page'] ?? 15), 10), 100);

        return Warehouse::query()
            ->with('creator:id,name')
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($warehouseQuery) use ($search): void {
                    $warehouseQuery
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%")
                        ->orWhere('contact_person', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($status !== null && $status !== '', fn ($query) => $query->where('status', (bool) $status))
            ->orderByDesc('is_default')
            ->latest('id')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function create(array $data): Warehouse
    {
        return Warehouse::query()->create($data);
    }

    public function update(Warehouse $warehouse, array $data): Warehouse
    {
        $warehouse->update($data);

        return $warehouse->refresh();
    }

    public function delete(Warehouse $warehouse): bool
    {
        return (bool) $warehouse->delete();
    }

    public function clearDefaultExcept(?int $warehouseId = null): void
    {
        Warehouse::query()
            ->when($warehouseId !== null, fn ($query) => $query->whereKeyNot($warehouseId))
            ->where('is_default', true)
            ->update(['is_default' => false]);
    }
}

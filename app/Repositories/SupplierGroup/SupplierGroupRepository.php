<?php

namespace App\Repositories\SupplierGroup;

use App\Models\SupplierGroup;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class SupplierGroupRepository implements SupplierGroupRepositoryInterface
{
    public function paginate(array $filters = []): LengthAwarePaginator
    {
        $search = trim((string) ($filters['search'] ?? ''));
        $status = $filters['status'] ?? null;
        $perPage = min(max((int) ($filters['per_page'] ?? 15), 10), 100);

        return SupplierGroup::query()
            ->with('creator:id,name')
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($groupQuery) use ($search): void {
                    $groupQuery->where('name', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%");
                });
            })
            ->when($status !== null && $status !== '', fn ($query) => $query->where('status', (bool) $status))
            ->latest('id')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function create(array $data): SupplierGroup
    {
        return SupplierGroup::query()->create($data);
    }

    public function update(SupplierGroup $group, array $data): SupplierGroup
    {
        $group->update($data);
        return $group->refresh();
    }

    public function delete(SupplierGroup $group): bool
    {
        return (bool) $group->delete();
    }
}

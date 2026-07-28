<?php

namespace App\Repositories\CustomerGroup;

use App\Models\CustomerGroup;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CustomerGroupRepository implements CustomerGroupRepositoryInterface
{
    public function paginate(array $filters = []): LengthAwarePaginator
    {
        $search = trim((string) ($filters['search'] ?? ''));
        $status = $filters['status'] ?? null;
        $perPage = min(max((int) ($filters['per_page'] ?? 15), 10), 100);

        return CustomerGroup::query()
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

    public function create(array $data): CustomerGroup
    {
        return CustomerGroup::query()->create($data);
    }

    public function update(CustomerGroup $group, array $data): CustomerGroup
    {
        $group->update($data);
        return $group->refresh();
    }

    public function delete(CustomerGroup $group): bool
    {
        return (bool) $group->delete();
    }
}

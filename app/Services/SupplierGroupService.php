<?php

namespace App\Services;

use App\Models\SupplierGroup;
use App\Repositories\SupplierGroup\SupplierGroupRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SupplierGroupService
{
    public function __construct(protected SupplierGroupRepositoryInterface $groups) {}

    public function paginate(array $filters = []): LengthAwarePaginator
    {
        return $this->groups->paginate($filters);
    }

    public function store(array $data): SupplierGroup
    {
        return DB::transaction(function () use ($data): SupplierGroup {
            $data['status'] = (bool) ($data['status'] ?? true);
            $data['created_by'] = Auth::id();
            return $this->groups->create($data);
        });
    }

    public function update(SupplierGroup $group, array $data): SupplierGroup
    {
        $data['status'] = (bool) ($data['status'] ?? false);
        return DB::transaction(fn (): SupplierGroup => $this->groups->update($group, $data));
    }

    public function delete(SupplierGroup $group): bool
    {
        return DB::transaction(fn (): bool => $this->groups->delete($group));
    }
}

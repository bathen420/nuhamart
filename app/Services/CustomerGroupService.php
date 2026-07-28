<?php

namespace App\Services;

use App\Models\CustomerGroup;
use App\Repositories\CustomerGroup\CustomerGroupRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CustomerGroupService
{
    public function __construct(protected CustomerGroupRepositoryInterface $groups) {}

    public function paginate(array $filters = []): LengthAwarePaginator
    {
        return $this->groups->paginate($filters);
    }

    public function store(array $data): CustomerGroup
    {
        return DB::transaction(function () use ($data): CustomerGroup {
            $data['status'] = (bool) ($data['status'] ?? true);
            $data['created_by'] = Auth::id();
            return $this->groups->create($data);
        });
    }

    public function update(CustomerGroup $group, array $data): CustomerGroup
    {
        $data['status'] = (bool) ($data['status'] ?? false);
        return DB::transaction(fn (): CustomerGroup => $this->groups->update($group, $data));
    }

    public function delete(CustomerGroup $group): bool
    {
        return DB::transaction(fn (): bool => $this->groups->delete($group));
    }
}

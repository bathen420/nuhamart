<?php

namespace App\Repositories\CustomerGroup;

use App\Models\CustomerGroup;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface CustomerGroupRepositoryInterface
{
    public function paginate(array $filters = []): LengthAwarePaginator;
    public function create(array $data): CustomerGroup;
    public function update(CustomerGroup $group, array $data): CustomerGroup;
    public function delete(CustomerGroup $group): bool;
}

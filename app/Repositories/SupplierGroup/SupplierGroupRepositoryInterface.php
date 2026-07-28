<?php

namespace App\Repositories\SupplierGroup;

use App\Models\SupplierGroup;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface SupplierGroupRepositoryInterface
{
    public function paginate(array $filters = []): LengthAwarePaginator;
    public function create(array $data): SupplierGroup;
    public function update(SupplierGroup $group, array $data): SupplierGroup;
    public function delete(SupplierGroup $group): bool;
}

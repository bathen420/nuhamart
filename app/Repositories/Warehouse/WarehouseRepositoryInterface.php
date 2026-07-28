<?php

namespace App\Repositories\Warehouse;

use App\Models\Warehouse;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface WarehouseRepositoryInterface
{
    public function paginate(array $filters = []): LengthAwarePaginator;

    public function create(array $data): Warehouse;

    public function update(Warehouse $warehouse, array $data): Warehouse;

    public function delete(Warehouse $warehouse): bool;

    public function clearDefaultExcept(?int $warehouseId = null): void;
}

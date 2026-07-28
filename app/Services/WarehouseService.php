<?php

namespace App\Services;

use App\Models\Warehouse;
use App\Repositories\Warehouse\WarehouseRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class WarehouseService
{
    public function __construct(
        protected WarehouseRepositoryInterface $warehouses
    ) {
    }

    public function paginate(array $filters = []): LengthAwarePaginator
    {
        return $this->warehouses->paginate($filters);
    }

    public function store(array $data): Warehouse
    {
        return DB::transaction(function () use ($data): Warehouse {
            $data['status'] = (bool) ($data['status'] ?? true);
            $data['is_default'] = (bool) ($data['is_default'] ?? false);
            $data['created_by'] = Auth::id();

            if ($data['is_default']) {
                $this->warehouses->clearDefaultExcept();
            }

            return $this->warehouses->create($data);
        });
    }

    public function update(Warehouse $warehouse, array $data): Warehouse
    {
        return DB::transaction(function () use ($warehouse, $data): Warehouse {
            $data['status'] = (bool) ($data['status'] ?? false);
            $data['is_default'] = (bool) ($data['is_default'] ?? false);

            if ($data['is_default']) {
                $this->warehouses->clearDefaultExcept($warehouse->id);
            }

            if ($warehouse->is_default && ! $data['is_default']) {
                throw new RuntimeException('Set another warehouse as default before removing the current default.');
            }

            return $this->warehouses->update($warehouse, $data);
        });
    }

    public function delete(Warehouse $warehouse): bool
    {
        if ($warehouse->is_default) {
            throw new RuntimeException('The default warehouse cannot be deleted.');
        }

        return DB::transaction(fn (): bool => $this->warehouses->delete($warehouse));
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreWarehouseRequest;
use App\Http\Requests\Admin\UpdateWarehouseRequest;
use App\Models\Warehouse;
use App\Services\WarehouseService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;

class WarehouseController extends Controller
{
    public function __construct(
        protected WarehouseService $warehouseService
    ) {
    }

    public function index(Request $request): Response
    {
        abort_unless($request->user()->can('warehouses.view'), 403);

        return Inertia::render('Admin/Warehouses/Index', [
            'warehouses' => $this->warehouseService->paginate($request->only(['search', 'status', 'per_page'])),
            'filters' => $request->only(['search', 'status', 'per_page']),
        ]);
    }

    public function create(Request $request): Response
    {
        abort_unless($request->user()->can('warehouses.create'), 403);

        return Inertia::render('Admin/Warehouses/Create');
    }

    public function store(StoreWarehouseRequest $request): RedirectResponse
    {
        $this->warehouseService->store($request->validated());

        return redirect()->route('admin.warehouses.index')->with('success', 'Warehouse created successfully.');
    }

    public function edit(Request $request, Warehouse $warehouse): Response
    {
        abort_unless($request->user()->can('warehouses.edit'), 403);

        return Inertia::render('Admin/Warehouses/Edit', [
            'warehouse' => $warehouse,
        ]);
    }

    public function update(UpdateWarehouseRequest $request, Warehouse $warehouse): RedirectResponse
    {
        try {
            $this->warehouseService->update($warehouse, $request->validated());
        } catch (RuntimeException $exception) {
            return back()->withErrors(['is_default' => $exception->getMessage()]);
        }

        return redirect()->route('admin.warehouses.index')->with('success', 'Warehouse updated successfully.');
    }

    public function destroy(Request $request, Warehouse $warehouse): RedirectResponse
    {
        abort_unless($request->user()->can('warehouses.delete'), 403);

        try {
            $this->warehouseService->delete($warehouse);
        } catch (RuntimeException $exception) {
            return back()->with('error', $exception->getMessage());
        }

        return redirect()->route('admin.warehouses.index')->with('success', 'Warehouse deleted successfully.');
    }
}

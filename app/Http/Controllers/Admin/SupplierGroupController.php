<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSupplierGroupRequest;
use App\Http\Requests\Admin\UpdateSupplierGroupRequest;
use App\Models\SupplierGroup;
use App\Services\SupplierGroupService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SupplierGroupController extends Controller
{
    public function __construct(protected SupplierGroupService $service) {}

    public function index(Request $request): Response
    {
        abort_unless($request->user()->can('supplier-groups.view'), 403);
        return Inertia::render('Admin/SupplierGroups/Index', [
            'groups' => $this->service->paginate($request->only(['search', 'status', 'per_page'])),
            'filters' => $request->only(['search', 'status', 'per_page']),
        ]);
    }

    public function create(Request $request): Response
    {
        abort_unless($request->user()->can('supplier-groups.create'), 403);
        return Inertia::render('Admin/SupplierGroups/Create');
    }

    public function store(StoreSupplierGroupRequest $request): RedirectResponse
    {
        $this->service->store($request->validated());
        return redirect()->route('admin.supplier-groups.index')->with('success', 'Supplier group created successfully.');
    }

    public function edit(Request $request, SupplierGroup $supplierGroup): Response
    {
        abort_unless($request->user()->can('supplier-groups.edit'), 403);
        return Inertia::render('Admin/SupplierGroups/Edit', ['group' => $supplierGroup]);
    }

    public function update(UpdateSupplierGroupRequest $request, SupplierGroup $supplierGroup): RedirectResponse
    {
        $this->service->update($supplierGroup, $request->validated());
        return redirect()->route('admin.supplier-groups.index')->with('success', 'Supplier group updated successfully.');
    }

    public function destroy(Request $request, SupplierGroup $supplierGroup): RedirectResponse
    {
        abort_unless($request->user()->can('supplier-groups.delete'), 403);
        $this->service->delete($supplierGroup);
        return redirect()->route('admin.supplier-groups.index')->with('success', 'Supplier group deleted successfully.');
    }
}

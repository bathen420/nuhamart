<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCustomerGroupRequest;
use App\Http\Requests\Admin\UpdateCustomerGroupRequest;
use App\Models\CustomerGroup;
use App\Services\CustomerGroupService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerGroupController extends Controller
{
    public function __construct(protected CustomerGroupService $service) {}

    public function index(Request $request): Response
    {
        abort_unless($request->user()->can('customer-groups.view'), 403);
        return Inertia::render('Admin/CustomerGroups/Index', [
            'groups' => $this->service->paginate($request->only(['search', 'status', 'per_page'])),
            'filters' => $request->only(['search', 'status', 'per_page']),
        ]);
    }

    public function create(Request $request): Response
    {
        abort_unless($request->user()->can('customer-groups.create'), 403);
        return Inertia::render('Admin/CustomerGroups/Create');
    }

    public function store(StoreCustomerGroupRequest $request): RedirectResponse
    {
        $this->service->store($request->validated());
        return redirect()->route('admin.customer-groups.index')->with('success', 'Customer group created successfully.');
    }

    public function edit(Request $request, CustomerGroup $customerGroup): Response
    {
        abort_unless($request->user()->can('customer-groups.edit'), 403);
        return Inertia::render('Admin/CustomerGroups/Edit', ['group' => $customerGroup]);
    }

    public function update(UpdateCustomerGroupRequest $request, CustomerGroup $customerGroup): RedirectResponse
    {
        $this->service->update($customerGroup, $request->validated());
        return redirect()->route('admin.customer-groups.index')->with('success', 'Customer group updated successfully.');
    }

    public function destroy(Request $request, CustomerGroup $customerGroup): RedirectResponse
    {
        abort_unless($request->user()->can('customer-groups.delete'), 403);
        $this->service->delete($customerGroup);
        return redirect()->route('admin.customer-groups.index')->with('success', 'Customer group deleted successfully.');
    }
}

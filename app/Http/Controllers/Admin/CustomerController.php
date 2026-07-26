<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Models\Customer;
use App\Repositories\CustomerRepository;
use App\Services\CustomerService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;
use Throwable;

class CustomerController extends Controller
{
    public function __construct(
        protected CustomerRepository $customerRepository,
        protected CustomerService $customerService
    ) {
    }

    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', Rule::in(['0', '1'])],
            'per_page' => ['nullable', 'integer', 'in:10,15,25,50,100'],
        ]);

        $search = trim($validated['search'] ?? '');
        $status = $validated['status'] ?? null;
        $perPage = (int) ($validated['per_page'] ?? 15);

        $customers = $this->customerRepository->paginate(
            $search,
            $status,
            $perPage
        );

        $summary = Customer::query()
            ->selectRaw('COUNT(*) as total_customers')
            ->selectRaw('SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as active_customers')
            ->selectRaw('SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END) as inactive_customers')
            ->selectRaw('COALESCE(SUM(current_balance), 0) as total_due')
            ->first();

        return Inertia::render('Admin/Customers/Index', [
            'customers' => $customers,
            'filters' => [
                'search' => $search,
                'status' => $status ?? '',
                'per_page' => $perPage,
            ],
            'summary' => [
                'total_customers' => (int) ($summary->total_customers ?? 0),
                'active_customers' => (int) ($summary->active_customers ?? 0),
                'inactive_customers' => (int) ($summary->inactive_customers ?? 0),
                'total_due' => (float) ($summary->total_due ?? 0),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Customers/Create');
    }

    public function store(StoreCustomerRequest $request): RedirectResponse
    {
        try {
            $this->customerService->store($request->validated());

            return redirect()
                ->route('admin.customers.index')
                ->with('success', 'Customer created successfully.');
        } catch (Throwable $exception) {
            report($exception);

            return back()
                ->withInput()
                ->with('error', 'Unable to create customer. Please try again.');
        }
    }

    public function edit(Customer $customer): Response
    {
        return Inertia::render('Admin/Customers/Edit', [
            'customer' => [
                'id' => $customer->id,
                'customer_code' => $customer->customer_code,
                'name' => $customer->name,
                'phone' => $customer->phone,
                'email' => $customer->email,
                'address' => $customer->address,
                'opening_balance' => (float) $customer->opening_balance,
                'current_balance' => (float) $customer->current_balance,
                'status' => (bool) $customer->status,
                'notes' => $customer->notes,
            ],
        ]);
    }

    public function update(
        UpdateCustomerRequest $request,
        Customer $customer
    ): RedirectResponse {
        try {
            $this->customerService->update($customer, $request->validated());

            return redirect()
                ->route('admin.customers.index')
                ->with('success', 'Customer updated successfully.');
        } catch (Throwable $exception) {
            report($exception);

            return back()
                ->withInput()
                ->with('error', 'Unable to update customer. Please try again.');
        }
    }

    public function destroy(Customer $customer): RedirectResponse
    {
        try {
            $this->customerService->delete($customer);

            return redirect()
                ->route('admin.customers.index')
                ->with('success', 'Customer deleted successfully.');
        } catch (RuntimeException $exception) {
            return back()->with('error', $exception->getMessage());
        } catch (Throwable $exception) {
            report($exception);

            return back()->with(
                'error',
                'Unable to delete customer. Please try again.'
            );
        }
    }
}

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
            'segment' => ['nullable', Rule::in(['new', 'returning', 'vip', 'due'])],
            'per_page' => ['nullable', 'integer', 'in:10,15,25,50,100'],
        ]);

        $search = trim($validated['search'] ?? '');
        $status = $validated['status'] ?? null;
        $segment = $validated['segment'] ?? null;
        $perPage = (int) ($validated['per_page'] ?? 15);

        $query = Customer::query()
            ->with(['crmProfile.loyaltyTier'])
            ->withCount(['sales', 'orders'])
            ->withSum(['sales as lifetime_spend' => fn ($query) => $query->where('sale_status', 'completed')], 'total')
            ->withMax('sales as last_purchase_at', 'created_at')
            ->when($search, function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('customer_code', 'like', "%{$search}%")
                        ->orWhere('name', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($status !== null && $status !== '', fn ($query) => $query->where('status', (bool) $status))
            ->when($segment === 'new', fn ($query) => $query->where('created_at', '>=', now()->startOfMonth()))
            ->when($segment === 'returning', fn ($query) => $query->has('sales', '>=', 2))
            ->when($segment === 'vip', fn ($query) => $query->whereHas('crmProfile.loyaltyTier', fn ($tier) => $tier->whereIn('name', ['Gold', 'Platinum', 'Diamond', 'VIP'])))
            ->when($segment === 'due', fn ($query) => $query->where('current_balance', '>', 0))
            ->latest('id');

        $customers = $query->paginate($perPage)->withQueryString();

        $base = Customer::query();

        return Inertia::render('Admin/Customers/Index', [
            'customers' => $customers,
            'filters' => [
                'search' => $search,
                'status' => $status ?? '',
                'segment' => $segment ?? '',
                'per_page' => $perPage,
            ],
            'summary' => [
                'total_customers' => (clone $base)->count(),
                'active_customers' => (clone $base)->where('status', true)->count(),
                'new_this_month' => (clone $base)->where('created_at', '>=', now()->startOfMonth())->count(),
                'returning_customers' => (clone $base)->has('sales', '>=', 2)->count(),
                'total_due' => (float) (clone $base)->sum('current_balance'),
                'lifetime_revenue' => (float) \App\Models\Sale::query()
                    ->where('sale_status', 'completed')
                    ->sum('total'),
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
            $customer = $this->customerService->store($request->validated());

            return redirect()
                ->route('admin.crm.show', $customer)
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
                ->route('admin.crm.show', $customer)
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

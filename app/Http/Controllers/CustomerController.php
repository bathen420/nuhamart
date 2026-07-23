<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    /**
     * Display a listing of customers.
     */
    public function index(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));
        $status = $request->input('status', '');

        $customers = Customer::query()
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery
                        ->where('customer_code', 'like', "%{$search}%")
                        ->orWhere('name', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('address', 'like', "%{$search}%");
                });
            })
            ->when($status !== '', function ($query) use ($status) {
                $query->where('status', $status === '1');
            })
            ->latest('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Customers/Index', [
            'customers' => $customers,

            'filters' => [
                'search' => $search,
                'status' => $status,
            ],

            'summary' => [
                'total_customers' => Customer::count(),

                'active_customers' => Customer::where(
                    'status',
                    true
                )->count(),

                'inactive_customers' => Customer::where(
                    'status',
                    false
                )->count(),

                'total_due' => Customer::where(
                    'current_balance',
                    '>',
                    0
                )->sum('current_balance'),
            ],
        ]);
    }

    /**
     * Show the form for creating a customer.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Customers/Create');
    }

    /**
     * Store a newly created customer.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate(
            [
                'name' => [
                    'required',
                    'string',
                    'max:255',
                ],

                'phone' => [
                    'required',
                    'string',
                    'max:30',
                    Rule::unique('customers', 'phone'),
                ],

                'email' => [
                    'nullable',
                    'email',
                    'max:255',
                ],

                'address' => [
                    'nullable',
                    'string',
                    'max:2000',
                ],

                'opening_balance' => [
                    'nullable',
                    'numeric',
                    'min:0',
                    'max:9999999999.99',
                ],

                'status' => [
                    'nullable',
                    'boolean',
                ],

                'notes' => [
                    'nullable',
                    'string',
                    'max:5000',
                ],
            ],
            [
                'name.required' => 'Customer name is required.',
                'phone.required' => 'Phone number is required.',
                'phone.unique' => 'This phone number is already registered.',
                'email.email' => 'Please enter a valid email address.',
                'opening_balance.numeric' => 'Opening balance must be a number.',
                'opening_balance.min' => 'Opening balance cannot be negative.',
            ]
        );

        DB::transaction(function () use ($validated) {
            $openingBalance = (float) ($validated['opening_balance'] ?? 0);

            Customer::create([
                'customer_code' => $this->generateCustomerCode(),
                'name' => $validated['name'],
                'phone' => $validated['phone'],
                'email' => $validated['email'] ?? null,
                'address' => $validated['address'] ?? null,
                'opening_balance' => $openingBalance,
                'current_balance' => $openingBalance,
                'status' => $validated['status'] ?? true,
                'notes' => $validated['notes'] ?? null,
            ]);
        }, 3);

        return redirect()
            ->route('customers.index')
            ->with('success', 'Customer created successfully.');
    }

    /**
     * Display the specified customer.
     */
    public function show(Customer $customer): Response
    {
        return Inertia::render('Admin/Customers/Show', [
            'customer' => $customer,
        ]);
    }

    /**
     * Show the form for editing the customer.
     */
    public function edit(Customer $customer): Response
    {
        return Inertia::render('Admin/Customers/Edit', [
            'customer' => $customer,
        ]);
    }

    /**
     * Update the specified customer.
     */
    public function update(
        Request $request,
        Customer $customer
    ): RedirectResponse {
        $validated = $request->validate(
            [
                'name' => [
                    'required',
                    'string',
                    'max:255',
                ],

                'phone' => [
                    'required',
                    'string',
                    'max:30',
                    Rule::unique('customers', 'phone')->ignore($customer),
                ],

                'email' => [
                    'nullable',
                    'email',
                    'max:255',
                ],

                'address' => [
                    'nullable',
                    'string',
                    'max:2000',
                ],

                'opening_balance' => [
                    'nullable',
                    'numeric',
                    'min:0',
                    'max:9999999999.99',
                ],

                'status' => [
                    'nullable',
                    'boolean',
                ],

                'notes' => [
                    'nullable',
                    'string',
                    'max:5000',
                ],
            ],
            [
                'name.required' => 'Customer name is required.',
                'phone.required' => 'Phone number is required.',
                'phone.unique' => 'This phone number is already registered.',
                'email.email' => 'Please enter a valid email address.',
                'opening_balance.numeric' => 'Opening balance must be a number.',
                'opening_balance.min' => 'Opening balance cannot be negative.',
            ]
        );

        DB::transaction(function () use ($validated, $customer) {
            $oldOpeningBalance = (float) $customer->opening_balance;
            $newOpeningBalance = (float) ($validated['opening_balance'] ?? 0);

            /*
             * Opening balance পরিবর্তন হলে বর্তমান balance-এর সঙ্গে
             * শুধু পার্থক্য যোগ বা বিয়োগ হবে।
             *
             * Example:
             * Old opening balance = 100
             * Current balance = 500
             * New opening balance = 150
             * New current balance = 550
             */
            $openingBalanceDifference =
                $newOpeningBalance - $oldOpeningBalance;

            $newCurrentBalance =
                (float) $customer->current_balance +
                $openingBalanceDifference;

            $customer->update([
                'name' => $validated['name'],
                'phone' => $validated['phone'],
                'email' => $validated['email'] ?? null,
                'address' => $validated['address'] ?? null,
                'opening_balance' => $newOpeningBalance,
                'current_balance' => $newCurrentBalance,
                'status' => $validated['status'] ?? true,
                'notes' => $validated['notes'] ?? null,
            ]);
        }, 3);

        return redirect()
            ->route('customers.index')
            ->with('success', 'Customer updated successfully.');
    }

    /**
     * Remove the specified customer.
     */
    public function destroy(Customer $customer): RedirectResponse
    {
        /*
         * Customer-এর due বা advance balance থাকলে delete বন্ধ রাখা হয়েছে।
         * এতে ledger data ভুল হওয়ার ঝুঁকি কমবে।
         */
        if ((float) $customer->current_balance !== 0.0) {
            return back()->with(
                'error',
                'This customer cannot be deleted because the customer has an outstanding balance.'
            );
        }

        $customer->delete();

        return redirect()
            ->route('customers.index')
            ->with('success', 'Customer deleted successfully.');
    }

    /**
     * Generate a unique customer code.
     *
     * Example:
     * CUS-000001
     * CUS-000002
     */
    private function generateCustomerCode(): string
    {
        $lastCustomer = Customer::query()
            ->lockForUpdate()
            ->latest('id')
            ->first();

        $nextNumber = $lastCustomer
            ? $lastCustomer->id + 1
            : 1;

        $customerCode = 'CUS-' . str_pad(
            (string) $nextNumber,
            6,
            '0',
            STR_PAD_LEFT
        );

        /*
         * কোনো কারণে generated code আগে থেকেই থাকলে
         * পরবর্তী available code খুঁজবে।
         */
        while (
            Customer::where('customer_code', $customerCode)->exists()
        ) {
            $nextNumber++;

            $customerCode = 'CUS-' . str_pad(
                (string) $nextNumber,
                6,
                '0',
                STR_PAD_LEFT
            );
        }

        return $customerCode;
    }
}
<?php

namespace App\Repositories;

use App\Models\Customer;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class CustomerRepository
{
    /**
     * Get paginated customers with filters.
     */
    public function paginate(
        ?string $search = null,
        ?string $status = null,
        int $perPage = 15
    ): LengthAwarePaginator {
        return Customer::query()
            ->with('creator:id,name')
            ->when(
                $search !== null && $search !== '',
                function ($query) use ($search) {
                    $query->where(function ($customerQuery) use ($search) {
                        $customerQuery
                            ->where('customer_code', 'like', "%{$search}%")
                            ->orWhere('name', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
                }
            )
            ->when(
                $status !== null && $status !== '',
                function ($query) use ($status) {
                    $query->where('status', (int) $status);
                }
            )
            ->latest('id')
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Get active customers for dropdowns.
     */
    public function getActiveCustomers(): Collection
    {
        return Customer::query()
            ->select([
                'id',
                'customer_code',
                'name',
                'phone',
                'email',
            ])
            ->where('status', true)
            ->orderBy('name')
            ->get();
    }

    /**
     * Create customer.
     */
    public function create(array $data): Customer
    {
        return Customer::query()->create($data);
    }

    /**
     * Update customer.
     */
    public function update(
        Customer $customer,
        array $data
    ): Customer {
        $customer->update($data);

        return $customer->refresh();
    }

    /**
     * Soft-delete customer.
     */
    public function delete(Customer $customer): bool
    {
        return (bool) $customer->delete();
    }

    /**
     * Generate customer code.
     */
    public function generateCustomerCode(): string
    {
       $nextId = ((int) Customer::max('id')) + 1;

        return 'CUS-' . str_pad(
            (string) $nextId,
            5,
            '0',
            STR_PAD_LEFT
        );
    }
}
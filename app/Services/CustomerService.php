<?php

namespace App\Services;

use App\Models\Customer;
use App\Repositories\CustomerRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class CustomerService
{
    public function __construct(
        protected CustomerRepository $customerRepository
    ) {
    }

    /**
     * Create a new customer.
     */
    public function store(array $data): Customer
    {
        return DB::transaction(function () use ($data) {
            $openingBalance = (float) ($data['opening_balance'] ?? 0);

            $data['customer_code'] =
                $this->customerRepository->generateCustomerCode();

            $data['opening_balance'] = $openingBalance;
            $data['current_balance'] = $openingBalance;
            $data['status'] = $data['status'] ?? true;
            $data['created_by'] = Auth::id();

            return $this->customerRepository->create($data);
        });
    }

    /**
     * Update an existing customer.
     */
    public function update(
        Customer $customer,
        array $data
    ): Customer {
        return DB::transaction(function () use ($customer, $data) {
            $oldOpeningBalance = (float) $customer->opening_balance;
            $oldCurrentBalance = (float) $customer->current_balance;

            $newOpeningBalance = (float) (
                $data['opening_balance'] ?? $oldOpeningBalance
            );

            $openingBalanceDifference =
                $newOpeningBalance - $oldOpeningBalance;

            $data['opening_balance'] = $newOpeningBalance;

            $data['current_balance'] =
                $oldCurrentBalance + $openingBalanceDifference;

            return $this->customerRepository->update(
                $customer,
                $data
            );
        });
    }

    /**
     * Delete a customer.
     */
    public function delete(Customer $customer): bool
    {
        if ($customer->sales()->exists()) {
            throw new RuntimeException(
                'This customer cannot be deleted because sales records exist.'
            );
        }

        return DB::transaction(function () use ($customer) {
            return $this->customerRepository->delete($customer);
        });
    }
}
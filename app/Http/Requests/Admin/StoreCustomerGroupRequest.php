<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCustomerGroupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('customer-groups.create') ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('customer_groups', 'name')],
            'code' => ['required', 'string', 'max:50', 'alpha_dash', Rule::unique('customer_groups', 'code')],
            'discount_type' => ['required', 'in:percentage,fixed'],
            'discount_value' => ['required', 'numeric', 'min:0'],
            'credit_limit' => ['required', 'numeric', 'min:0'],
            'description' => ['nullable', 'string', 'max:2000'],
            'status' => ['required', 'boolean'],
        ];
    }
}

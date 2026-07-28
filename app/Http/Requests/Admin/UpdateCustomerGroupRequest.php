<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCustomerGroupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('customer-groups.edit') ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('customer_groups', 'name')->ignore($this->route('customer_group'))],
            'code' => ['required', 'string', 'max:50', 'alpha_dash', Rule::unique('customer_groups', 'code')->ignore($this->route('customer_group'))],
            'discount_type' => ['required', 'in:percentage,fixed'],
            'discount_value' => ['required', 'numeric', 'min:0'],
            'credit_limit' => ['required', 'numeric', 'min:0'],
            'description' => ['nullable', 'string', 'max:2000'],
            'status' => ['required', 'boolean'],
        ];
    }
}

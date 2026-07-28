<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSupplierGroupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('supplier-groups.edit') ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('supplier_groups', 'name')->ignore($this->route('supplier_group'))],
            'code' => ['required', 'string', 'max:50', 'alpha_dash', Rule::unique('supplier_groups', 'code')->ignore($this->route('supplier_group'))],
            'payment_terms_days' => ['required', 'integer', 'min:0', 'max:3650'],
            'description' => ['nullable', 'string', 'max:2000'],
            'status' => ['required', 'boolean'],
        ];
    }
}

<?php

namespace App\Http\Requests\Customer;

use Illuminate\Foundation\Http\FormRequest;

class StoreAddressRequest extends FormRequest
{
    public function authorize(): bool { return $this->user() !== null; }

    public function rules(): array
    {
        return [
            'label' => ['required', 'string', 'max:60'],
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'regex:/^01[3-9][0-9]{8}$/'],
            'division' => ['required', 'string', 'max:100'],
            'district' => ['required', 'string', 'max:100'],
            'area' => ['required', 'string', 'max:150'],
            'address' => ['required', 'string', 'max:1000'],
            'is_default' => ['sometimes', 'boolean'],
        ];
    }
}

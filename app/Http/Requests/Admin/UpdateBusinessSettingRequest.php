<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBusinessSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user();
    }

    public function rules(): array
    {
        return [
            'company_name' => ['required', 'string', 'max:150'],
            'company_tagline' => ['nullable', 'string', 'max:200'],
            'logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'remove_logo' => ['nullable', 'boolean'],
            'address' => ['nullable', 'string', 'max:1000'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:150'],
            'website' => ['nullable', 'url', 'max:200'],
            'currency_code' => ['required', 'string', 'max:10'],
            'currency_symbol' => ['required', 'string', 'max:10'],
            'timezone' => ['required', 'timezone'],
            'sales_prefix' => ['required', 'alpha_dash', 'max:20'],
            'purchase_prefix' => ['required', 'alpha_dash', 'max:20'],
            'sales_return_prefix' => ['required', 'alpha_dash', 'max:20'],
            'purchase_return_prefix' => ['required', 'alpha_dash', 'max:20'],
            'tax_rate' => ['required', 'numeric', 'min:0', 'max:100'],
            'default_payment_method' => ['required', 'in:Cash,Card,Bank Transfer,Mobile Banking'],
            'invoice_footer' => ['nullable', 'string', 'max:1000'],
        ];
    }
}

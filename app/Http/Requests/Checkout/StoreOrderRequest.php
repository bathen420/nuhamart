<?php

namespace App\Http\Requests\Checkout;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $enabledPayments = array_keys(collect(config('commerce.payments'))
            ->filter(fn ($method) => $method['enabled'] ?? false)
            ->all());

        return [
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'regex:/^01[3-9][0-9]{8}$/'],
            'email' => ['nullable', 'email', 'max:255'],
            'division' => ['required_unless:shipping_method,store_pickup', 'nullable', 'string', 'max:100'],
            'district' => ['required_unless:shipping_method,store_pickup', 'nullable', 'string', 'max:100'],
            'area' => ['required_unless:shipping_method,store_pickup', 'nullable', 'string', 'max:150'],
            'address' => ['required_unless:shipping_method,store_pickup', 'nullable', 'string', 'max:1000'],
            'note' => ['nullable', 'string', 'max:1000'],
            'shipping_method' => ['required', Rule::in(['standard', 'store_pickup'])],
            'payment_method' => ['required', Rule::in($enabledPayments)],
            'address_label' => ['nullable', 'string', 'max:60'],
            'save_address' => ['sometimes', 'boolean'],
            'address_is_default' => ['sometimes', 'boolean'],
            'coupon_code' => ['nullable', 'string', 'max:50'],
            'payment_reference' => [
                Rule::requiredIf(fn () => in_array($this->input('payment_method'), ['bkash', 'nagad', 'bank'], true)),
                'nullable',
                'string',
                'max:120',
            ],
            'items' => ['required', 'array', 'min:1', 'max:100'],
            'items.*.product_id' => ['required', 'integer', 'distinct', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'phone.regex' => 'Enter a valid Bangladesh mobile number (01XXXXXXXXX).',
            'payment_reference.required' => 'Transaction/reference number is required for this payment method.',
            'division.required_unless' => 'Division is required for home delivery.',
            'district.required_unless' => 'District is required for home delivery.',
            'area.required_unless' => 'Area or thana is required for home delivery.',
            'address.required_unless' => 'Full address is required for home delivery.',
            'items.required' => 'Your cart is empty.',
            'items.min' => 'Your cart is empty.',
            'items.*.product_id.distinct' => 'A product appears more than once in the cart.',
        ];
    }

    protected function prepareForValidation(): void
    {
        foreach (['name', 'phone', 'email', 'division', 'district', 'area', 'address', 'note', 'payment_reference', 'coupon_code'] as $field) {
            if (is_string($this->input($field))) {
                $this->merge([$field => trim($this->input($field))]);
            }
        }

        $this->merge([
            'shipping_method' => $this->input('shipping_method', 'standard'),
        ]);
    }
}

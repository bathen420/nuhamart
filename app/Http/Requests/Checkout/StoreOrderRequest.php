<?php

namespace App\Http\Requests\Checkout;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determine whether the user is authorised to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'phone' => [
                'required',
                'string',
                'max:20',
            ],

            'email' => [
                'nullable',
                'email',
                'max:255',
            ],

            'division' => [
                'required',
                'string',
                'max:100',
            ],

            'district' => [
                'required',
                'string',
                'max:100',
            ],

            'area' => [
                'required',
                'string',
                'max:150',
            ],

            'address' => [
                'required',
                'string',
                'max:1000',
            ],

            'note' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'payment_method' => [
                'required',
                'string',
                'in:cod,sslcommerz,bkash,nagad',
            ],

            'items' => [
                'required',
                'array',
                'min:1',
            ],

            'items.*.product_id' => [
                'required',
                'integer',
                'exists:products,id',
            ],

            'items.*.quantity' => [
                'required',
                'integer',
                'min:1',
                'max:100',
            ],
        ];
    }

    /**
     * Get custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Customer name is required.',
            'phone.required' => 'Phone number is required.',
            'email.email' => 'Please enter a valid email address.',

            'division.required' => 'Division is required.',
            'district.required' => 'District is required.',
            'area.required' => 'Area is required.',
            'address.required' => 'Delivery address is required.',

            'payment_method.required' => 'Please select a payment method.',
            'payment_method.in' => 'The selected payment method is invalid.',

            'items.required' => 'Your cart is empty.',
            'items.array' => 'Your cart data is invalid.',
            'items.min' => 'Your cart is empty.',

            'items.*.product_id.required' => 'Product ID is required.',
            'items.*.product_id.exists' => 'One of the selected products no longer exists.',

            'items.*.quantity.required' => 'Product quantity is required.',
            'items.*.quantity.integer' => 'Product quantity must be a valid number.',
            'items.*.quantity.min' => 'Product quantity must be at least 1.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => is_string($this->name)
                ? trim($this->name)
                : $this->name,

            'phone' => is_string($this->phone)
                ? trim($this->phone)
                : $this->phone,

            'email' => is_string($this->email)
                ? trim($this->email)
                : $this->email,

            'division' => is_string($this->division)
                ? trim($this->division)
                : $this->division,

            'district' => is_string($this->district)
                ? trim($this->district)
                : $this->district,

            'area' => is_string($this->area)
                ? trim($this->area)
                : $this->area,

            'address' => is_string($this->address)
                ? trim($this->address)
                : $this->address,

            'note' => is_string($this->note)
                ? trim($this->note)
                : $this->note,
        ]);
    }
}
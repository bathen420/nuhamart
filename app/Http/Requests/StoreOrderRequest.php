<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

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
                'max:100',
            ],

            'address' => [
                'required',
                'string',
                'max:1000',
            ],

            'note' => [
                'nullable',
                'string',
                'max:2000',
            ],

            'payment_method' => [
                'required',
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
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Customer name is required.',
            'phone.required' => 'Customer phone number is required.',
            'division.required' => 'Division is required.',
            'district.required' => 'District is required.',
            'area.required' => 'Area is required.',
            'address.required' => 'Full address is required.',
            'payment_method.required' => 'Please select a payment method.',
            'items.required' => 'Your cart is empty.',
            'items.min' => 'Your cart is empty.',
        ];
    }
}
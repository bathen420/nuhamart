<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSaleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation Rules
     */
    public function rules(): array
    {
        return [

            'customer_id' => [
                'nullable',
                'exists:customers,id',
            ],

            'subtotal' => [
                'required',
                'numeric',
                'min:0',
            ],

            'discount' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'tax' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'shipping' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'total' => [
                'required',
                'numeric',
                'min:0',
            ],

            'paid_amount' => [
                'required',
                'numeric',
                'min:0',
            ],

            'payment_method' => [
                'required',
                'in:Cash,Card,Mobile Banking,Bank',
            ],

            'note' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'items' => [
                'required',
                'array',
                'min:1',
            ],

            'items.*.product_id' => [
                'required',
                'exists:products,id',
            ],

            'items.*.quantity' => [
                'required',
                'integer',
                'min:1',
            ],

            'items.*.price' => [
                'required',
                'numeric',
                'min:0',
            ],

            'items.*.subtotal' => [
                'required',
                'numeric',
                'min:0',
            ],

        ];
    }

    /**
     * Validation Messages
     */
    public function messages(): array
    {
        return [

            'customer_id.exists' => 'Selected customer is invalid.',

            'items.required' => 'Please add at least one product.',

            'items.min' => 'Please add at least one product.',

            'items.*.product_id.required' => 'Product is required.',

            'items.*.product_id.exists' => 'Selected product is invalid.',

            'items.*.quantity.required' => 'Quantity is required.',

            'items.*.quantity.min' => 'Quantity must be at least 1.',

            'items.*.price.required' => 'Price is required.',

            'payment_method.required' => 'Please select a payment method.',

        ];
    }
}
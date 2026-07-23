<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePurchaseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules.
     */
    public function rules(): array
    {
        return [

            'purchase_number' => [
                'required',
                'string',
                'max:100',
                'unique:purchases,purchase_number',
            ],

            'supplier_id' => [
                'required',
                'exists:suppliers,id',
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

            'note' => [
                'nullable',
                'string',
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
     * Custom messages.
     */
    public function messages(): array
    {
        return [

            'supplier_id.required' => 'Please select a supplier.',

            'items.required' => 'Please add at least one product.',

            'items.*.product_id.required' => 'Please select a product.',

            'items.*.quantity.required' => 'Quantity is required.',

            'items.*.price.required' => 'Price is required.',

        ];
    }
}
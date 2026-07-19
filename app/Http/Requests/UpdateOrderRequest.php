<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOrderRequest extends FormRequest
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

            'order_number' => [
                'required',
                'string',
                'max:100',
                Rule::unique('orders', 'order_number')->ignore($this->order),
            ],

            'customer_name' => [
                'required',
                'string',
                'max:255',
            ],

            'customer_phone' => [
                'required',
                'string',
                'max:30',
            ],

            'customer_email' => [
                'nullable',
                'email',
                'max:255',
            ],

            'customer_address' => [
                'required',
                'string',
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

            'subtotal' => [
                'required',
                'numeric',
                'min:0',
            ],

            'total' => [
                'required',
                'numeric',
                'min:0',
            ],

            'payment_method' => [
                'required',
                'string',
            ],

            'payment_status' => [
                'required',
                'in:Pending,Paid,Failed',
            ],

            'order_status' => [
                'required',
                'in:Pending,Processing,Shipped,Delivered,Cancelled',
            ],

            'note' => [
                'nullable',
                'string',
            ],

            /*
            |--------------------------------------------------------------------------
            | Order Items
            |--------------------------------------------------------------------------
            */

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
     * Custom Messages
     */
    public function messages(): array
    {
        return [

            'order_number.required' => 'Order Number is required.',

            'customer_name.required' => 'Customer Name is required.',

            'customer_phone.required' => 'Customer Phone is required.',

            'customer_address.required' => 'Customer Address is required.',

            'items.required' => 'Please add at least one product.',

            'items.*.product_id.required' => 'Please select a product.',

            'items.*.quantity.required' => 'Quantity is required.',

            'items.*.quantity.min' => 'Quantity must be at least 1.',

        ];
    }
}
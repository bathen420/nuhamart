<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [

            'order_number' => [
                'required',
                'string',
                'max:255',
                Rule::unique('orders', 'order_number')->ignore($this->order),
            ],

            'customer_name' => 'required|string|max:255',

            'customer_phone' => 'required|string|max:30',

            'customer_email' => 'nullable|email|max:255',

            'customer_address' => 'required|string',

            'subtotal' => 'required|numeric|min:0',

            'discount' => 'nullable|numeric|min:0',

            'shipping' => 'nullable|numeric|min:0',

            'total' => 'required|numeric|min:0',

            'payment_method' => 'required|string|max:255',

            'payment_status' => 'required|in:Pending,Paid,Failed',

            'order_status' => 'required|in:Pending,Processing,Shipped,Delivered,Cancelled',

            'note' => 'nullable|string',

            'items' => 'required|array|min:1',

            'items.*.product_id' => 'required|exists:products,id',

            'items.*.quantity' => 'required|integer|min:1',

            'items.*.price' => 'required|numeric|min:0',

            'items.*.subtotal' => 'required|numeric|min:0',

        ];
    }

    /**
     * Custom validation messages.
     */
    public function messages(): array
    {
        return [

            'items.required' => 'Please add at least one product.',

            'items.*.product_id.required' => 'Please select a product.',

            'items.*.quantity.required' => 'Quantity is required.',

            'items.*.quantity.min' => 'Quantity must be at least 1.',

        ];
    }
}
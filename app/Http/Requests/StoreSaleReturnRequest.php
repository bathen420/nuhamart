<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSaleReturnRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'return_date' => ['required', 'date'],
            'refund_method' => [
                'required',
                'string',
                Rule::in(['cash', 'card', 'mobile_banking', 'bank_transfer', 'customer_due']),
            ],
            'reason' => ['nullable', 'string', 'max:2000'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.sale_item_id' => ['required', 'integer', 'exists:sale_items,id', 'distinct'],
            'items.*.quantity' => ['required', 'integer', 'min:0'],
        ];
    }
}

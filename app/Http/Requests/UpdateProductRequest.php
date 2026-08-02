<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name_bn' => ['nullable', 'string', 'max:255'],
            'short_description_bn' => ['nullable','string'],
            'description_bn' => ['nullable','string'],

            'category_id' => ['required', 'exists:categories,id'],
            'author_id' => ['nullable', 'exists:authors,id'],
            'publisher_id' => ['nullable', 'exists:publishers,id'],

            'brand_id' => ['required', 'exists:brands,id'],
            'name' => ['required', 'string', 'max:255'],

            'sku' => [
                'required',
                'string',
                'max:255',
                Rule::unique('products', 'sku')->ignore($this->product),
            ],

            'barcode' => [
                'nullable',
                'string',
                'max:100',
                Rule::unique('products', 'barcode')->ignore($this->product),
            ],

            'barcode_type' => ['nullable', 'in:code128,ean13'],

            'product_type' => ['required', 'in:physical,ebook,both'],
            'isbn' => ['nullable', 'string', 'max:32', Rule::unique('products', 'isbn')->ignore($this->product)],
            'edition' => ['nullable', 'string', 'max:100'],
            'language' => ['nullable', 'string', 'max:60'],
            'pages' => ['nullable', 'integer', 'min:1'],
            'publication_year' => ['nullable', 'integer', 'min:1000', 'max:2100'],
            'binding' => ['nullable', 'string', 'max:60'],
            'weight' => ['nullable', 'numeric', 'min:0'],
            'dimensions' => ['nullable', 'string', 'max:100'],
            'ebook_price' => ['nullable', 'numeric', 'min:0'],
            'is_featured' => ['required', 'boolean'],
            'is_new_arrival' => ['required', 'boolean'],
            'is_best_seller' => ['required', 'boolean'],

            'image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],

            'price' => ['required', 'numeric', 'min:0'],
            'discount_price' => ['nullable', 'numeric', 'min:0'],
            'stock_quantity' => ['required', 'integer', 'min:0'],
            'short_description' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'boolean'],
            'sort_order' => ['nullable', 'integer'],
        ];
    }
}
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
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
            'name_bn' => ['nullable', 'string', 'max:255'],
            'short_description_bn' => ['nullable','string'],
            'description_bn' => ['nullable','string'],

            'category_id' => [
                'required',
                'exists:categories,id',
            ],

            'author_id' => ['nullable', 'exists:authors,id'],
            'publisher_id' => ['nullable', 'exists:publishers,id'],

            'brand_id' => [
                'required',
                'exists:brands,id',
            ],

            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'sku' => [
                'required',
                'string',
                'max:255',
                'unique:products,sku',
            ],

            'barcode' => [
                'nullable',
                'string',
                'max:100',
                'unique:products,barcode',
            ],

            'barcode_type' => [
                'nullable',
                'in:code128,ean13',
            ],

            'product_type' => ['required', 'in:physical,ebook,both'],
            'isbn' => ['nullable', 'string', 'max:32', 'unique:products,isbn'],
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

            'gallery_images' => ['nullable', 'array', 'max:6'],
            'gallery_images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'sample_file' => ['nullable', 'file', 'mimes:pdf', 'max:10240'],
            'image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
                ],

            'price' => [
                'required',
                'numeric',
                'min:0',
            ],

            'discount_price' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'stock_quantity' => [
                'required',
                'integer',
                'min:0',
            ],

            'short_description' => [
                'nullable',
                'string',
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'status' => [
                'required',
                'boolean',
            ],

            'sort_order' => [
                'nullable',
                'integer',
            ],
        ];
    }

    
}
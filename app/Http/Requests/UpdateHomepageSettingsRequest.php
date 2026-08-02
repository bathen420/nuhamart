<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHomepageSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $sectionKeys = 'hero,categories,flash_sale,featured,best_sellers,new_arrivals,ebooks,authors_publishers,trust';

        return [
            'preset' => ['required', 'in:book_store,general_store,campaign,education'],
            'announcement_enabled' => ['nullable', 'boolean'],
            'announcement_text' => ['nullable', 'string', 'max:220'],
            'announcement_text_bn' => ['nullable', 'string', 'max:220'],
            'announcement_url' => ['nullable', 'string', 'max:255'],
            'cache_minutes' => ['required', 'integer', 'min:1', 'max:1440'],
            'sections' => ['required', 'array'],
            'sections.*.key' => ['required', "in:{$sectionKeys}"],
            'sections.*.enabled' => ['nullable', 'boolean'],
            'sections.*.order' => ['required', 'integer', 'min:1', 'max:999'],
        ];
    }
}

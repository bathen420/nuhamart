<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreHomepagePromotionRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'title_bn' => ['nullable','string','max:400'],
            'subtitle_bn' => ['nullable','string','max:400'],
            'button_text_bn' => ['nullable','string','max:400'],

            'title' => ['required','string','max:150'],
            'subtitle' => ['nullable','string','max:400'],
            'button_text' => ['nullable','string','max:50'],
            'button_url' => ['nullable','string','max:255'],
            'image' => ['nullable','image','max:3072'],
            'theme' => ['required','in:mint,purple,orange,blue'],
            'sort_order' => ['nullable','integer','min:0','max:9999'],
            'is_active' => ['nullable','boolean'],
        ];
    }
}

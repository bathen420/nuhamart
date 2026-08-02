<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreHomepageBannerRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'badge_bn' => ['nullable','string','max:500'],
            'title_bn' => ['nullable','string','max:500'],
            'highlight_bn' => ['nullable','string','max:500'],
            'subtitle_bn' => ['nullable','string','max:500'],
            'primary_button_text_bn' => ['nullable','string','max:500'],
            'secondary_button_text_bn' => ['nullable','string','max:500'],

            'badge' => ['nullable','string','max:80'],
            'title' => ['required','string','max:180'],
            'highlight' => ['nullable','string','max:120'],
            'subtitle' => ['nullable','string','max:500'],
            'primary_button_text' => ['nullable','string','max:50'],
            'primary_button_url' => ['nullable','string','max:255'],
            'secondary_button_text' => ['nullable','string','max:50'],
            'secondary_button_url' => ['nullable','string','max:255'],
            'image' => ['nullable','image','max:4096'],
            'mobile_image' => ['nullable','image','max:3072'],
            'background_from' => ['nullable','regex:/^#[0-9A-Fa-f]{6}$/'],
            'background_to' => ['nullable','regex:/^#[0-9A-Fa-f]{6}$/'],
            'text_color' => ['nullable','regex:/^#[0-9A-Fa-f]{6}$/'],
            'sort_order' => ['nullable','integer','min:0','max:9999'],
            'is_active' => ['nullable','boolean'],
            'starts_at' => ['nullable','date'],
            'ends_at' => ['nullable','date','after_or_equal:starts_at'],
        ];
    }
}

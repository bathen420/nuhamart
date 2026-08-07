<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBusinessSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('settings.edit') ?? false;
    }

    public function rules(): array
    {
        $image = ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,ico', 'max:4096'];

        return [
            'company_name' => ['required', 'string', 'max:150'],
            'short_name' => ['nullable', 'string', 'max:80'],
            'company_tagline' => ['nullable', 'string', 'max:200'],
            'logo' => $image,
            'dark_logo' => $image,
            'white_logo' => $image,
            'footer_logo' => $image,
            'mobile_logo' => $image,
            'admin_logo' => $image,
            'login_logo' => $image,
            'invoice_logo' => $image,
            'pos_logo' => $image,
            'email_logo' => $image,
            'favicon' => $image,
            'og_image' => $image,
            'remove_logo' => ['nullable', 'boolean'],
            'remove_dark_logo' => ['nullable', 'boolean'],
            'remove_white_logo' => ['nullable', 'boolean'],
            'remove_footer_logo' => ['nullable', 'boolean'],
            'remove_mobile_logo' => ['nullable', 'boolean'],
            'remove_admin_logo' => ['nullable', 'boolean'],
            'remove_login_logo' => ['nullable', 'boolean'],
            'remove_invoice_logo' => ['nullable', 'boolean'],
            'remove_pos_logo' => ['nullable', 'boolean'],
            'remove_email_logo' => ['nullable', 'boolean'],
            'remove_favicon' => ['nullable', 'boolean'],
            'remove_og_image' => ['nullable', 'boolean'],

            'address' => ['nullable', 'string', 'max:1000'],
            'google_map_embed' => ['nullable', 'string', 'max:5000'],
            'phone' => ['nullable', 'string', 'max:50'],
            'hotline' => ['nullable', 'string', 'max:50'],
            'whatsapp' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:150'],
            'support_email' => ['nullable', 'email', 'max:150'],
            'reply_to_email' => ['nullable', 'email', 'max:150'],
            'support_hours' => ['nullable', 'string', 'max:150'],
            'website' => ['nullable', 'url', 'max:200'],

            'facebook_url' => ['nullable', 'url', 'max:255'],
            'instagram_url' => ['nullable', 'url', 'max:255'],
            'youtube_url' => ['nullable', 'url', 'max:255'],
            'linkedin_url' => ['nullable', 'url', 'max:255'],
            'twitter_url' => ['nullable', 'url', 'max:255'],
            'tiktok_url' => ['nullable', 'url', 'max:255'],
            'telegram_url' => ['nullable', 'url', 'max:255'],
            'messenger_url' => ['nullable', 'url', 'max:255'],

            'seo_title' => ['nullable', 'string', 'max:160'],
            'seo_description' => ['nullable', 'string', 'max:255'],
            'seo_keywords' => ['nullable', 'string', 'max:1000'],
            'google_verification' => ['nullable', 'string', 'max:255'],
            'bing_verification' => ['nullable', 'string', 'max:255'],
            'twitter_card' => ['nullable', 'in:summary,summary_large_image'],

            'footer_description' => ['nullable', 'string', 'max:2000'],
            'copyright_text' => ['nullable', 'string', 'max:255'],
            'invoice_footer' => ['nullable', 'string', 'max:1000'],
            'receipt_footer' => ['nullable', 'string', 'max:1000'],
            'email_footer' => ['nullable', 'string', 'max:2000'],

            'currency_code' => ['required', 'string', 'max:10'],
            'currency_symbol' => ['required', 'string', 'max:10'],
            'timezone' => ['required', 'timezone'],
            'sales_prefix' => ['required', 'alpha_dash', 'max:20'],
            'purchase_prefix' => ['required', 'alpha_dash', 'max:20'],
            'sales_return_prefix' => ['required', 'alpha_dash', 'max:20'],
            'purchase_return_prefix' => ['required', 'alpha_dash', 'max:20'],
            'tax_rate' => ['required', 'numeric', 'min:0', 'max:100'],
            'tax_enabled' => ['nullable', 'boolean'],
            'shipping_dhaka' => ['required', 'numeric', 'min:0'],
            'shipping_outside_dhaka' => ['required', 'numeric', 'min:0'],
            'free_shipping_threshold' => ['nullable', 'numeric', 'min:0'],
            'default_payment_method' => ['required', 'in:Cash,Card,Bank Transfer,Mobile Banking'],
            'cod_enabled' => ['nullable', 'boolean'],
            'bkash_enabled' => ['nullable', 'boolean'],
            'nagad_enabled' => ['nullable', 'boolean'],
            'bank_enabled' => ['nullable', 'boolean'],
            'sslcommerz_enabled' => ['nullable', 'boolean'],
            'store_pickup_enabled' => ['nullable', 'boolean'],
            'bkash_number' => ['nullable', 'string', 'max:30'],
            'nagad_number' => ['nullable', 'string', 'max:30'],
            'bank_payment_instructions' => ['nullable', 'string', 'max:2000'],
            'steadfast_enabled' => ['nullable', 'boolean'],
            'default_courier' => ['required', 'in:steadfast'],
            'courier_sync_minutes' => ['required', 'integer', 'min:5', 'max:1440'],
        ];
    }
}

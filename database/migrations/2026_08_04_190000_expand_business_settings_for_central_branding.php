<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('business_settings', function (Blueprint $table) {
            $columns = [
                'short_name' => fn () => $table->string('short_name', 80)->nullable()->after('company_name'),
                'white_logo' => fn () => $table->string('white_logo')->nullable()->after('logo'),
                'footer_logo' => fn () => $table->string('footer_logo')->nullable()->after('white_logo'),
                'favicon' => fn () => $table->string('favicon')->nullable()->after('footer_logo'),
                'og_image' => fn () => $table->string('og_image')->nullable()->after('favicon'),
                'hotline' => fn () => $table->string('hotline', 50)->nullable()->after('phone'),
                'whatsapp' => fn () => $table->string('whatsapp', 50)->nullable()->after('hotline'),
                'support_email' => fn () => $table->string('support_email', 150)->nullable()->after('email'),
                'support_hours' => fn () => $table->string('support_hours', 150)->nullable()->after('support_email'),
                'instagram_url' => fn () => $table->string('instagram_url')->nullable()->after('facebook_url'),
                'linkedin_url' => fn () => $table->string('linkedin_url')->nullable()->after('instagram_url'),
                'tiktok_url' => fn () => $table->string('tiktok_url')->nullable()->after('linkedin_url'),
                'telegram_url' => fn () => $table->string('telegram_url')->nullable()->after('tiktok_url'),
                'messenger_url' => fn () => $table->string('messenger_url')->nullable()->after('telegram_url'),
                'google_map_embed' => fn () => $table->text('google_map_embed')->nullable()->after('address'),
                'seo_title' => fn () => $table->string('seo_title', 160)->nullable()->after('company_tagline'),
                'seo_description' => fn () => $table->string('seo_description', 255)->nullable()->after('seo_title'),
                'seo_keywords' => fn () => $table->text('seo_keywords')->nullable()->after('seo_description'),
                'google_verification' => fn () => $table->string('google_verification')->nullable()->after('seo_keywords'),
                'bing_verification' => fn () => $table->string('bing_verification')->nullable()->after('google_verification'),
                'footer_description' => fn () => $table->text('footer_description')->nullable()->after('invoice_footer'),
                'copyright_text' => fn () => $table->string('copyright_text', 255)->nullable()->after('footer_description'),
                'cod_enabled' => fn () => $table->boolean('cod_enabled')->default(true)->after('default_payment_method'),
                'bkash_enabled' => fn () => $table->boolean('bkash_enabled')->default(false)->after('bkash_number'),
                'nagad_enabled' => fn () => $table->boolean('nagad_enabled')->default(false)->after('nagad_number'),
                'bank_enabled' => fn () => $table->boolean('bank_enabled')->default(false)->after('bank_payment_instructions'),
                'sslcommerz_enabled' => fn () => $table->boolean('sslcommerz_enabled')->default(false)->after('bank_enabled'),
                'store_pickup_enabled' => fn () => $table->boolean('store_pickup_enabled')->default(true)->after('sslcommerz_enabled'),
                'tax_enabled' => fn () => $table->boolean('tax_enabled')->default(false)->after('tax_rate'),
            ];

            foreach ($columns as $name => $definition) {
                if (! Schema::hasColumn('business_settings', $name)) {
                    $definition();
                }
            }
        });
    }

    public function down(): void
    {
        $columns = [
            'short_name', 'white_logo', 'footer_logo', 'favicon', 'og_image',
            'hotline', 'whatsapp', 'support_email', 'support_hours',
            'instagram_url', 'linkedin_url', 'tiktok_url', 'telegram_url', 'messenger_url',
            'google_map_embed', 'seo_title', 'seo_description', 'seo_keywords',
            'google_verification', 'bing_verification', 'footer_description',
            'copyright_text', 'cod_enabled', 'bkash_enabled', 'nagad_enabled',
            'bank_enabled', 'sslcommerz_enabled', 'store_pickup_enabled', 'tax_enabled',
        ];

        $existing = array_values(array_filter(
            $columns,
            fn (string $column) => Schema::hasColumn('business_settings', $column)
        ));

        if ($existing !== []) {
            Schema::table('business_settings', fn (Blueprint $table) => $table->dropColumn($existing));
        }
    }
};

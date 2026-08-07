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
                'dark_logo' => fn () => $table->string('dark_logo')->nullable()->after('logo'),
                'mobile_logo' => fn () => $table->string('mobile_logo')->nullable()->after('footer_logo'),
                'admin_logo' => fn () => $table->string('admin_logo')->nullable()->after('mobile_logo'),
                'login_logo' => fn () => $table->string('login_logo')->nullable()->after('admin_logo'),
                'invoice_logo' => fn () => $table->string('invoice_logo')->nullable()->after('login_logo'),
                'pos_logo' => fn () => $table->string('pos_logo')->nullable()->after('invoice_logo'),
                'email_logo' => fn () => $table->string('email_logo')->nullable()->after('pos_logo'),
                'twitter_url' => fn () => $table->string('twitter_url')->nullable()->after('linkedin_url'),
                'twitter_card' => fn () => $table->string('twitter_card', 30)->default('summary_large_image')->after('bing_verification'),
                'reply_to_email' => fn () => $table->string('reply_to_email', 150)->nullable()->after('support_email'),
                'email_footer' => fn () => $table->text('email_footer')->nullable()->after('invoice_footer'),
                'receipt_footer' => fn () => $table->text('receipt_footer')->nullable()->after('email_footer'),
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
            'dark_logo', 'mobile_logo', 'admin_logo', 'login_logo',
            'invoice_logo', 'pos_logo', 'email_logo', 'twitter_url',
            'twitter_card', 'reply_to_email', 'email_footer', 'receipt_footer',
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

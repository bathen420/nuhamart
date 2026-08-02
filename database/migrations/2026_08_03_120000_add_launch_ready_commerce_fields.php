<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (! Schema::hasColumn('orders', 'courier_name')) {
                $table->string('courier_name', 80)->nullable()->after('shipping_method');
            }
            if (! Schema::hasColumn('orders', 'tracking_number')) {
                $table->string('tracking_number', 120)->nullable()->index()->after('courier_name');
            }
            if (! Schema::hasColumn('orders', 'admin_note')) {
                $table->text('admin_note')->nullable()->after('note');
            }
        });

        Schema::table('business_settings', function (Blueprint $table) {
            if (! Schema::hasColumn('business_settings', 'shipping_dhaka')) {
                $table->decimal('shipping_dhaka', 10, 2)->default(60)->after('tax_rate');
            }
            if (! Schema::hasColumn('business_settings', 'shipping_outside_dhaka')) {
                $table->decimal('shipping_outside_dhaka', 10, 2)->default(120)->after('shipping_dhaka');
            }
            if (! Schema::hasColumn('business_settings', 'free_shipping_threshold')) {
                $table->decimal('free_shipping_threshold', 12, 2)->nullable()->after('shipping_outside_dhaka');
            }
            if (! Schema::hasColumn('business_settings', 'bkash_number')) {
                $table->string('bkash_number', 30)->nullable()->after('default_payment_method');
            }
            if (! Schema::hasColumn('business_settings', 'nagad_number')) {
                $table->string('nagad_number', 30)->nullable()->after('bkash_number');
            }
            if (! Schema::hasColumn('business_settings', 'bank_payment_instructions')) {
                $table->text('bank_payment_instructions')->nullable()->after('nagad_number');
            }
            if (! Schema::hasColumn('business_settings', 'facebook_url')) {
                $table->string('facebook_url')->nullable()->after('website');
            }
            if (! Schema::hasColumn('business_settings', 'youtube_url')) {
                $table->string('youtube_url')->nullable()->after('facebook_url');
            }
        });

        Schema::table('products', function (Blueprint $table) {
            if (! Schema::hasColumn('products', 'seo_title')) {
                $table->string('seo_title', 160)->nullable()->after('description');
            }
            if (! Schema::hasColumn('products', 'seo_description')) {
                $table->string('seo_description', 255)->nullable()->after('seo_title');
            }
        });
    }

    public function down(): void
    {
        Schema::table('orders', fn (Blueprint $table) => $table->dropColumn(['courier_name', 'tracking_number', 'admin_note']));
        Schema::table('business_settings', fn (Blueprint $table) => $table->dropColumn([
            'shipping_dhaka', 'shipping_outside_dhaka', 'free_shipping_threshold',
            'bkash_number', 'nagad_number', 'bank_payment_instructions', 'facebook_url', 'youtube_url',
        ]));
        Schema::table('products', fn (Blueprint $table) => $table->dropColumn(['seo_title', 'seo_description']));
    }
};

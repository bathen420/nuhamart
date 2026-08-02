<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('homepage_banners', function (Blueprint $table) {
            $table->string('mobile_image')->nullable()->after('image');
            $table->timestamp('starts_at')->nullable()->after('is_active')->index();
            $table->timestamp('ends_at')->nullable()->after('starts_at')->index();
        });

        Schema::table('homepage_promotions', function (Blueprint $table) {
            $table->timestamp('starts_at')->nullable()->after('is_active')->index();
            $table->timestamp('ends_at')->nullable()->after('starts_at')->index();
        });

        Schema::create('homepage_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->json('value')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('homepage_settings');

        Schema::table('homepage_promotions', function (Blueprint $table) {
            $table->dropIndex(['starts_at']);
            $table->dropIndex(['ends_at']);
            $table->dropColumn(['starts_at', 'ends_at']);
        });

        Schema::table('homepage_banners', function (Blueprint $table) {
            $table->dropIndex(['starts_at']);
            $table->dropIndex(['ends_at']);
            $table->dropColumn(['mobile_image', 'starts_at', 'ends_at']);
        });
    }
};

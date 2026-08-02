<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('name_bn')->nullable()->after('name');
            $table->text('short_description_bn')->nullable()->after('short_description');
            $table->longText('description_bn')->nullable()->after('description');
        });
        Schema::table('categories', function (Blueprint $table) {
            $table->string('name_bn')->nullable()->after('name');
            $table->text('description_bn')->nullable()->after('description');
        });
        Schema::table('authors', function (Blueprint $table) {
            $table->string('name_bn')->nullable()->after('name');
            $table->text('biography_bn')->nullable()->after('biography');
        });
        Schema::table('publishers', function (Blueprint $table) {
            $table->string('name_bn')->nullable()->after('name');
            $table->text('description_bn')->nullable()->after('description');
        });
        Schema::table('homepage_banners', function (Blueprint $table) {
            foreach (['badge','title','highlight','subtitle','primary_button_text','secondary_button_text'] as $column) {
                $table->text($column.'_bn')->nullable()->after($column);
            }
        });
        Schema::table('homepage_promotions', function (Blueprint $table) {
            foreach (['title','subtitle','button_text'] as $column) {
                $table->text($column.'_bn')->nullable()->after($column);
            }
        });
    }

    public function down(): void
    {
        Schema::table('homepage_promotions', fn (Blueprint $table) => $table->dropColumn(['title_bn','subtitle_bn','button_text_bn']));
        Schema::table('homepage_banners', fn (Blueprint $table) => $table->dropColumn(['badge_bn','title_bn','highlight_bn','subtitle_bn','primary_button_text_bn','secondary_button_text_bn']));
        Schema::table('publishers', fn (Blueprint $table) => $table->dropColumn(['name_bn','description_bn']));
        Schema::table('authors', fn (Blueprint $table) => $table->dropColumn(['name_bn','biography_bn']));
        Schema::table('categories', fn (Blueprint $table) => $table->dropColumn(['name_bn','description_bn']));
        Schema::table('products', fn (Blueprint $table) => $table->dropColumn(['name_bn','short_description_bn','description_bn']));
    }
};

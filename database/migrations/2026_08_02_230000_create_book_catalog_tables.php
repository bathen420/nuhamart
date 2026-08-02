<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('authors', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('biography')->nullable();
            $table->string('photo')->nullable();
            $table->boolean('status')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('publishers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('logo')->nullable();
            $table->boolean('status')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('author_id')->nullable()->after('brand_id')->constrained()->nullOnDelete();
            $table->foreignId('publisher_id')->nullable()->after('author_id')->constrained()->nullOnDelete();
            $table->string('product_type', 30)->default('physical')->after('barcode_type');
            $table->string('isbn', 32)->nullable()->unique()->after('product_type');
            $table->string('edition', 100)->nullable()->after('isbn');
            $table->string('language', 60)->nullable()->after('edition');
            $table->unsignedInteger('pages')->nullable()->after('language');
            $table->unsignedSmallInteger('publication_year')->nullable()->after('pages');
            $table->string('binding', 60)->nullable()->after('publication_year');
            $table->decimal('weight', 10, 3)->nullable()->after('binding');
            $table->string('dimensions', 100)->nullable()->after('weight');
            $table->decimal('ebook_price', 10, 2)->nullable()->after('discount_price');
            $table->boolean('is_featured')->default(false)->after('status');
            $table->boolean('is_new_arrival')->default(false)->after('is_featured');
            $table->boolean('is_best_seller')->default(false)->after('is_new_arrival');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['author_id']);
            $table->dropForeign(['publisher_id']);
            $table->dropUnique(['isbn']);
            $table->dropColumn([
                'author_id', 'publisher_id', 'product_type', 'isbn', 'edition',
                'language', 'pages', 'publication_year', 'binding', 'weight',
                'dimensions', 'ebook_price', 'is_featured', 'is_new_arrival',
                'is_best_seller',
            ]);
        });

        Schema::dropIfExists('publishers');
        Schema::dropIfExists('authors');
    }
};

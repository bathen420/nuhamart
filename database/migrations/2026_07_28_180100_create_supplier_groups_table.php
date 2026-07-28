<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('supplier_groups', function (Blueprint $table): void {
            $table->id();
            $table->string('name')->unique();
            $table->string('code', 50)->unique();
            $table->unsignedInteger('payment_terms_days')->default(0);
            $table->text('description')->nullable();
            $table->boolean('status')->default(true)->index();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('supplier_groups');
    }
};

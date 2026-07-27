<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sale_returns', function (Blueprint $table) {
            $table->id();
            $table->string('return_number')->unique();
            $table->foreignId('sale_id')->constrained('sales')->restrictOnDelete();
            $table->foreignId('customer_id')->nullable()->constrained('customers')->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->date('return_date');
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->decimal('refund_amount', 12, 2)->default(0);
            $table->string('refund_method', 40)->default('cash');
            $table->string('status', 30)->default('completed');
            $table->text('reason')->nullable();
            $table->timestamps();

            $table->index(['sale_id', 'return_date']);
            $table->index('return_number');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sale_returns');
    }
};

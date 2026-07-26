<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sales', function (Blueprint $table) {

            $table->id();

            $table->string('sale_number')->unique();

            $table->foreignId('customer_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->foreignId('user_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->decimal('subtotal', 12, 2);

            $table->decimal('discount', 12, 2)
                ->default(0);

            $table->decimal('tax', 12, 2)
                ->default(0);

            $table->decimal('shipping', 12, 2)
                ->default(0);

            $table->decimal('total', 12, 2);

            $table->decimal('paid_amount', 12, 2)
                ->default(0);

            $table->decimal('due_amount', 12, 2)
                ->default(0);

            $table->enum('payment_method', [
                'Cash',
                'Card',
                'Mobile Banking',
                'Bank'
            ])->default('Cash');

            $table->enum('payment_status', [
                'Paid',
                'Partial',
                'Due'
            ])->default('Paid');

            $table->enum('sale_status', [
                'Completed',
                'Pending',
                'Cancelled'
            ])->default('Completed');

            $table->text('note')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
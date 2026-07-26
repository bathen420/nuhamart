<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {

            $table->id();

            $table->string('order_no')->unique();

            $table->foreignId('customer_id')->nullable()->constrained()->nullOnDelete();

            $table->string('customer_name');
            $table->string('customer_phone', 20);
            $table->string('customer_email')->nullable();

            $table->string('division');
            $table->string('district');
            $table->string('area');

            $table->text('address');

            $table->text('note')->nullable();

            $table->decimal('subtotal', 12, 2)->default(0);
            $table->decimal('shipping_charge', 12, 2)->default(0);
            $table->decimal('discount', 12, 2)->default(0);
            $table->decimal('total', 12, 2);

            $table->enum('payment_method', [
                'cod',
                'sslcommerz',
                'bkash',
                'nagad',
            ]);

            $table->enum('payment_status', [
                'pending',
                'paid',
                'failed',
            ])->default('pending');

            $table->enum('status', [
                'pending',
                'confirmed',
                'processing',
                'shipped',
                'delivered',
                'cancelled',
            ])->default('pending');

            $table->timestamp('ordered_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
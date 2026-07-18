<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {

            $table->id();

            $table->string('order_number')->unique();

            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();

            $table->string('customer_name');
            $table->string('customer_phone');
            $table->string('customer_email')->nullable();
            $table->text('customer_address');

            $table->decimal('subtotal',10,2)->default(0);
            $table->decimal('discount',10,2)->default(0);
            $table->decimal('shipping',10,2)->default(0);
            $table->decimal('total',10,2)->default(0);

            $table->string('payment_method')->default('Cash On Delivery');

            $table->enum('payment_status',[
                'Pending',
                'Paid',
                'Failed'
            ])->default('Pending');

            $table->enum('order_status',[
                'Pending',
                'Processing',
                'Shipped',
                'Delivered',
                'Cancelled'
            ])->default('Pending');

            $table->text('note')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
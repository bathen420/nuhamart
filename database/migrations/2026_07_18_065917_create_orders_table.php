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

            $table->string('customer_name');
            $table->string('customer_phone');
            $table->string('customer_email')->nullable();

            $table->text('customer_address');

            $table->decimal('subtotal', 10, 2)->default(0);
            $table->decimal('discount', 10, 2)->default(0);
            $table->decimal('shipping_charge', 10, 2)->default(0);
            $table->decimal('grand_total', 10, 2);

            $table->string('payment_method')->default('Cash on Delivery');

            $table->enum('payment_status', [
                'Pending',
                'Paid',
                'Failed'
            ])->default('Pending');

            $table->enum('order_status', [
                'Pending',
                'Processing',
                'Shipped',
                'Delivered',
                'Cancelled'
            ])->default('Pending');

            $table->text('notes')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('business_settings', function (Blueprint $table) {
            $table->id();
            $table->string('company_name')->default('Nuha Mart BD');
            $table->string('company_tagline')->nullable();
            $table->string('logo')->nullable();
            $table->text('address')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            $table->string('currency_code', 10)->default('BDT');
            $table->string('currency_symbol', 10)->default('৳');
            $table->string('timezone')->default('Asia/Dhaka');
            $table->string('sales_prefix', 20)->default('INV');
            $table->string('purchase_prefix', 20)->default('PUR');
            $table->string('sales_return_prefix', 20)->default('SRN');
            $table->string('purchase_return_prefix', 20)->default('PRN');
            $table->decimal('tax_rate', 8, 2)->default(0);
            $table->string('default_payment_method')->default('Cash');
            $table->text('invoice_footer')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('business_settings');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('purchases', function (Blueprint $table) {
            $table->date('purchase_date')->nullable()->after('user_id');
            $table->decimal('paid_amount', 12, 2)->default(0)->after('total');
            $table->decimal('due_amount', 12, 2)->default(0)->after('paid_amount');
            $table->string('payment_method', 40)->default('cash')->after('due_amount');
            $table->string('payment_status', 20)->default('unpaid')->after('payment_method');

            $table->index('purchase_date');
            $table->index('payment_status');
        });
    }

    public function down(): void
    {
        Schema::table('purchases', function (Blueprint $table) {
            $table->dropIndex(['purchase_date']);
            $table->dropIndex(['payment_status']);

            $table->dropColumn([
                'purchase_date',
                'paid_amount',
                'due_amount',
                'payment_method',
                'payment_status',
            ]);
        });
    }
};

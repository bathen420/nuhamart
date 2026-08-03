<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('courier_consignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->string('provider', 40)->index();
            $table->string('external_id', 120)->nullable()->index();
            $table->string('tracking_code', 160)->nullable()->index();
            $table->string('status', 80)->default('created')->index();
            $table->decimal('cod_amount', 14, 2)->default(0);
            $table->json('request_payload')->nullable();
            $table->json('response_payload')->nullable();
            $table->text('last_error')->nullable();
            $table->timestamp('last_synced_at')->nullable();
            $table->timestamps();
            $table->unique(['order_id', 'provider']);
        });

        Schema::table('business_settings', function (Blueprint $table) {
            $table->boolean('steadfast_enabled')->default(false)->after('bank_payment_instructions');
            $table->string('default_courier', 40)->default('steadfast')->after('steadfast_enabled');
            $table->unsignedSmallInteger('courier_sync_minutes')->default(15)->after('default_courier');
        });
    }

    public function down(): void
    {
        Schema::table('business_settings', function (Blueprint $table) {
            $table->dropColumn(['steadfast_enabled', 'default_courier', 'courier_sync_minutes']);
        });
        Schema::dropIfExists('courier_consignments');
    }
};

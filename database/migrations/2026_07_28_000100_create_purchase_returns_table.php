<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
 public function up(): void {
  Schema::create('purchase_returns', function (Blueprint $table) {
   $table->id(); $table->string('return_number')->unique();
   $table->foreignId('purchase_id')->constrained()->cascadeOnDelete();
   $table->foreignId('supplier_id')->nullable()->constrained()->nullOnDelete();
   $table->foreignId('user_id')->constrained()->cascadeOnDelete();
   $table->date('return_date'); $table->decimal('subtotal',12,2);
   $table->decimal('refund_amount',12,2)->default(0); $table->string('refund_method',40);
   $table->string('status',30)->default('completed'); $table->text('reason')->nullable(); $table->timestamps();
  });
 }
 public function down(): void { Schema::dropIfExists('purchase_returns'); }
};
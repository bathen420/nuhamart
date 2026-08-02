<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('purchase_requisitions', function (Blueprint $table) {
            $table->id(); $table->string('requisition_number')->unique();
            $table->string('department')->nullable(); $table->date('required_date')->nullable();
            $table->string('status')->default('draft'); $table->text('reason')->nullable();
            $table->foreignId('requested_by')->constrained('users')->cascadeOnDelete();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable(); $table->timestamps();
        });
        Schema::create('purchase_requisition_items', function (Blueprint $table) {
            $table->id(); $table->foreignId('purchase_requisition_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->restrictOnDelete();
            $table->unsignedInteger('quantity'); $table->decimal('estimated_price', 12, 2)->default(0);
            $table->text('note')->nullable(); $table->timestamps();
        });
        Schema::create('purchase_orders', function (Blueprint $table) {
            $table->id(); $table->string('po_number')->unique();
            $table->foreignId('supplier_id')->constrained()->restrictOnDelete();
            $table->foreignId('purchase_requisition_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('warehouse_id')->nullable()->constrained()->nullOnDelete();
            $table->date('order_date'); $table->date('expected_date')->nullable();
            $table->string('status')->default('draft'); $table->decimal('subtotal',12,2)->default(0);
            $table->decimal('discount',12,2)->default(0); $table->decimal('tax',12,2)->default(0);
            $table->decimal('shipping',12,2)->default(0); $table->decimal('total',12,2)->default(0);
            $table->text('terms')->nullable(); $table->text('note')->nullable();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable(); $table->timestamps();
        });
        Schema::create('purchase_order_items', function (Blueprint $table) {
            $table->id(); $table->foreignId('purchase_order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->restrictOnDelete();
            $table->unsignedInteger('ordered_quantity'); $table->unsignedInteger('received_quantity')->default(0);
            $table->decimal('unit_price',12,2); $table->decimal('subtotal',12,2); $table->timestamps();
        });
        Schema::create('goods_receipts', function (Blueprint $table) {
            $table->id(); $table->string('grn_number')->unique();
            $table->foreignId('purchase_order_id')->constrained()->restrictOnDelete();
            $table->foreignId('warehouse_id')->nullable()->constrained()->nullOnDelete();
            $table->date('received_date'); $table->string('supplier_invoice_number')->nullable();
            $table->date('supplier_invoice_date')->nullable(); $table->date('due_date')->nullable();
            $table->string('status')->default('received'); $table->text('note')->nullable();
            $table->foreignId('received_by')->constrained('users')->cascadeOnDelete(); $table->timestamps();
        });
        Schema::create('goods_receipt_items', function (Blueprint $table) {
            $table->id(); $table->foreignId('goods_receipt_id')->constrained()->cascadeOnDelete();
            $table->foreignId('purchase_order_item_id')->constrained()->restrictOnDelete();
            $table->foreignId('product_id')->constrained()->restrictOnDelete();
            $table->unsignedInteger('quantity'); $table->decimal('unit_price',12,2); $table->decimal('subtotal',12,2); $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('goods_receipt_items'); Schema::dropIfExists('goods_receipts');
        Schema::dropIfExists('purchase_order_items'); Schema::dropIfExists('purchase_orders');
        Schema::dropIfExists('purchase_requisition_items'); Schema::dropIfExists('purchase_requisitions');
    }
};

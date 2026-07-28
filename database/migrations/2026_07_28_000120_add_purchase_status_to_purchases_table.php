<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
 public function up(): void { if (!Schema::hasColumn('purchases','purchase_status')) Schema::table('purchases',fn(Blueprint $t)=>$t->string('purchase_status',30)->default('Completed')); }
 public function down(): void { if (Schema::hasColumn('purchases','purchase_status')) Schema::table('purchases',fn(Blueprint $t)=>$t->dropColumn('purchase_status')); }
};
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('module', 80)->index();
            $table->string('action', 40)->index();
            $table->string('description');
            $table->nullableMorphs('subject');
            $table->string('route_name')->nullable()->index();
            $table->string('method', 10)->nullable();
            $table->string('ip_address', 45)->nullable()->index();
            $table->text('user_agent')->nullable();
            $table->json('properties')->nullable();
            $table->timestamps();

            $table->index(['created_at', 'user_id']);
            $table->index(['module', 'action', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};

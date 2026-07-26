<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // This migration has been intentionally left empty.
        // All checkout columns already exist in the orders table.
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Nothing to rollback.
    }
};
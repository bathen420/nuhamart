<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add the created_by audit column only when an older database
     * does not already contain it.
     */
    public function up(): void
    {
        if (Schema::hasColumn('customers', 'created_by')) {
            return;
        }

        Schema::table('customers', function (Blueprint $table) {
            $table->foreignId('created_by')
                ->nullable()
                ->after('notes')
                ->constrained('users')
                ->nullOnDelete();
        });
    }

    /**
     * Remove the audit column only when it exists.
     */
    public function down(): void
    {
        if (! Schema::hasColumn('customers', 'created_by')) {
            return;
        }

        Schema::table('customers', function (Blueprint $table) {
            $table->dropConstrainedForeignId('created_by');
        });
    }
};

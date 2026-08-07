<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payment_transactions', function (Blueprint $table) {
            if (! Schema::hasColumn('payment_transactions', 'attempt_no')) {
                $table->unsignedInteger('attempt_no')->default(1)->after('gateway');
            }

            if (! Schema::hasColumn('payment_transactions', 'callback_count')) {
                $table->unsignedInteger('callback_count')->default(0)->after('status');
            }

            if (! Schema::hasColumn('payment_transactions', 'last_callback_at')) {
                $table->timestamp('last_callback_at')->nullable()->after('last_verified_at');
            }
        });
    }

    public function down(): void
    {
        $columns = collect([
            'attempt_no',
            'callback_count',
            'last_callback_at',
        ])->filter(
            fn (string $column) => Schema::hasColumn('payment_transactions', $column)
        )->all();

        if ($columns !== []) {
            Schema::table('payment_transactions', function (Blueprint $table) use ($columns) {
                $table->dropColumn($columns);
            });
        }
    }
};

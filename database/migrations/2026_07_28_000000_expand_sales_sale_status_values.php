<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * SQLite table rebuilds and PRAGMA statements must control their own
     * transaction boundary. Keep this property untyped to match Laravel's
     * base Migration class on the installed framework version.
     *
     * @var bool
     */
    public $withinTransaction = false;

    public function up(): void
    {
        $driver = DB::getDriverName();

        if ($driver === 'sqlite') {
            DB::statement('PRAGMA foreign_keys = OFF');

            try {
                DB::beginTransaction();
                DB::statement('DROP TABLE IF EXISTS "sales_status_upgrade"');

                DB::statement(<<<'SQL'
                    CREATE TABLE "sales_status_upgrade" (
                        "id" integer primary key autoincrement not null,
                        "sale_number" varchar not null,
                        "customer_id" integer,
                        "user_id" integer,
                        "subtotal" numeric not null,
                        "discount" numeric not null default '0',
                        "tax" numeric not null default '0',
                        "shipping" numeric not null default '0',
                        "total" numeric not null,
                        "paid_amount" numeric not null default '0',
                        "due_amount" numeric not null default '0',
                        "payment_method" varchar check ("payment_method" in ('Cash', 'Card', 'Mobile Banking', 'Bank')) not null default 'Cash',
                        "payment_status" varchar check ("payment_status" in ('Paid', 'Partial', 'Due')) not null default 'Paid',
                        "sale_status" varchar check ("sale_status" in ('Completed', 'Pending', 'Cancelled', 'Returned', 'Partially Returned')) not null default 'Completed',
                        "note" text,
                        "created_at" datetime,
                        "updated_at" datetime,
                        foreign key("customer_id") references "customers"("id") on delete set null,
                        foreign key("user_id") references "users"("id") on delete set null
                    )
                SQL);

                DB::statement(<<<'SQL'
                    INSERT INTO "sales_status_upgrade" (
                        "id", "sale_number", "customer_id", "user_id", "subtotal", "discount",
                        "tax", "shipping", "total", "paid_amount", "due_amount", "payment_method",
                        "payment_status", "sale_status", "note", "created_at", "updated_at"
                    )
                    SELECT
                        "id", "sale_number", "customer_id", "user_id", "subtotal", "discount",
                        "tax", "shipping", "total", "paid_amount", "due_amount", "payment_method",
                        "payment_status", "sale_status", "note", "created_at", "updated_at"
                    FROM "sales"
                SQL);

                DB::statement('DROP TABLE "sales"');
                DB::statement('ALTER TABLE "sales_status_upgrade" RENAME TO "sales"');
                DB::statement('CREATE UNIQUE INDEX "sales_sale_number_unique" ON "sales" ("sale_number")');
                DB::statement('CREATE INDEX "sales_customer_id_index" ON "sales" ("customer_id")');
                DB::statement('CREATE INDEX "sales_user_id_index" ON "sales" ("user_id")');
                DB::statement('CREATE INDEX "sales_payment_status_index" ON "sales" ("payment_status")');
                DB::statement('CREATE INDEX "sales_sale_status_index" ON "sales" ("sale_status")');
                DB::statement('CREATE INDEX "sales_created_at_index" ON "sales" ("created_at")');
                DB::commit();
            } catch (\Throwable $exception) {
                if (DB::transactionLevel() > 0) {
                    DB::rollBack();
                }

                throw $exception;
            } finally {
                DB::statement('PRAGMA foreign_keys = ON');
            }

            return;
        }

        if ($driver === 'mysql') {
            DB::statement(
                "ALTER TABLE `sales` MODIFY `sale_status` ENUM('Completed','Pending','Cancelled','Returned','Partially Returned') NOT NULL DEFAULT 'Completed'"
            );
        }
    }

    public function down(): void
    {
        // Return statuses are intentionally preserved because existing sales
        // may already reference them.
    }
};

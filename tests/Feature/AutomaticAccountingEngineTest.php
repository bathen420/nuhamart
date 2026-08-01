<?php

namespace Tests\Feature;

use App\Models\JournalEntry;
use App\Models\Purchase;
use App\Models\PurchasePayment;
use App\Models\Sale;
use App\Models\SaleReturn;
use App\Models\Supplier;
use App\Models\User;
use App\Services\AccountingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AutomaticAccountingEngineTest extends TestCase
{
    use RefreshDatabase;

    public function test_sale_posting_is_balanced_and_idempotent(): void
    {
        $user = User::factory()->create();
        $sale = Sale::create([
            'sale_number' => 'SALE-TEST-001',
            'user_id' => $user->id,
            'subtotal' => 1000,
            'discount' => 0,
            'tax' => 0,
            'shipping' => 0,
            'total' => 1000,
            'paid_amount' => 600,
            'due_amount' => 400,
            'payment_method' => 'Cash',
            'payment_status' => 'Partial',
            'sale_status' => 'Completed',
        ]);

        $service = app(AccountingService::class);
        $first = $service->postSale($sale, $user->id);
        $second = $service->postSale($sale, $user->id);

        $this->assertNotNull($first);
        $this->assertSame($first->id, $second?->id);
        $this->assertSame(1, JournalEntry::where('source_type', Sale::class)->where('source_id', $sale->id)->count());
        $this->assertEquals(1000.0, (float) $first->lines->sum('debit'));
        $this->assertEquals(1000.0, (float) $first->lines->sum('credit'));
    }

    public function test_purchase_and_later_payment_create_separate_balanced_entries(): void
    {
        $user = User::factory()->create();
        $supplier = Supplier::create([
            'name' => 'Test Supplier',
            'phone' => '01700000001',
            'status' => true,
        ]);
        $purchase = Purchase::create([
            'purchase_number' => 'PUR-TEST-001',
            'supplier_id' => $supplier->id,
            'user_id' => $user->id,
            'purchase_date' => now()->toDateString(),
            'subtotal' => 2000,
            'discount' => 0,
            'shipping' => 0,
            'total' => 2000,
            'paid_amount' => 500,
            'due_amount' => 1500,
            'payment_method' => 'Cash',
            'payment_status' => 'partial',
        ]);
        $payment = PurchasePayment::create([
            'purchase_id' => $purchase->id,
            'user_id' => $user->id,
            'amount' => 300,
            'payment_method' => 'Bank',
            'payment_date' => now()->toDateString(),
            'reference' => 'PAY-TEST-001',
        ]);

        $service = app(AccountingService::class);
        $purchaseEntry = $service->postPurchase($purchase, $user->id);
        $paymentEntry = $service->postPurchasePayment($purchase, $payment, $user->id);

        $this->assertNotNull($purchaseEntry);
        $this->assertNotNull($paymentEntry);
        $this->assertEquals((float) $purchaseEntry->lines->sum('debit'), (float) $purchaseEntry->lines->sum('credit'));
        $this->assertEquals((float) $paymentEntry->lines->sum('debit'), (float) $paymentEntry->lines->sum('credit'));
        $this->assertSame(2, JournalEntry::count());
    }

    public function test_sales_return_reverses_cash_and_receivable_without_deleting_original_sale(): void
    {
        $user = User::factory()->create();
        $sale = Sale::create([
            'sale_number' => 'SALE-TEST-002',
            'user_id' => $user->id,
            'subtotal' => 1000,
            'discount' => 0,
            'tax' => 0,
            'shipping' => 0,
            'total' => 600,
            'paid_amount' => 300,
            'due_amount' => 300,
            'payment_method' => 'Cash',
            'payment_status' => 'Partial',
            'sale_status' => 'Partially Returned',
        ]);
        $return = SaleReturn::create([
            'return_number' => 'SR-TEST-001',
            'sale_id' => $sale->id,
            'user_id' => $user->id,
            'return_date' => now()->toDateString(),
            'subtotal' => 400,
            'refund_amount' => 250,
            'refund_method' => 'Cash',
            'status' => 'completed',
        ]);

        $entry = app(AccountingService::class)->postSaleReturn($return, $user->id);

        $this->assertNotNull($entry);
        $this->assertEquals(400.0, (float) $entry->lines->sum('debit'));
        $this->assertEquals(400.0, (float) $entry->lines->sum('credit'));
        $this->assertDatabaseHas('sales', ['id' => $sale->id]);
    }
}

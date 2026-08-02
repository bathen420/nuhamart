<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\ProductWarehouseStock;
use App\Models\StockAdjustment;
use App\Models\User;
use App\Models\Warehouse;
use App\Services\StockAdjustmentService;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InventoryCoreTest extends TestCase
{
    use RefreshDatabase;

    public function test_approved_adjustment_updates_warehouse_and_product_stock(): void
    {
        $this->seed(RolesAndPermissionsSeeder::class);
        $user = User::where('email', 'admin@nuhamartbd.com')->firstOrFail();
        $warehouse = Warehouse::create(['name'=>'Main','code'=>'MAIN','status'=>true,'is_default'=>true,'created_by'=>$user->id]);
        $product = Product::factory()->create(['stock_quantity'=>0]);

        $service = app(StockAdjustmentService::class);
        $adjustment = $service->create([
            'warehouse_id'=>$warehouse->id,
            'adjustment_date'=>now()->toDateString(),
            'items'=>[['product_id'=>$product->id,'direction'=>'increase','quantity'=>5,'reason'=>'Correction','unit_cost'=>10]],
        ], $user->id);

        $service->approve($adjustment, $user->id);

        $this->assertSame(5, (int) $product->fresh()->stock_quantity);
        $this->assertSame(5, (int) ProductWarehouseStock::where('product_id',$product->id)->where('warehouse_id',$warehouse->id)->value('quantity'));
        $this->assertDatabaseHas('stock_ledgers', ['reference'=>$adjustment->reference,'quantity_in'=>5,'balance_after'=>5]);
    }
}

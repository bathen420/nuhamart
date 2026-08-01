<?php
namespace Tests\Feature;
use App\Models\Product;
use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;
class OpeningStockTest extends TestCase {
 use RefreshDatabase;
 public function test_authorized_user_can_create_opening_stock(): void {
   $user=User::factory()->create(['is_active'=>true]); Permission::firstOrCreate(['name'=>'opening-stocks.view']); $user->givePermissionTo('opening-stocks.view');
   $warehouse=Warehouse::create(['name'=>'Main','code'=>'MAIN','status'=>true,'is_default'=>true]);
   $product=Product::factory()->create(['stock_quantity'=>0,'status'=>true]);
   $response=$this->actingAs($user)->post(route('admin.opening-stocks.store'),['warehouse_id'=>$warehouse->id,'opening_date'=>now()->toDateString(),'items'=>[['product_id'=>$product->id,'quantity'=>10,'unit_cost'=>25]]]);
   $response->assertRedirect(); $this->assertDatabaseHas('product_warehouse_stocks',['product_id'=>$product->id,'warehouse_id'=>$warehouse->id,'quantity'=>10]); $this->assertSame(10,$product->fresh()->stock_quantity);
 }
}

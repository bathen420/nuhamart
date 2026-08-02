<?php
namespace Tests\Feature;
use App\Models\Coupon;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;
class MarketingPromotionEngineTest extends TestCase
{
 use RefreshDatabase;
 public function test_marketing_routes_are_registered(): void { $this->assertTrue(Route::has('admin.marketing.coupons.index')); $this->assertTrue(Route::has('checkout.coupon.validate')); }
 public function test_percentage_coupon_is_applied_server_side(): void
 {
   $product=Product::factory()->create(['price'=>1000,'discount_price'=>null,'stock_quantity'=>10,'status'=>true]);
   Coupon::create(['code'=>'SAVE10','name'=>'Save 10','type'=>'percentage','value'=>10,'minimum_order'=>0,'scope_type'=>'all','per_customer_limit'=>1,'is_active'=>true]);
   $this->postJson(route('checkout.coupon.validate'),['coupon_code'=>'SAVE10','phone'=>'01700000000','shipping'=>60,'items'=>[['product_id'=>$product->id,'quantity'=>1]]])->assertOk()->assertJsonPath('discount',100);
 }
 public function test_expired_coupon_is_rejected(): void
 {
   $product=Product::factory()->create(['price'=>1000,'stock_quantity'=>10,'status'=>true]);
   Coupon::create(['code'=>'OLD','name'=>'Old','type'=>'fixed','value'=>100,'minimum_order'=>0,'scope_type'=>'all','per_customer_limit'=>1,'ends_at'=>now()->subDay(),'is_active'=>true]);
   $this->postJson(route('checkout.coupon.validate'),['coupon_code'=>'OLD','items'=>[['product_id'=>$product->id,'quantity'=>1]]])->assertUnprocessable();
 }
}

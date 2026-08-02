<?php
namespace Tests\Feature;
use App\Models\Customer;
use App\Models\Sale;
use App\Models\User;
use App\Services\CrmLoyaltyService;
use Database\Seeders\CrmLoyaltySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
class CrmLoyaltyTest extends TestCase
{use RefreshDatabase; public function test_sale_earns_points_once():void{$this->seed(CrmLoyaltySeeder::class);$customer=Customer::create(['customer_code'=>'C-1','name'=>'CRM Customer','phone'=>'01700000001','opening_balance'=>0,'current_balance'=>0,'status'=>true]);$sale=Sale::create(['sale_number'=>'S-1','customer_id'=>$customer->id,'subtotal'=>1250,'discount'=>0,'tax'=>0,'shipping'=>0,'total'=>1250,'paid_amount'=>1250,'due_amount'=>0,'payment_method'=>'Cash','payment_status'=>'Paid','sale_status'=>'Completed']);$service=app(CrmLoyaltyService::class);$service->recordSale($sale);$service->recordSale($sale);$this->assertSame(12,$customer->crmProfile()->first()->points_balance);$this->assertDatabaseCount('loyalty_transactions',1);} public function test_wallet_cannot_go_negative():void{$customer=Customer::create(['customer_code'=>'C-2','name'=>'Wallet Customer','phone'=>'01700000002','opening_balance'=>0,'current_balance'=>0,'status'=>true]);$this->expectException(\Illuminate\Validation\ValidationException::class);app(CrmLoyaltyService::class)->adjustWallet($customer,100,'debit','Test',null);}}

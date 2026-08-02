<?php
namespace Tests\Feature; use Tests\TestCase;
class PurchaseManagementProRoutesTest extends TestCase { public function test_purchase_management_pro_routes_are_registered():void { foreach(['admin.purchase-requisitions.index','admin.purchase-orders.index','admin.goods-receipts.index','admin.supplier-statements.index'] as $name){$this->assertTrue(app('router')->has($name),"Missing route {$name}");} } }

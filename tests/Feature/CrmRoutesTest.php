<?php
namespace Tests\Feature;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;
class CrmRoutesTest extends TestCase
{public function test_crm_routes_are_registered():void{foreach(['admin.crm.index','admin.crm.show','admin.crm.points','admin.crm.wallet','admin.crm.notes','admin.gift-vouchers.index','admin.gift-vouchers.store'] as $name)$this->assertTrue(Route::has($name),"Missing {$name}");}}

<?php
namespace Tests\Feature;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;
class EnterprisePosRoutesTest extends TestCase { use RefreshDatabase; public function test_enterprise_pos_routes_are_registered():void { foreach(['admin.pos.shifts','admin.pos.shifts.open','admin.pos.shifts.close','admin.pos.shifts.report','admin.pos.drawer','admin.pos.holds','admin.pos.hold','admin.pos.holds.resume','admin.pos.holds.destroy'] as $name) $this->assertTrue(Route::has($name),$name); } }

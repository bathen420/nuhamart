<?php

namespace Tests\Feature;

use App\Models\CourierConsignment;
use App\Models\Order;
use App\Services\CourierService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class SteadfastCourierIntegrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        config()->set('couriers.steadfast.enabled', true);
        config()->set('couriers.steadfast.api_key', 'test-key');
        config()->set('couriers.steadfast.secret_key', 'test-secret');
        config()->set('couriers.steadfast.base_url', 'https://portal.packzy.com/api/v1');
    }

    public function test_courier_routes_are_registered(): void
    {
        $this->assertTrue(Route::has('admin.orders.courier-consignments.store'));
        $this->assertTrue(Route::has('admin.courier-consignments.sync'));
    }

    public function test_steadfast_consignment_is_created_once(): void
    {
        Http::fake(['portal.packzy.com/api/v1/create_order' => Http::response([
            'status' => 200,
            'consignment' => ['consignment_id' => 12345, 'tracking_code' => 'TRK-123', 'status' => 'in_review'],
        ])]);

        $order = Order::factory()->create(['payment_status' => 'pending', 'status' => 'confirmed', 'shipping_method' => 'home_delivery', 'total' => 1200]);
        $service = app(CourierService::class);
        $consignment = $service->create($order, 'steadfast');

        $this->assertSame('TRK-123', $consignment->tracking_code);
        $this->assertSame('processing', $order->fresh()->status);
        $this->assertDatabaseCount('courier_consignments', 1);
        $this->expectException(\RuntimeException::class);
        $service->create($order, 'steadfast');
    }

    public function test_tracking_sync_updates_order_status(): void
    {
        Http::fake(['portal.packzy.com/api/v1/status_by_trackingcode/TRK-123' => Http::response(['delivery_status' => 'delivered'])]);
        $order = Order::factory()->create(['status' => 'shipped']);
        $consignment = CourierConsignment::create(['order_id'=>$order->id,'provider'=>'steadfast','tracking_code'=>'TRK-123','status'=>'in_transit','cod_amount'=>0]);

        app(CourierService::class)->sync($consignment);

        $this->assertSame('delivered', $order->fresh()->status);
        $this->assertSame('delivered', $consignment->fresh()->status);
    }
}

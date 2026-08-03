<?php

namespace App\Services;

use App\Contracts\Couriers\CourierGateway;
use App\Integrations\Couriers\Steadfast\SteadfastGateway;
use App\Models\CourierConsignment;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use RuntimeException;
use Throwable;

class CourierService
{
    public function gateway(string $provider): CourierGateway
    {
        return match ($provider) {
            'steadfast' => app(SteadfastGateway::class),
            default => throw new RuntimeException('Unsupported courier provider.'),
        };
    }

    public function create(Order $order, string $provider = 'steadfast'): CourierConsignment
    {
        if ($order->shipping_method === 'store_pickup') throw new RuntimeException('Store pickup orders cannot be sent to a courier.');
        if ($order->status === 'cancelled') throw new RuntimeException('Cancelled orders cannot be sent to a courier.');
        if ($order->courierConsignments()->where('provider', $provider)->exists()) throw new RuntimeException('A consignment already exists for this courier.');

        $gateway = $this->gateway($provider);
        try {
            $result = $gateway->createConsignment($order);
            $data = $result['consignment'];
            return DB::transaction(function () use ($order, $provider, $result, $data) {
                $consignment = CourierConsignment::create([
                    'order_id' => $order->id,
                    'provider' => $provider,
                    'external_id' => (string) ($data['consignment_id'] ?? $data['id'] ?? ''),
                    'tracking_code' => (string) ($data['tracking_code'] ?? ''),
                    'status' => strtolower((string) ($data['status'] ?? 'in_review')),
                    'cod_amount' => $order->payment_status === 'paid' ? 0 : $order->total,
                    'request_payload' => $result['request'],
                    'response_payload' => $result['response'],
                    'last_synced_at' => now(),
                ]);
                $order->update([
                    'courier_name' => 'Steadfast',
                    'tracking_number' => $consignment->tracking_code,
                    'status' => in_array($order->status, ['pending','confirmed'], true) ? 'processing' : $order->status,
                ]);
                return $consignment;
            });
        } catch (Throwable $e) {
            CourierConsignment::updateOrCreate(
                ['order_id' => $order->id, 'provider' => $provider],
                ['status' => 'failed', 'cod_amount' => $order->payment_status === 'paid' ? 0 : $order->total, 'last_error' => $e->getMessage()]
            );
            throw $e;
        }
    }

    public function sync(CourierConsignment $consignment): CourierConsignment
    {
        if (! $consignment->tracking_code) throw new RuntimeException('Tracking code is missing.');
        try {
            $result = $this->gateway($consignment->provider)->track($consignment->tracking_code);
            $status = strtolower((string) ($result['delivery_status'] ?? data_get($result, 'data.delivery_status') ?? $result['status'] ?? 'unknown'));
            $consignment->update(['status' => $status, 'response_payload' => $result, 'last_error' => null, 'last_synced_at' => now()]);
            $mapped = $this->mapOrderStatus($status);
            if ($mapped && $consignment->order->status !== $mapped) $consignment->order->update(['status' => $mapped]);
            return $consignment->fresh();
        } catch (Throwable $e) {
            $consignment->update(['last_error' => $e->getMessage(), 'last_synced_at' => now()]);
            throw $e;
        }
    }

    private function mapOrderStatus(string $status): ?string
    {
        return match (true) {
            str_contains($status, 'delivered') => 'delivered',
            str_contains($status, 'cancel'), str_contains($status, 'return') => 'cancelled',
            str_contains($status, 'pickup'), str_contains($status, 'transit'), str_contains($status, 'delivery') => 'shipped',
            default => null,
        };
    }
}

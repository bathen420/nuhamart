<?php

namespace App\Integrations\Couriers\Steadfast;

use App\Contracts\Couriers\CourierGateway;
use App\Models\Order;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class SteadfastGateway implements CourierGateway
{
    public function provider(): string { return 'steadfast'; }

    public function createConsignment(Order $order): array
    {
        $this->ensureConfigured();
        $payload = [
            'invoice' => $order->order_no,
            'recipient_name' => $order->customer_name,
            'recipient_phone' => preg_replace('/\D+/', '', (string) $order->customer_phone),
            'recipient_address' => trim(implode(', ', array_filter([$order->address, $order->area, $order->district, $order->division]))),
            'cod_amount' => $order->payment_status === 'paid' ? 0 : (float) $order->total,
            'note' => $order->note,
            'delivery_type' => 0,
        ];

        try {
            $response = $this->client()->post($this->url('/create_order'), $payload);
        } catch (ConnectionException $e) {
            throw new RuntimeException('Unable to connect to Steadfast: '.$e->getMessage());
        }

        $body = $response->json();
        if (! $response->successful() || ! is_array($body)) {
            throw new RuntimeException('Steadfast rejected the consignment request.');
        }

        $consignment = $body['consignment'] ?? $body['data'] ?? $body;
        if (! is_array($consignment) || empty($consignment['tracking_code'])) {
            throw new RuntimeException((string) ($body['message'] ?? 'Steadfast did not return a tracking code.'));
        }

        return ['request' => $payload, 'response' => $body, 'consignment' => $consignment];
    }

    public function track(string $identifier): array
    {
        $this->ensureConfigured();
        try {
            $response = $this->client()->get($this->url('/status_by_trackingcode/'.urlencode($identifier)));
        } catch (ConnectionException $e) {
            throw new RuntimeException('Unable to connect to Steadfast: '.$e->getMessage());
        }
        $body = $response->json();
        if (! $response->successful() || ! is_array($body)) {
            throw new RuntimeException('Unable to retrieve Steadfast delivery status.');
        }
        return $body;
    }

    private function client()
    {
        return Http::acceptJson()->withHeaders([
            'Api-Key' => (string) config('couriers.steadfast.api_key'),
            'Secret-Key' => (string) config('couriers.steadfast.secret_key'),
            'Content-Type' => 'application/json',
        ])->timeout((int) config('couriers.steadfast.timeout', 20));
    }

    private function url(string $path): string
    {
        return rtrim((string) config('couriers.steadfast.base_url'), '/').'/'.ltrim($path, '/');
    }

    private function ensureConfigured(): void
    {
        if (! config('couriers.steadfast.enabled') || blank(config('couriers.steadfast.api_key')) || blank(config('couriers.steadfast.secret_key'))) {
            throw new RuntimeException('Steadfast is not configured. Add credentials to .env and enable it.');
        }
    }
}

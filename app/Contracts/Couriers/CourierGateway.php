<?php

namespace App\Contracts\Couriers;

use App\Models\Order;

interface CourierGateway
{
    public function provider(): string;
    public function createConsignment(Order $order): array;
    public function track(string $identifier): array;
}

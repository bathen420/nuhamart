<?php

namespace App\Services;

use App\Repositories\OrderRepository;

class OrderService
{
    public function __construct(
        protected OrderRepository $orderRepository
    ) {}

    public function place(array $data)
    {
        return $this->orderRepository->create($data);
    }
}
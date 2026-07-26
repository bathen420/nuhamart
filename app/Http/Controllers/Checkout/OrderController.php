<?php

namespace App\Http\Controllers\Checkout;

use App\Http\Controllers\Controller;
use App\Http\Requests\Checkout\StoreOrderRequest;
use App\Services\OrderService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class OrderController extends Controller
{
    /**
     * Order service instance.
     */
    public function __construct(
        private readonly OrderService $orderService
    ) {
    }

    /**
     * Display the checkout page.
     */
    public function create(): Response
    {
        return Inertia::render('Checkout/Index');
    }

    /**
     * Store a newly placed order.
     */
    public function store(
        StoreOrderRequest $request
    ): RedirectResponse {
        try {
            $order = $this->orderService->place(
                $request->validated()
            );

            return redirect()
                ->route('home')
                ->with(
                    'success',
                    "Order {$order->order_no} placed successfully."
                );
        } catch (Throwable $exception) {
            report($exception);

            return back()
                ->withInput()
                ->with(
                    'error',
                    config('app.debug')
                        ? $exception->getMessage()
                        : 'Unable to place the order. Please try again.'
                );
        }
    }
}
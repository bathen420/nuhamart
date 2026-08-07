<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\SslCommerzService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use RuntimeException;
use Throwable;

class SslCommerzController extends Controller
{
    public function __construct(
        private readonly SslCommerzService $payments
    ) {}

    public function success(Request $request): RedirectResponse
    {
        try {
            $transaction = $this->payments->validateAndMarkPaid(
                $request->all()
            );

            $request->session()->put(
                'recent_order_id',
                $transaction->order_id
            );

            return redirect()
                ->route(
                    'checkout.success',
                    $transaction->order->order_no
                )
                ->with(
                    'success',
                    'Payment verified successfully.'
                );
        } catch (RuntimeException $exception) {
            report($exception);

            return $this->redirectToOrderOrCheckout(
                $request,
                $exception->getMessage()
            );
        }
    }

    public function ipn(Request $request): Response
    {
        try {
            $this->payments->validateAndMarkPaid($request->all());

            return response('OK', 200);
        } catch (Throwable $exception) {
            report($exception);

            return response('INVALID', 422);
        }
    }

    public function fail(Request $request): RedirectResponse
    {
        $transaction = $this->payments->markFailed(
            $request->all(),
            'failed'
        );

        return $this->redirectToOrderOrCheckout(
            $request,
            'Online payment failed. You may retry from your order page.',
            $transaction?->order_id
        );
    }

    public function cancel(Request $request): RedirectResponse
    {
        $transaction = $this->payments->markFailed(
            $request->all(),
            'cancelled'
        );

        return $this->redirectToOrderOrCheckout(
            $request,
            'Online payment was cancelled.',
            $transaction?->order_id
        );
    }

    public function retry(
        Request $request,
        Order $order
    ): RedirectResponse {
        $owned = (int) $order->user_id === (int) $request->user()?->id
            || (
                $order->user_id === null
                && $order->customer_email
                && $request->user()
                && strcasecmp(
                    $order->customer_email,
                    $request->user()->email
                ) === 0
            )
            || (int) $request->session()->get('recent_order_id')
                === (int) $order->id;

        abort_unless($owned, 403);

        try {
            $transaction = $this->payments->retry($order);

            return redirect()->away($transaction->gateway_url);
        } catch (RuntimeException $exception) {
            return back()->with('error', $exception->getMessage());
        }
    }

    private function redirectToOrderOrCheckout(
        Request $request,
        string $message,
        ?int $orderId = null
    ): RedirectResponse {
        $orderId ??= (int) $request->session()->get(
            'recent_order_id'
        );

        $order = $orderId
            ? Order::query()->find($orderId)
            : null;

        if ($order && $request->user()) {
            return redirect()
                ->route('customer.orders.show', $order)
                ->with('error', $message);
        }

        return redirect()
            ->route('checkout.index')
            ->with('error', $message);
    }
}

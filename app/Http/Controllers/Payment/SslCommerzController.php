<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\SslCommerzService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use RuntimeException;

class SslCommerzController extends Controller
{
    public function __construct(private readonly SslCommerzService $payments) {}

    public function success(Request $request): RedirectResponse
    {
        try {
            $transaction = $this->payments->validateAndMarkPaid($request->all());
            $request->session()->put('recent_order_id', $transaction->order_id);
            return redirect()->route('checkout.success', $transaction->order->order_no)->with('success', 'Payment verified successfully.');
        } catch (RuntimeException $exception) {
            report($exception);
            return redirect()->route('checkout.index')->with('error', $exception->getMessage());
        }
    }

    public function ipn(Request $request): Response
    {
        try {
            $this->payments->validateAndMarkPaid($request->all());
            return response('OK', 200);
        } catch (\Throwable $exception) {
            report($exception);
            return response('INVALID', 422);
        }
    }

    public function fail(Request $request): RedirectResponse
    {
        $this->payments->markFailed($request->all(), 'failed');
        return redirect()->route('checkout.index')->with('error', 'Online payment failed. You may retry from your order page.');
    }

    public function cancel(Request $request): RedirectResponse
    {
        $this->payments->markFailed($request->all(), 'cancelled');
        return redirect()->route('checkout.index')->with('error', 'Online payment was cancelled.');
    }

    public function retry(Request $request, Order $order): RedirectResponse
    {
        abort_unless($order->user_id === $request->user()?->id || (int) $request->session()->get('recent_order_id') === $order->id, 403);
        $transaction = $this->payments->retry($order);
        return redirect()->away($transaction->gateway_url);
    }
}

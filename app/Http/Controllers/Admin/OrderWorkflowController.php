<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateOrderWorkflowRequest;
use App\Models\Order;

class OrderWorkflowController extends Controller
{
    public function update(UpdateOrderWorkflowRequest $request, Order $order)
    {
        $order->update($request->validated());

        return back()->with('success', 'Order workflow updated successfully.');
    }
}

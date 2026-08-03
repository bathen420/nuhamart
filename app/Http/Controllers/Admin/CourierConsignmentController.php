<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CreateCourierConsignmentRequest;
use App\Models\CourierConsignment;
use App\Models\Order;
use App\Services\CourierService;
use RuntimeException;

class CourierConsignmentController extends Controller
{
    public function __construct(private readonly CourierService $service) {}
    public function store(CreateCourierConsignmentRequest $request, Order $order)
    {
        try { $this->service->create($order, $request->validated('provider')); }
        catch (RuntimeException $e) { return back()->withErrors(['courier' => $e->getMessage()]); }
        return back()->with('success', 'Courier consignment created successfully.');
    }
    public function sync(CourierConsignment $consignment)
    {
        try { $this->service->sync($consignment); }
        catch (RuntimeException $e) { return back()->withErrors(['courier' => $e->getMessage()]); }
        return back()->with('success', 'Courier status synchronized.');
    }
}

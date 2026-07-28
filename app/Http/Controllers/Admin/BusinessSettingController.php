<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateBusinessSettingRequest;
use App\Services\BusinessSettingService;
use Inertia\Inertia;
use Inertia\Response;

class BusinessSettingController extends Controller
{
    public function __construct(private readonly BusinessSettingService $service)
    {
    }

    public function edit(): Response
    {
        return Inertia::render('Admin/Settings/Edit', [
            'setting' => $this->service->getCurrent(),
            'timezones' => ['Asia/Dhaka', 'UTC', 'Asia/Kolkata', 'Asia/Dubai', 'Europe/London'],
        ]);
    }

    public function update(UpdateBusinessSettingRequest $request)
    {
        $this->service->update(
            $request->validated(),
            $request->file('logo'),
            $request->boolean('remove_logo')
        );

        return back()->with('success', 'Business settings updated successfully.');
    }
}

<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\StoreAddressRequest;
use App\Models\CustomerAddress;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AddressController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Customer/Addresses/Index', ['addresses' => $request->user()->customerAddresses()->latest('is_default')->latest()->get()]);
    }

    public function store(StoreAddressRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            if ($request->boolean('is_default')) $request->user()->customerAddresses()->update(['is_default' => false]);
            $request->user()->customerAddresses()->create($request->validated());
        });
        return back()->with('success', 'Address saved successfully.');
    }

    public function update(StoreAddressRequest $request, CustomerAddress $address): RedirectResponse
    {
        abort_unless($address->user_id === $request->user()->id, 403);
        DB::transaction(function () use ($request, $address) {
            if ($request->boolean('is_default')) $request->user()->customerAddresses()->whereKeyNot($address->id)->update(['is_default' => false]);
            $address->update($request->validated());
        });
        return back()->with('success', 'Address updated successfully.');
    }

    public function destroy(Request $request, CustomerAddress $address): RedirectResponse
    {
        abort_unless($address->user_id === $request->user()->id, 403);
        $address->delete();
        return back()->with('success', 'Address removed.');
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    /**
     * Display a listing of purchases.
     */
    public function index()
    {
        $purchases = Purchase::with([
                'supplier',
                'user'
            ])
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Purchases/Index', [

            'auth' => [
                'user' => auth()->user(),
            ],

            'purchases' => $purchases,

        ]);
    }

    /**
     * Show create purchase form.
     */
    public function create()
    {
        return Inertia::render('Admin/Purchases/Create', [

            'auth' => [
                'user' => auth()->user(),
            ],

            'suppliers' => Supplier::where('status', true)
                ->orderBy('name')
                ->get(),

            'products' => Product::where('status', true)
                ->orderBy('name')
                ->get(),

        ]);
    }

    /**
     * Store purchase.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Show purchase.
     */
    public function show(Purchase $purchase)
    {
        //
    }

    /**
     * Edit purchase.
     */
    public function edit(Purchase $purchase)
    {
        //
    }

    /**
     * Update purchase.
     */
    public function update(Request $request, Purchase $purchase)
    {
        //
    }

    /**
     * Delete purchase.
     */
    public function destroy(Purchase $purchase)
    {
        //
    }
}
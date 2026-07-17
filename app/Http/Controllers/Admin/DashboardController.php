<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display Admin Dashboard
     */
    public function index(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'products'   => 0,
                'categories' => 0,
                'brands'     => 0,
                'orders'     => 0,
                'customers'  => 0,
            ],
        ]);
    }
}
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Dashboard', [

            'auth' => [
                'user' => auth()->user(),
            ],

            'stats' => [
                'products'   => Product::count(),
                'categories' => Category::count(),
                'brands'     => Brand::count(),
                'orders'     => 0,
                'customers'  => User::count(),
            ],

        ]);
    }
}
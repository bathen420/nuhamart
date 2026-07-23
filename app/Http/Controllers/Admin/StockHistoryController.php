<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StockHistory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockHistoryController extends Controller
{
    public function index()
    {
        $histories = StockHistory::with([
                'product',
                'user'
            ])
            ->latest()
            ->paginate(20);

        return Inertia::render(
            'Admin/StockHistory/Index',
            [
                'auth' => [
                    'user' => auth()->user(),
                ],

                'histories' => $histories,
            ]
        );
    }
}
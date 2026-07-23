<?php

use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\StockHistoryController;
use App\Http\Controllers\Admin\SupplierController;
use App\Http\Controllers\Admin\PurchaseController;

/*
|--------------------------------------------------------------------------
| Frontend
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'        => Route::has('login'),
        'canRegister'     => Route::has('register'),
        'laravelVersion'  => Application::VERSION,
        'phpVersion'      => PHP_VERSION,
    ]);
})->name('home');

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->prefix('admin')->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('admin.dashboard');

        Route::resource('categories', CategoryController::class);

        Route::resource('brands', BrandController::class);

        Route::resource('products', ProductController::class);

        Route::resource('orders', OrderController::class);

        Route::resource('purchases', PurchaseController::class);


        Route::get(
            'stock-history',
            [StockHistoryController::class, 'index']
        )->name('stock-history.index');


        Route::get(
            'orders/{order}/pdf',
            [OrderController::class, 'download']
        )->name('orders.pdf');


        Route::resource('suppliers', SupplierController::class);


        });

/*
|--------------------------------------------------------------------------
| Profile
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {

    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');

    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');

    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');

});

    Route::get('/dashboard', function () {
            return redirect()->route('admin.dashboard');
        })->middleware(['auth', 'verified'])->name('dashboard');

require __DIR__.'/auth.php';
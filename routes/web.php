<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\ProfileController;

use App\Http\Controllers\Admin\CustomerController;

use App\Http\Controllers\Checkout\OrderController as CheckoutOrderController;

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\SupplierController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\PurchaseController;
use App\Http\Controllers\Admin\StockHistoryController;
use App\Http\Controllers\Admin\SaleController;
use App\Http\Controllers\Admin\POSController;


/*
|--------------------------------------------------------------------------
| Frontend
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

Route::get('/cart', function () {
    return Inertia::render('Cart/Index');
})->name('cart.index');

/*
|--------------------------------------------------------------------------
| Checkout
|--------------------------------------------------------------------------
*/

Route::get('/checkout', [CheckoutOrderController::class, 'create'])
    ->name('checkout.index');

Route::post('/checkout/place-order', [CheckoutOrderController::class, 'store'])
    ->name('checkout.store');

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        /*
        |--------------------------------------------------------------------------
        | Dashboard
        |--------------------------------------------------------------------------
        */

        Route::get('/dashboard', [DashboardController::class, 'index'])
            ->name('dashboard');

        /*
        |--------------------------------------------------------------------------
        | Catalogue
        |--------------------------------------------------------------------------
        */

        Route::resource('categories', CategoryController::class);

        Route::resource('brands', BrandController::class);

        Route::resource('products', ProductController::class);

        /*
        |--------------------------------------------------------------------------
        | Suppliers and Customers
        |--------------------------------------------------------------------------
        */

        Route::resource('suppliers', SupplierController::class);

        Route::resource('customers', CustomerController::class)
            ->except(['show']);

        /*
        |--------------------------------------------------------------------------
        | POS
        |--------------------------------------------------------------------------
        */

        Route::get('/pos', [POSController::class, 'index'])
            ->name('pos.create');

        Route::get(
            '/pos/search-products',
            [POSController::class, 'searchProducts']
        )->name('pos.search-products');

        Route::get(
            '/pos/search-customers',
            [POSController::class, 'searchCustomers']
        )->name('pos.search-customers');

        Route::post(
            '/pos/checkout',
            [POSController::class, 'checkout']
        )->name('pos.checkout');

        /*
        |--------------------------------------------------------------------------
        | Sales History
        |--------------------------------------------------------------------------
        */

        Route::get('/sales', [SaleController::class, 'index'])
            ->name('sales.index');

        Route::get('/sales/{sale}', [SaleController::class, 'show'])
            ->name('sales.show');

        Route::delete('/sales/{sale}', [SaleController::class, 'destroy'])
            ->name('sales.destroy');

        /*
        |--------------------------------------------------------------------------
        | Orders
        |--------------------------------------------------------------------------
        */

        Route::get(
            '/orders/{order}/pdf',
            [AdminOrderController::class, 'download']
        )->name('orders.pdf');

        Route::resource('orders', AdminOrderController::class);

        /*
        |--------------------------------------------------------------------------
        | Purchases
        |--------------------------------------------------------------------------
        */

        Route::get(
            '/purchases/{purchase}/pdf',
            [PurchaseController::class, 'downloadPdf']
        )->name('purchases.pdf');

        Route::resource('purchases', PurchaseController::class);

        /*
        |--------------------------------------------------------------------------
        | Stock History
        |--------------------------------------------------------------------------
        */

        Route::get(
            '/stock-history',
            [StockHistoryController::class, 'index']
        )->name('stock-history.index');
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

/*
|--------------------------------------------------------------------------
| Breeze Dashboard Redirect
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])
    ->get('/dashboard', function () {
        return redirect()->route('admin.dashboard');
    })
    ->name('dashboard');

require __DIR__ . '/auth.php';

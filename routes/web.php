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
use App\Http\Controllers\Admin\SaleReturnController;
use App\Http\Controllers\Admin\PurchaseReturnController;
use App\Http\Controllers\Admin\POSController;
use App\Http\Controllers\Admin\BusinessSettingController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\NotificationController;


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

Route::middleware(['auth', 'verified', 'active', 'activity'])
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
        | Sales Returns
        |--------------------------------------------------------------------------
        */

        Route::get(
            '/sales/{sale}/returns/create',
            [SaleReturnController::class, 'create']
        )->name('sales.returns.create');

        Route::post(
            '/sales/{sale}/returns',
            [SaleReturnController::class, 'store']
        )->name('sales.returns.store');

        Route::get('/sale-returns', [SaleReturnController::class, 'index'])
            ->name('sale-returns.index');

        Route::get('/sale-returns/{saleReturn}', [SaleReturnController::class, 'show'])
            ->name('sale-returns.show');

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

        Route::get('/purchases/{purchase}/returns/create', [PurchaseReturnController::class, 'create'])->name('purchases.returns.create');
        Route::post('/purchases/{purchase}/returns', [PurchaseReturnController::class, 'store'])->name('purchases.returns.store');
        Route::get('/purchase-returns', [PurchaseReturnController::class, 'index'])->name('purchase-returns.index');
        Route::get('/purchase-returns/{purchaseReturn}', [PurchaseReturnController::class, 'show'])->name('purchase-returns.show');

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

        /*
        |--------------------------------------------------------------------------
        | Business Settings
        |--------------------------------------------------------------------------
        */

        Route::get('/settings', [BusinessSettingController::class, 'edit'])
            ->name('settings.edit');

        Route::patch('/settings', [BusinessSettingController::class, 'update'])
            ->name('settings.update');

        Route::resource('users', UserController::class)->except(['show'])->middleware('permission:users.view');
        Route::resource('roles', RoleController::class)->except(['show'])->middleware('permission:roles.view');
        Route::get('/permissions', [PermissionController::class, 'index'])->middleware('permission:permissions.view')->name('permissions.index');

        Route::get('/activity-logs', [ActivityLogController::class, 'index'])->middleware('permission:activity-logs.view')->name('activity-logs.index');
        Route::get('/activity-logs/export', [ActivityLogController::class, 'export'])->middleware('permission:activity-logs.export')->name('activity-logs.export');


        Route::get('/notifications', [NotificationController::class, 'index'])
            ->middleware('permission:notifications.view')
            ->name('notifications.index');
        Route::patch('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])
            ->middleware('permission:notifications.view')
            ->name('notifications.read-all');
        Route::delete('/notifications/read', [NotificationController::class, 'destroyRead'])
            ->middleware('permission:notifications.delete')
            ->name('notifications.destroy-read');
        Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])
            ->middleware('permission:notifications.view')
            ->name('notifications.read');
        Route::patch('/notifications/{notification}/unread', [NotificationController::class, 'markAsUnread'])
            ->middleware('permission:notifications.view')
            ->name('notifications.unread');
        Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy'])
            ->middleware('permission:notifications.delete')
            ->name('notifications.destroy');
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

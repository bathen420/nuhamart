<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StorefrontController;

use App\Http\Controllers\Admin\CustomerController;

use App\Http\Controllers\Checkout\OrderController as CheckoutOrderController;
use App\Http\Controllers\Checkout\CouponController as CheckoutCouponController;
use App\Http\Controllers\Admin\CouponController as AdminCouponController;

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
use App\Http\Controllers\Admin\EnterprisePosController;
use App\Http\Controllers\Admin\BusinessSettingController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\NotificationController;
use App\Http\Controllers\Admin\WarehouseController;
use App\Http\Controllers\Admin\CustomerGroupController;
use App\Http\Controllers\Admin\SupplierGroupController;
use App\Http\Controllers\Admin\OpeningStockController;
use App\Http\Controllers\Admin\StockAdjustmentController;
use App\Http\Controllers\Admin\StockTransferController;
use App\Http\Controllers\Admin\StockLedgerController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\InvoiceController;
use App\Http\Controllers\Admin\AccountController;
use App\Http\Controllers\Admin\JournalEntryController;
use App\Http\Controllers\Admin\GeneralLedgerController;
use App\Http\Controllers\Admin\FinancialStatementController;
use App\Http\Controllers\Admin\PurchaseRequisitionController;
use App\Http\Controllers\Admin\PurchaseOrderController;
use App\Http\Controllers\Admin\GoodsReceiptController;
use App\Http\Controllers\Admin\SupplierStatementController;
use App\Http\Controllers\Admin\BarcodeLabelController;
use App\Http\Controllers\Admin\CrmController;
use App\Http\Controllers\Admin\GiftVoucherController;
use App\Http\Controllers\Admin\AuthorController;
use App\Http\Controllers\Admin\PublisherController;
use App\Http\Controllers\Admin\HomepageContentController;
use App\Http\Controllers\Customer\AccountController as CustomerAccountController;
use App\Http\Controllers\Customer\AddressController as CustomerAddressController;
use App\Http\Controllers\Storefront\TrackOrderController;
use App\Http\Controllers\Admin\OrderWorkflowController;
use App\Http\Controllers\Storefront\SeoController;


/*
|--------------------------------------------------------------------------
| Frontend
|--------------------------------------------------------------------------
*/
use App\Http\Controllers\Admin\UnitController;
use App\Http\Controllers\Admin\ProductVariantController;

Route::get('/language/{locale}', function (string $locale) {
    abort_unless(in_array($locale, ['en', 'bn'], true), 404);
    session(['locale' => $locale]);
    return back();
})->name('language.switch');

Route::get('/', [StorefrontController::class, 'home'])->name('home');
Route::get('/sitemap.xml', [SeoController::class, 'sitemap'])->name('seo.sitemap');
Route::get('/shop', [StorefrontController::class, 'catalog'])->name('storefront.catalog');
Route::get('/search/suggestions', [StorefrontController::class, 'suggestions'])->middleware('throttle:90,1')->name('storefront.search.suggestions');
Route::get('/products/{product:slug}', [StorefrontController::class, 'show'])->name('storefront.products.show');
Route::get('/authors/{author:slug}', [StorefrontController::class, 'author'])->name('storefront.author');
Route::get('/publishers/{publisher:slug}', [StorefrontController::class, 'publisher'])->name('storefront.publisher');

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

Route::post('/checkout/coupon/validate', CheckoutCouponController::class)->middleware('throttle:30,1')->name('checkout.coupon.validate');

Route::post('/checkout/place-order', [CheckoutOrderController::class, 'store'])
    ->name('checkout.store');

Route::get('/checkout/success/{orderNo}', [CheckoutOrderController::class, 'success'])
    ->name('checkout.success');


/*
|--------------------------------------------------------------------------
| Customer account and order tracking
|--------------------------------------------------------------------------
*/
Route::get('/track-order', [TrackOrderController::class, 'index'])->name('orders.track');
Route::post('/track-order', [TrackOrderController::class, 'search'])->middleware('throttle:20,1')->name('orders.track.search');

Route::middleware(['auth', 'verified'])->prefix('account')->name('customer.')->group(function () {
    Route::get('/', [CustomerAccountController::class, 'dashboard'])->name('dashboard');
    Route::get('/orders', [CustomerAccountController::class, 'orders'])->name('orders.index');
    Route::get('/orders/{order}', [CustomerAccountController::class, 'show'])->name('orders.show');
    Route::get('/addresses', [CustomerAddressController::class, 'index'])->name('addresses.index');
    Route::post('/addresses', [CustomerAddressController::class, 'store'])->name('addresses.store');
    Route::put('/addresses/{address}', [CustomerAddressController::class, 'update'])->name('addresses.update');
    Route::delete('/addresses/{address}', [CustomerAddressController::class, 'destroy'])->name('addresses.destroy');
});

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified', 'active', 'activity', \App\Http\Middleware\EnforceAdminPermission::class])
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
        Route::resource('authors', AuthorController::class)->except(['show']);
        Route::resource('publishers', PublisherController::class)->except(['show']);

        Route::resource('marketing/coupons', AdminCouponController::class)->only(['index','store','update','destroy'])->names('marketing.coupons');

        Route::get('homepage-content', [HomepageContentController::class, 'index'])->name('homepage-content.index');
        Route::put('homepage-content/settings', [HomepageContentController::class, 'updateSettings'])->name('homepage-content.settings.update');
        Route::post('homepage-content/banners', [HomepageContentController::class, 'storeBanner'])->name('homepage-content.banners.store');
        Route::put('homepage-content/banners/{banner}', [HomepageContentController::class, 'updateBanner'])->name('homepage-content.banners.update');
        Route::delete('homepage-content/banners/{banner}', [HomepageContentController::class, 'destroyBanner'])->name('homepage-content.banners.destroy');
        Route::post('homepage-content/promotions', [HomepageContentController::class, 'storePromotion'])->name('homepage-content.promotions.store');
        Route::put('homepage-content/promotions/{promotion}', [HomepageContentController::class, 'updatePromotion'])->name('homepage-content.promotions.update');
        Route::delete('homepage-content/promotions/{promotion}', [HomepageContentController::class, 'destroyPromotion'])->name('homepage-content.promotions.destroy');

        Route::resource('warehouses', WarehouseController::class)
            ->except(['show']);

        Route::resource('customer-groups', CustomerGroupController::class)->except(['show']);
        Route::resource('supplier-groups', SupplierGroupController::class)->except(['show']);

        Route::resource('products', ProductController::class);
        Route::get('/barcode-labels', [BarcodeLabelController::class, 'index'])
            
            ->name('barcode-labels.index');
        Route::post('/barcode-labels/generate', [BarcodeLabelController::class, 'generate'])
            
            ->name('barcode-labels.generate');
        Route::get('/barcode-labels/print', [BarcodeLabelController::class, 'print'])
            
            ->name('barcode-labels.print');

        Route::resource('units', UnitController::class)->except(['show']);
        Route::resource('product-variants', ProductVariantController::class)->except(['show']);
        Route::post('product-variants/labels', [ProductVariantController::class, 'labels'])->name('product-variants.labels');

        Route::resource('opening-stocks', OpeningStockController::class)->only(['index','create','store','show']);

        Route::resource('stock-adjustments', StockAdjustmentController::class)->only(['index','create','store','show']);
        Route::patch('stock-adjustments/{stockAdjustment}/approve', [StockAdjustmentController::class, 'approve'])->name('stock-adjustments.approve');
        Route::resource('stock-transfers', StockTransferController::class)->only(['index','create','store','show']);
        Route::patch('stock-transfers/{stockTransfer}/dispatch', [StockTransferController::class, 'dispatch'])->name('stock-transfers.dispatch');
        Route::patch('stock-transfers/{stockTransfer}/receive', [StockTransferController::class, 'receive'])->name('stock-transfers.receive');
        Route::get('stock-ledger', [StockLedgerController::class, 'index'])->name('stock-ledger.index');


        /*
        |--------------------------------------------------------------------------
        | Accounts Core
        |--------------------------------------------------------------------------
        */

        Route::resource('accounts', AccountController::class)->except(['show']);
        Route::resource('journals', JournalEntryController::class)->only(['index', 'create', 'store', 'show']);
        Route::get('general-ledger', [GeneralLedgerController::class, 'index'])->name('ledger.index');

        /*
        |--------------------------------------------------------------------------
        | Financial Statements
        |--------------------------------------------------------------------------
        */
        Route::get('financial-statements', [FinancialStatementController::class, 'dashboard'])
            ->name('financial-statements.dashboard');
        Route::get('financial-statements/trial-balance', [FinancialStatementController::class, 'trialBalance'])
            ->name('financial-statements.trial-balance');
        Route::get('financial-statements/profit-loss', [FinancialStatementController::class, 'profitLoss'])
            ->name('financial-statements.profit-loss');
        Route::get('financial-statements/balance-sheet', [FinancialStatementController::class, 'balanceSheet'])
            ->name('financial-statements.balance-sheet');
        Route::get('financial-statements/cash-flow', [FinancialStatementController::class, 'cashFlow'])
            ->name('financial-statements.cash-flow');
        Route::get('financial-statements/export/{statement}', [FinancialStatementController::class, 'export'])
            ->name('financial-statements.export');


        /*
        |--------------------------------------------------------------------------
        | Suppliers and Customers
        |--------------------------------------------------------------------------
        */

        Route::resource('suppliers', SupplierController::class);

        Route::resource('customers', CustomerController::class)
            ->except(['show']);

        Route::get('/crm', [CrmController::class, 'index'])->name('crm.index');
        Route::get('/crm/customers/{customer}', [CrmController::class, 'show'])->name('crm.show');
        Route::post('/crm/customers/{customer}/points', [CrmController::class, 'points'])->name('crm.points');
        Route::post('/crm/customers/{customer}/wallet', [CrmController::class, 'wallet'])->name('crm.wallet');
        Route::post('/crm/customers/{customer}/notes', [CrmController::class, 'note'])->name('crm.notes');
        Route::resource('gift-vouchers', GiftVoucherController::class)->only(['index','store','destroy']);

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

        Route::get('/pos/shifts', [EnterprisePosController::class, 'shifts'])->name('pos.shifts');
        Route::post('/pos/shifts/open', [EnterprisePosController::class, 'open'])->name('pos.shifts.open');
        Route::post('/pos/shifts/{shift}/close', [EnterprisePosController::class, 'close'])->name('pos.shifts.close');
        Route::get('/pos/shifts/{shift}/report', [EnterprisePosController::class, 'report'])->name('pos.shifts.report');
        Route::post('/pos/shifts/{shift}/drawer', [EnterprisePosController::class, 'drawer'])->name('pos.drawer');
        Route::get('/pos/holds', [EnterprisePosController::class, 'holds'])->name('pos.holds');
        Route::post('/pos/hold', [EnterprisePosController::class, 'hold'])->name('pos.hold');
        Route::get('/pos/holds/{heldSale}/resume', [EnterprisePosController::class, 'resume'])->name('pos.holds.resume');
        Route::delete('/pos/holds/{heldSale}', [EnterprisePosController::class, 'destroyHold'])->name('pos.holds.destroy');

        /*
        |--------------------------------------------------------------------------
        | Sales History
        |--------------------------------------------------------------------------
        */

        Route::get('/sales', [SaleController::class, 'index'])
            ->name('sales.index');

        Route::get('/sales/{sale}/invoice', [InvoiceController::class, 'a4'])
            ->name('invoices.a4');

        Route::get('/sales/{sale}/invoice/thermal', [InvoiceController::class, 'thermal'])
            ->name('invoices.thermal');

        Route::get('/sales/{sale}/invoice/pdf', [InvoiceController::class, 'pdf'])
            ->name('invoices.pdf');

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
        Route::patch('orders/{order}/workflow', [OrderWorkflowController::class, 'update'])->name('orders.workflow.update');


        /* Purchase Management Pro */
        Route::resource('purchase-requisitions', PurchaseRequisitionController::class)->only(['index','create','store','show']);
        Route::post('/purchase-requisitions/{purchaseRequisition}/approve', [PurchaseRequisitionController::class, 'approve'])->name('purchase-requisitions.approve');
        Route::resource('purchase-orders', PurchaseOrderController::class)->only(['index','create','store','show']);
        Route::post('/purchase-orders/{purchaseOrder}/approve', [PurchaseOrderController::class, 'approve'])->name('purchase-orders.approve');
        Route::get('/purchase-orders/{purchaseOrder}/goods-receipts/create', [GoodsReceiptController::class, 'create'])->name('purchase-orders.goods-receipts.create');
        Route::post('/purchase-orders/{purchaseOrder}/goods-receipts', [GoodsReceiptController::class, 'store'])->name('purchase-orders.goods-receipts.store');
        Route::get('/goods-receipts', [GoodsReceiptController::class, 'index'])->name('goods-receipts.index');
        Route::get('/goods-receipts/{goodsReceipt}', [GoodsReceiptController::class, 'show'])->name('goods-receipts.show');
        Route::get('/supplier-statements', [SupplierStatementController::class, 'index'])->name('supplier-statements.index');
        Route::get('/supplier-statements/{supplier}', [SupplierStatementController::class, 'show'])->name('supplier-statements.show');

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
        | Reports
        |--------------------------------------------------------------------------
        */

        Route::get('/reports', [ReportController::class, 'index'])
            
            ->name('reports.index');

        Route::get('/reports/sales', [ReportController::class, 'sales'])
            
            ->name('reports.sales');

        Route::get('/reports/sales/print', [ReportController::class, 'salesPrint'])
            
            ->name('reports.sales.print');

        Route::get('/reports/sales/export', [ReportController::class, 'salesExport'])
            
            ->name('reports.sales.export');

        Route::get('/reports/sales/export-excel', [ReportController::class, 'salesExcelExport'])
            
            ->name('reports.sales.export-excel');

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

        Route::resource('users', UserController::class)->except(['show']);
        Route::resource('roles', RoleController::class)->except(['show']);
        Route::get('/permissions', [PermissionController::class, 'index'])->name('permissions.index');

        Route::get('/activity-logs', [ActivityLogController::class, 'index'])->name('activity-logs.index');
        Route::get('/activity-logs/export', [ActivityLogController::class, 'export'])->name('activity-logs.export');


        Route::get('/notifications', [NotificationController::class, 'index'])
            
            ->name('notifications.index');
        Route::patch('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])
            
            ->name('notifications.read-all');
        Route::delete('/notifications/read', [NotificationController::class, 'destroyRead'])
            
            ->name('notifications.destroy-read');
        Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])
            
            ->name('notifications.read');
        Route::patch('/notifications/{notification}/unread', [NotificationController::class, 'markAsUnread'])
            
            ->name('notifications.unread');
        Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy'])
            
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

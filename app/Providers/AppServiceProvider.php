<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\Facades\Gate;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Support\Facades\Event;
use App\Services\ActivityLogService;
use Illuminate\Support\ServiceProvider;
use App\Repositories\Notification\NotificationRepository;
use App\Repositories\Notification\NotificationRepositoryInterface;
use App\Repositories\Warehouse\WarehouseRepository;
use App\Repositories\Warehouse\WarehouseRepositoryInterface;
use App\Repositories\CustomerGroup\CustomerGroupRepository;
use App\Repositories\CustomerGroup\CustomerGroupRepositoryInterface;
use App\Repositories\SupplierGroup\SupplierGroupRepository;
use App\Repositories\SupplierGroup\SupplierGroupRepositoryInterface;
use App\Repositories\OpeningStock\OpeningStockRepository;
use App\Repositories\OpeningStock\OpeningStockRepositoryInterface;
use App\Repositories\StockAdjustment\StockAdjustmentRepository;
use App\Repositories\StockAdjustment\StockAdjustmentRepositoryInterface;
use App\Repositories\StockTransfer\StockTransferRepository;
use App\Repositories\StockTransfer\StockTransferRepositoryInterface;
use App\Repositories\StockLedger\StockLedgerRepository;
use App\Repositories\StockLedger\StockLedgerRepositoryInterface;
use App\Repositories\Unit\UnitRepository;
use App\Repositories\Unit\UnitRepositoryInterface;
use App\Repositories\ProductVariant\ProductVariantRepository;
use App\Repositories\ProductVariant\ProductVariantRepositoryInterface;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(NotificationRepositoryInterface::class, NotificationRepository::class);
        $this->app->bind(WarehouseRepositoryInterface::class, WarehouseRepository::class);
        $this->app->bind(CustomerGroupRepositoryInterface::class, CustomerGroupRepository::class);
        $this->app->bind(SupplierGroupRepositoryInterface::class, SupplierGroupRepository::class);
        $this->app->bind(OpeningStockRepositoryInterface::class, OpeningStockRepository::class);
        $this->app->bind(StockAdjustmentRepositoryInterface::class, StockAdjustmentRepository::class);
        $this->app->bind(StockTransferRepositoryInterface::class, StockTransferRepository::class);
        $this->app->bind(StockLedgerRepositoryInterface::class, StockLedgerRepository::class);
        $this->app->bind(UnitRepositoryInterface::class, UnitRepository::class);
        $this->app->bind(ProductVariantRepositoryInterface::class, ProductVariantRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Event::listen(Login::class, function (Login $event): void {
            app(ActivityLogService::class)->record('authentication', 'login', $event->user->name . ' logged in', $event->user, request());
        });

        Event::listen(Logout::class, function (Logout $event): void {
            if ($event->user) {
                app(ActivityLogService::class)->record('authentication', 'logout', $event->user->name . ' logged out', $event->user, request());
            }
        });

        Gate::before(fn ($user, $ability) => $user->hasRole('Super Admin') ? true : null);
        Vite::prefetch(concurrency: 3);
    }
}

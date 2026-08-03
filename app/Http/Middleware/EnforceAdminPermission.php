<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnforceAdminPermission
{
    /**
     * Enforce a permission for every named admin route.
     *
     * The mapping is intentionally centralized so new admin routes cannot
     * silently bypass authorization. Super Admin remains an explicit bypass.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            abort(401);
        }

        if ($user->hasRole('Super Admin')) {
            return $next($request);
        }

        $routeName = (string) optional($request->route())->getName();
        $permission = self::permissionForRouteName($routeName);

        if ($permission === null) {
            abort(403, 'This admin route has no permission mapping.');
        }

        abort_unless($user->can($permission), 403);

        return $next($request);
    }

    public static function permissionForRouteName(?string $routeName): ?string
    {
        if (! $routeName || ! str_starts_with($routeName, 'admin.')) {
            return null;
        }

        $name = substr($routeName, 6);

        $exact = [
            'dashboard' => 'dashboard.view',
            'marketing.coupons.index' => 'marketing.view',
            'marketing.coupons.store' => 'marketing.manage',
            'marketing.coupons.update' => 'marketing.manage',
            'marketing.coupons.destroy' => 'marketing.manage',
            'homepage-content.index' => 'homepage-content.view',
            'homepage-content.settings.update' => 'homepage-content.manage',
            'homepage-content.banners.store' => 'homepage-content.manage',
            'homepage-content.banners.update' => 'homepage-content.manage',
            'homepage-content.banners.destroy' => 'homepage-content.manage',
            'homepage-content.promotions.store' => 'homepage-content.manage',
            'homepage-content.promotions.update' => 'homepage-content.manage',
            'homepage-content.promotions.destroy' => 'homepage-content.manage',
            'barcode-labels.index' => 'barcode-labels.view',
            'barcode-labels.generate' => 'barcode-labels.generate',
            'barcode-labels.print' => 'barcode-labels.print',
            'product-variants.labels' => 'product-variants.print',
            'stock-adjustments.approve' => 'stock-adjustments.approve',
            'stock-transfers.dispatch' => 'stock-transfers.dispatch',
            'stock-transfers.receive' => 'stock-transfers.receive',
            'stock-ledger.index' => 'stock-ledger.view',
            'ledger.index' => 'ledger.view',
            'financial-statements.dashboard' => 'financial-statements.view',
            'financial-statements.trial-balance' => 'financial-statements.view',
            'financial-statements.profit-loss' => 'financial-statements.view',
            'financial-statements.balance-sheet' => 'financial-statements.view',
            'financial-statements.cash-flow' => 'financial-statements.view',
            'financial-statements.export' => 'financial-statements.export',
            'crm.index' => 'crm.view',
            'crm.show' => 'crm.view',
            'crm.points' => 'loyalty.manage',
            'crm.wallet' => 'wallet.manage',
            'crm.notes' => 'crm.manage',
            'pos.create' => 'pos.view',
            'pos.search-products' => 'pos.view',
            'pos.search-customers' => 'pos.view',
            'pos.checkout' => 'pos.create',
            'pos.shifts' => 'pos.manage-shifts',
            'pos.shifts.open' => 'pos.manage-shifts',
            'pos.shifts.close' => 'pos.manage-shifts',
            'pos.shifts.report' => 'pos.view-reports',
            'pos.holds' => 'pos.view',
            'pos.hold' => 'pos.hold',
            'pos.holds.resume' => 'pos.view',
            'pos.holds.destroy' => 'pos.hold',
            'pos.drawer' => 'pos.manage-drawer',
            'sales.index' => 'sales.view',
            'sales.show' => 'sales.view',
            'sales.destroy' => 'sales.delete',
            'invoices.a4' => 'sales.print',
            'invoices.thermal' => 'sales.print',
            'invoices.pdf' => 'sales.print',
            'sales.returns.create' => 'sale-returns.create',
            'sales.returns.store' => 'sale-returns.create',
            'sale-returns.index' => 'sale-returns.view',
            'sale-returns.show' => 'sale-returns.view',
            'orders.pdf' => 'orders.print',
            'orders.workflow.update' => 'orders.edit',
            'orders.courier-consignments.store' => 'couriers.manage',
            'courier-consignments.sync' => 'couriers.manage',
            'purchase-requisitions.approve' => 'purchase-requisitions.approve',
            'purchase-orders.approve' => 'purchase-orders.approve',
            'purchase-orders.goods-receipts.create' => 'goods-receipts.create',
            'purchase-orders.goods-receipts.store' => 'goods-receipts.create',
            'goods-receipts.index' => 'goods-receipts.view',
            'goods-receipts.show' => 'goods-receipts.view',
            'supplier-statements.index' => 'supplier-statements.view',
            'supplier-statements.show' => 'supplier-statements.view',
            'purchases.pdf' => 'purchases.print',
            'purchases.returns.create' => 'purchase-returns.create',
            'purchases.returns.store' => 'purchase-returns.create',
            'purchase-returns.index' => 'purchase-returns.view',
            'purchase-returns.show' => 'purchase-returns.view',
            'reports.index' => 'reports.view',
            'reports.sales' => 'reports.view',
            'reports.sales.print' => 'reports.view',
            'reports.sales.export' => 'reports.export',
            'reports.sales.export-excel' => 'reports.export',
            'stock-history.index' => 'stock-history.view',
            'settings.edit' => 'settings.view',
            'settings.update' => 'settings.edit',
            'permissions.index' => 'permissions.view',
            'activity-logs.index' => 'activity-logs.view',
            'activity-logs.export' => 'activity-logs.export',
            'notifications.index' => 'notifications.view',
            'notifications.read-all' => 'notifications.view',
            'notifications.read' => 'notifications.view',
            'notifications.unread' => 'notifications.view',
            'notifications.destroy-read' => 'notifications.delete',
            'notifications.destroy' => 'notifications.delete',
        ];

        if (isset($exact[$name])) {
            return $exact[$name];
        }

        $resources = [
            'categories' => 'categories',
            'brands' => 'brands',
            'authors' => 'authors',
            'publishers' => 'publishers',
            'warehouses' => 'warehouses',
            'customer-groups' => 'customer-groups',
            'supplier-groups' => 'supplier-groups',
            'products' => 'products',
            'units' => 'units',
            'product-variants' => 'product-variants',
            'opening-stocks' => 'opening-stocks',
            'stock-adjustments' => 'stock-adjustments',
            'stock-transfers' => 'stock-transfers',
            'accounts' => 'accounts',
            'journals' => 'journals',
            'suppliers' => 'suppliers',
            'customers' => 'customers',
            'gift-vouchers' => 'vouchers',
            'orders' => 'orders',
            'purchase-requisitions' => 'purchase-requisitions',
            'purchase-orders' => 'purchase-orders',
            'purchases' => 'purchases',
            'users' => 'users',
            'roles' => 'roles',
        ];

        foreach ($resources as $routePrefix => $permissionPrefix) {
            if (! str_starts_with($name, $routePrefix.'.')) {
                continue;
            }

            $action = substr($name, strlen($routePrefix) + 1);
            $permissionAction = match ($action) {
                'index', 'show' => 'view',
                'create', 'store' => 'create',
                'edit', 'update' => 'edit',
                'destroy' => 'delete',
                default => null,
            };

            return $permissionAction ? $permissionPrefix.'.'.$permissionAction : null;
        }

        return null;
    }
}

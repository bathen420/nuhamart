import { usePage } from "@inertiajs/react";

import {
    LayoutDashboard,
    FolderTree,
    Tags,
    Package,
    ShoppingBag,
    Truck,
    ShoppingCart,
    History,
    Users,
    MonitorSmartphone,
    RotateCcw,
    Settings,
    ShieldCheck,
    UserCog,
    KeyRound,
    ScrollText,
    Bell,
    Warehouse,
    Boxes,
} from "lucide-react";

import AdminMenuItem from "./AdminMenuItem";

export default function AdminSidebar() {
    const page = usePage();
    const businessSettings = page.props.businessSettings || {};
    const permissions = page.props.auth?.permissions || [];
    const roles = page.props.auth?.roles || [];

    const can = (permission) =>
        roles.includes("Super Admin") || permissions.includes(permission);

    return (
        <aside className="min-h-screen w-64 border-r bg-white">
            {/* Logo */}
            <div className="border-b p-5">
                <div className="flex items-center gap-3">
                    {businessSettings.logo ? (
                        <img
                            src={businessSettings.logo}
                            alt={businessSettings.company_name || "Company logo"}
                            className="h-12 w-12 rounded-xl border bg-white object-contain p-1"
                        />
                    ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-black text-white">
                            {(businessSettings.company_name || "N")
                                .charAt(0)
                                .toUpperCase()}
                        </div>
                    )}

                    <div className="min-w-0">
                        <h1 className="truncate text-xl font-bold text-blue-700">
                            {businessSettings.company_name || "NuhaMart"}
                        </h1>
                        <p className="truncate text-xs text-gray-500">
                            {businessSettings.company_tagline ||
                                "Inventory & POS System"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Menu */}
            <nav className="space-y-2 p-4">
                {can("dashboard.view") && (
                    <AdminMenuItem
                        href={route("admin.dashboard")}
                        active={page.url.startsWith("/admin/dashboard")}
                        icon={LayoutDashboard}
                    >
                        Dashboard
                    </AdminMenuItem>
                )}

                {can("categories.view") && (
                    <AdminMenuItem
                        href={route("admin.categories.index")}
                        active={page.url.startsWith("/admin/categories")}
                        icon={FolderTree}
                    >
                        Categories
                    </AdminMenuItem>
                )}

                {can("brands.view") && (
                    <AdminMenuItem
                        href={route("admin.brands.index")}
                        active={page.url.startsWith("/admin/brands")}
                        icon={Tags}
                    >
                        Brands
                    </AdminMenuItem>
                )}

                {can("warehouses.view") && (
                    <AdminMenuItem
                        href={route("admin.warehouses.index")}
                        active={page.url.startsWith("/admin/warehouses")}
                        icon={Warehouse}
                    >
                        Warehouses
                    </AdminMenuItem>
                )}

                {can("customer-groups.view") && (
                    <AdminMenuItem
                        href={route("admin.customer-groups.index")}
                        active={page.url.startsWith("/admin/customer-groups")}
                        icon={Users}
                    >
                        Customer Groups
                    </AdminMenuItem>
                )}

                {can("supplier-groups.view") && (
                    <AdminMenuItem
                        href={route("admin.supplier-groups.index")}
                        active={page.url.startsWith("/admin/supplier-groups")}
                        icon={Truck}
                    >
                        Supplier Groups
                    </AdminMenuItem>
                )}

                {can("products.view") && (
                    <AdminMenuItem
                        href={route("admin.products.index")}
                        active={page.url.startsWith("/admin/products")}
                        icon={Package}
                    >
                        Products
                    </AdminMenuItem>
                )}

                {can("units.view") && (
                    <AdminMenuItem
                        href={route("admin.units.index")}
                        active={page.url.startsWith("/admin/units")}
                        icon={Boxes}
                    >
                        Units
                    </AdminMenuItem>
                )}

                {can("product-variants.view") && (
                    <AdminMenuItem
                        href={route("admin.product-variants.index")}
                        active={page.url.startsWith("/admin/product-variants")}
                        icon={Boxes}
                    >
                        Product Variants
                    </AdminMenuItem>
                )}

                {can("customers.view") && (
                    <AdminMenuItem
                        href={route("admin.customers.index")}
                        active={page.url.startsWith("/admin/customers")}
                        icon={Users}
                    >
                        Customers
                    </AdminMenuItem>
                )}

                {can("suppliers.view") && (
                    <AdminMenuItem
                        href={route("admin.suppliers.index")}
                        active={page.url.startsWith("/admin/suppliers")}
                        icon={Truck}
                    >
                        Suppliers
                    </AdminMenuItem>
                )}

                {can("purchases.view") && (
                    <AdminMenuItem
                        href={route("admin.purchases.index")}
                        active={page.url.startsWith("/admin/purchases")}
                        icon={ShoppingCart}
                    >
                        Purchases
                    </AdminMenuItem>
                )}

                {can("purchase-returns.view") && (
                    <AdminMenuItem
                        href={route("admin.purchase-returns.index")}
                        active={page.url.startsWith("/admin/purchase-returns")}
                        icon={RotateCcw}
                    >
                        Purchase Returns
                    </AdminMenuItem>
                )}

                {can("pos.view") && (
                    <AdminMenuItem
                        href={route("admin.pos.create")}
                        active={page.url.startsWith("/admin/pos")}
                        icon={MonitorSmartphone}
                    >
                        POS
                    </AdminMenuItem>
                )}

                {can("orders.view") && (
                    <AdminMenuItem
                        href={route("admin.orders.index")}
                        active={page.url.startsWith("/admin/orders")}
                        icon={ShoppingBag}
                    >
                        Orders
                    </AdminMenuItem>
                )}

                {can("sales.view") && (
                    <AdminMenuItem
                        href={route("admin.sales.index")}
                        active={page.url.startsWith("/admin/sales")}
                        icon={ShoppingCart}
                    >
                        Sales
                    </AdminMenuItem>
                )}

                {can("sale-returns.view") && (
                    <AdminMenuItem
                        href={route("admin.sale-returns.index")}
                        active={page.url.startsWith("/admin/sale-returns")}
                        icon={RotateCcw}
                    >
                        Sales Returns
                    </AdminMenuItem>
                )}

                {can("opening-stocks.view") && (
                    <AdminMenuItem
                        href={route("admin.opening-stocks.index")}
                        active={page.url.startsWith("/admin/opening-stocks")}
                        icon={Boxes}
                    >
                        Opening Stock
                    </AdminMenuItem>
                )}

                {can("stock-adjustments.view") && (
                    <AdminMenuItem
                        href={route("admin.stock-adjustments.index")}
                        active={page.url.startsWith("/admin/stock-adjustments")}
                        icon={Boxes}
                    >
                        Stock Adjustments
                    </AdminMenuItem>
                )}

                {can("stock-transfers.view") && (
                    <AdminMenuItem
                        href={route("admin.stock-transfers.index")}
                        active={page.url.startsWith("/admin/stock-transfers")}
                        icon={Truck}
                    >
                        Stock Transfers
                    </AdminMenuItem>
                )}

                {can("stock-ledger.view") && (
                    <AdminMenuItem
                        href={route("admin.stock-ledger.index")}
                        active={page.url.startsWith("/admin/stock-ledger")}
                        icon={History}
                    >
                        Stock Ledger
                    </AdminMenuItem>
                )}

                {can("stock-history.view") && (
                    <AdminMenuItem
                        href={route("admin.stock-history.index")}
                        active={page.url.startsWith("/admin/stock-history")}
                        icon={History}
                    >
                        Stock History
                    </AdminMenuItem>
                )}

                {can("settings.view") && (
                    <AdminMenuItem
                        href={route("admin.settings.edit")}
                        active={page.url.startsWith("/admin/settings")}
                        icon={Settings}
                    >
                        Settings
                    </AdminMenuItem>
                )}

                {(can("users.view") ||
                    can("roles.view") ||
                    can("permissions.view") ||
                    can("activity-logs.view") ||
                    can("notifications.view")) && (
                    <div className="mt-5 border-t pt-4">
                        <p className="mb-2 px-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                            Administration
                        </p>

                        {can("users.view") && (
                            <AdminMenuItem
                                href={route("admin.users.index")}
                                active={page.url.startsWith("/admin/users")}
                                icon={UserCog}
                            >
                                Users
                            </AdminMenuItem>
                        )}

                        {can("roles.view") && (
                            <AdminMenuItem
                                href={route("admin.roles.index")}
                                active={page.url.startsWith("/admin/roles")}
                                icon={ShieldCheck}
                            >
                                Roles
                            </AdminMenuItem>
                        )}

                        {can("permissions.view") && (
                            <AdminMenuItem
                                href={route("admin.permissions.index")}
                                active={page.url.startsWith("/admin/permissions")}
                                icon={KeyRound}
                            >
                                Permissions
                            </AdminMenuItem>
                        )}

                        {can("activity-logs.view") && (
                            <AdminMenuItem
                                href={route("admin.activity-logs.index")}
                                active={page.url.startsWith("/admin/activity-logs")}
                                icon={ScrollText}
                            >
                                Activity Logs
                            </AdminMenuItem>
                        )}

                        {can("notifications.view") && (
                            <AdminMenuItem
                                href={route("admin.notifications.index")}
                                active={page.url.startsWith("/admin/notifications")}
                                icon={Bell}
                            >
                                Notifications
                            </AdminMenuItem>
                        )}
                    </div>
                )}
            </nav>
        </aside>
    );
}
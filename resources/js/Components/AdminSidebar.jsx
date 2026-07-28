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
} from "lucide-react";

import AdminMenuItem from "./AdminMenuItem";

export default function AdminSidebar() {
    const page = usePage();
    const businessSettings = page.props.businessSettings || {};

    return (
        <aside className="w-64 min-h-screen border-r bg-white">
            {/* Logo */}
            <div className="border-b p-5">
                <div className="flex items-center gap-3">
                    {businessSettings.logo ? (
                        <img src={businessSettings.logo} alt={businessSettings.company_name || "Company logo"} className="h-12 w-12 rounded-xl border bg-white object-contain p-1" />
                    ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-black text-white">
                            {(businessSettings.company_name || "N").charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="min-w-0">
                        <h1 className="truncate text-xl font-bold text-blue-700">
                            {businessSettings.company_name || "NuhaMart"}
                        </h1>
                        <p className="truncate text-xs text-gray-500">
                            {businessSettings.company_tagline || "Inventory & POS System"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Menu */}
            <nav className="space-y-2 p-4">
                <AdminMenuItem
                    href={route("admin.dashboard")}
                    active={page.url.startsWith("/admin/dashboard")}
                    icon={LayoutDashboard}
                >
                    Dashboard
                </AdminMenuItem>

                <AdminMenuItem
                    href={route("admin.categories.index")}
                    active={page.url.startsWith("/admin/categories")}
                    icon={FolderTree}
                >
                    Categories
                </AdminMenuItem>

                <AdminMenuItem
                    href={route("admin.brands.index")}
                    active={page.url.startsWith("/admin/brands")}
                    icon={Tags}
                >
                    Brands
                </AdminMenuItem>

                <AdminMenuItem
                    href={route("admin.products.index")}
                    active={page.url.startsWith("/admin/products")}
                    icon={Package}
                >
                    Products
                </AdminMenuItem>

                <AdminMenuItem
                    href={route("admin.customers.index")}
                    active={page.url.startsWith("/admin/customers")}
                    icon={Users}
                >
                    Customers
                </AdminMenuItem>

                <AdminMenuItem
                    href={route("admin.suppliers.index")}
                    active={page.url.startsWith("/admin/suppliers")}
                    icon={Truck}
                >
                    Suppliers
                </AdminMenuItem>

                <AdminMenuItem
                    href={route("admin.purchases.index")}
                    active={page.url.startsWith("/admin/purchases")}
                    icon={ShoppingCart}
                >
                    Purchases
                </AdminMenuItem>

                <AdminMenuItem
                    href={route("admin.purchase-returns.index")}
                    active={page.url.startsWith("/admin/purchase-returns")}
                    icon={RotateCcw}
                >
                    Purchase Returns
                </AdminMenuItem>

                <AdminMenuItem
                    href={route("admin.pos.create")}
                    active={page.url.startsWith("/admin/pos")}
                    icon={MonitorSmartphone}
                >
                    POS
                </AdminMenuItem>

                <AdminMenuItem
                    href={route("admin.orders.index")}
                    active={page.url.startsWith("/admin/orders")}
                    icon={ShoppingBag}
                >
                    Orders
                </AdminMenuItem>

                <AdminMenuItem
                    href={route("admin.sales.index")}
                    active={page.url.startsWith("/admin/sales")}
                    icon={ShoppingCart}
                >
                    Sales
                </AdminMenuItem>


                <AdminMenuItem
                    href={route("admin.sale-returns.index")}
                    active={page.url.startsWith("/admin/sale-returns")}
                    icon={RotateCcw}
                >
                    Sales Returns
                </AdminMenuItem>

                <AdminMenuItem
                    href={route("admin.stock-history.index")}
                    active={page.url.startsWith("/admin/stock-history")}
                    icon={History}
                >
                    Stock History
                </AdminMenuItem>

                <AdminMenuItem
                    href={route("admin.settings.edit")}
                    active={page.url.startsWith("/admin/settings")}
                    icon={Settings}
                >
                    Settings
                </AdminMenuItem>
            </nav>
        </aside>
    );
}
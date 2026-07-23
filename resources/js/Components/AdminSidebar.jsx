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
} from "lucide-react";

import AdminMenuItem from "./AdminMenuItem";

export default function AdminSidebar() {

    const page = usePage();

    return (

        <aside className="w-64 min-h-screen border-r bg-white">

            {/* Logo */}

            <div className="border-b p-6">

                <h1 className="text-2xl font-bold text-blue-700">
                    NuhaMart
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Inventory & POS System
                </p>

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
                    href={route("categories.index")}
                    active={page.url.startsWith("/admin/categories")}
                    icon={FolderTree}
                >
                    Categories
                </AdminMenuItem>

                <AdminMenuItem
                    href={route("brands.index")}
                    active={page.url.startsWith("/admin/brands")}
                    icon={Tags}
                >
                    Brands
                </AdminMenuItem>

                <AdminMenuItem
                    href={route("products.index")}
                    active={page.url.startsWith("/admin/products")}
                    icon={Package}
                >
                    Products
                </AdminMenuItem>

                <AdminMenuItem
                    href={route("suppliers.index")}
                    active={page.url.startsWith("/admin/suppliers")}
                    icon={Truck}
                >
                    Suppliers
                </AdminMenuItem>

                <AdminMenuItem
                    href={route("purchases.index")}
                    active={page.url.startsWith("/admin/purchases")}
                    icon={ShoppingCart}
                >
                    Purchases
                </AdminMenuItem>

                <AdminMenuItem
                    href={route("orders.index")}
                    active={page.url.startsWith("/admin/orders")}
                    icon={ShoppingBag}
                >
                    Orders
                </AdminMenuItem>

                <AdminMenuItem
                    href={route("stock-history.index")}
                    active={page.url.startsWith("/admin/stock-history")}
                    icon={History}
                >
                    Stock History
                </AdminMenuItem>

            </nav>

        </aside>

    );
}
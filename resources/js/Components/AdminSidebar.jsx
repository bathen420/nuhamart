
import { usePage } from "@inertiajs/react";

import {
    LayoutDashboard,
    FolderTree,
    Tags,
    Package,
} from "lucide-react";

import AdminMenuItem from "./AdminMenuItem";

export default function AdminSidebar() {
    const page = usePage();

    return (
        <aside className="w-64 bg-white border-r min-h-screen">

            <div className="p-6 text-2xl font-bold border-b">
                NuhaMart
            </div>

            <nav className="p-4 space-y-2">

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

            </nav>

        </aside>
    );
}
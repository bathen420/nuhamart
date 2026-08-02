import { usePage } from "@inertiajs/react";
import {
    Activity,
    BarChart3,
    Barcode,
    Bell,
    BookOpen,
    Boxes,
    FolderTree,
    History,
    KeyRound,
    LayoutDashboard,
    LayoutTemplate,
    Package,
    ScrollText,
    Settings,
    BadgePercent,
    ShieldCheck,
    ShoppingBag,
    ShoppingCart,
    Tags,
    Truck,
    UserCog,
    Users,
} from "lucide-react";

import AdminMenuItem from "./AdminMenuItem";

function normalizeNames(value) {
    if (!Array.isArray(value)) return [];

    return value
        .map((item) => {
            if (typeof item === "string") return item;
            if (item && typeof item === "object") return item.name ?? item.slug ?? null;
            return null;
        })
        .filter(Boolean);
}

export default function AdminSidebar() {
    const page = usePage();
    const props = page.props ?? {};
    const businessSettings = props.businessSettings ?? {};
    const auth = props.auth ?? {};

    const roleNames = normalizeNames(auth.roles ?? auth.user?.roles ?? []);
    const permissionNames = normalizeNames(
        auth.permissions ?? auth.user?.permissions ?? auth.user?.all_permissions ?? []
    );

    const isSuperAdmin = roleNames.some((role) =>
        ["super admin", "super-admin"].includes(role.toLowerCase())
    );

    const can = (permission) => {
        if (roleNames.length === 0 && permissionNames.length === 0) return true;
        return isSuperAdmin || permissionNames.includes(permission);
    };

    // Lean Commerce menu: advanced ERP routes remain available, but are hidden
    // from daily operations so the admin panel stays focused and fast to use.
    const commerceItems = [
        { label: "Dashboard", routeName: "admin.dashboard", urlPrefix: "/admin/dashboard", permission: "dashboard.view", icon: LayoutDashboard },
        { label: "Homepage & Banners", routeName: "admin.homepage-content.index", urlPrefix: "/admin/homepage-content", permission: "homepage-content.view", icon: LayoutTemplate },
        { label: "Marketing & Coupons", routeName: "admin.marketing.coupons.index", urlPrefix: "/admin/marketing", permission: "marketing.view", icon: BadgePercent },
        { label: "Orders", routeName: "admin.orders.index", urlPrefix: "/admin/orders", permission: "orders.view", icon: ShoppingBag },
        { label: "Products & Books", routeName: "admin.products.index", urlPrefix: "/admin/products", permission: "products.view", icon: Package },
        { label: "Categories", routeName: "admin.categories.index", urlPrefix: "/admin/categories", permission: "categories.view", icon: FolderTree },
        { label: "Authors", routeName: "admin.authors.index", urlPrefix: "/admin/authors", permission: "authors.view", icon: BookOpen },
        { label: "Publishers", routeName: "admin.publishers.index", urlPrefix: "/admin/publishers", permission: "publishers.view", icon: BookOpen },
        { label: "Brands", routeName: "admin.brands.index", urlPrefix: "/admin/brands", permission: "brands.view", icon: Tags },
        { label: "Customers", routeName: "admin.customers.index", urlPrefix: "/admin/customers", permission: "customers.view", icon: Users },
        { label: "Coupons & Gift Vouchers", routeName: "admin.gift-vouchers.index", urlPrefix: "/admin/gift-vouchers", permission: "vouchers.manage", icon: Tags },
        { label: "Inventory", routeName: "admin.stock-history.index", urlPrefix: "/admin/stock-history", permission: "stock-history.view", icon: Boxes },
        { label: "Stock Adjustments", routeName: "admin.stock-adjustments.index", urlPrefix: "/admin/stock-adjustments", permission: "stock-adjustments.view", icon: History },
        { label: "Barcode & Labels", routeName: "admin.barcode-labels.index", urlPrefix: "/admin/barcode-labels", permission: "barcode-labels.view", icon: Barcode },
        { label: "Purchases", routeName: "admin.purchases.index", urlPrefix: "/admin/purchases", permission: "purchases.view", icon: ShoppingCart },
        { label: "Suppliers", routeName: "admin.suppliers.index", urlPrefix: "/admin/suppliers", permission: "suppliers.view", icon: Truck },
        { label: "Reports", routeName: "admin.reports.index", urlPrefix: "/admin/reports", permission: "reports.view", icon: BarChart3 },
        { label: "Settings", routeName: "admin.settings.edit", urlPrefix: "/admin/settings", permission: "settings.view", icon: Settings },
    ];

    const administrationItems = [
        { label: "Users", routeName: "admin.users.index", urlPrefix: "/admin/users", permission: "users.view", icon: UserCog },
        { label: "Roles", routeName: "admin.roles.index", urlPrefix: "/admin/roles", permission: "roles.view", icon: ShieldCheck },
        { label: "Permissions", routeName: "admin.permissions.index", urlPrefix: "/admin/permissions", permission: "permissions.view", icon: KeyRound },
        { label: "Activity Logs", routeName: "admin.activity-logs.index", urlPrefix: "/admin/activity-logs", permission: "activity-logs.view", icon: Activity },
        { label: "Notifications", routeName: "admin.notifications.index", urlPrefix: "/admin/notifications", permission: "notifications.view", icon: Bell },
    ];

    const renderItems = (items) =>
        items
            .filter((item) => can(item.permission))
            .map((item) => (
                <AdminMenuItem
                    key={item.routeName}
                    href={route(item.routeName)}
                    active={page.url.startsWith(item.urlPrefix)}
                    icon={item.icon}
                >
                    {item.label}
                </AdminMenuItem>
            ));

    const visibleAdministrationItems = administrationItems.filter((item) => can(item.permission));

    return (
        <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
            <div className="shrink-0 border-b border-slate-200 px-5 py-5">
                <div className="flex items-center gap-3">
                    {businessSettings.logo ? (
                        <img
                            src={businessSettings.logo}
                            alt={businessSettings.company_name ?? "Nuha Mart BD"}
                            className="h-11 w-11 rounded-xl border border-slate-200 bg-white object-contain p-1"
                        />
                    ) : (
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-700 text-lg font-bold text-white">
                            {(businessSettings.company_name ?? "N").charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="min-w-0">
                        <h1 className="truncate text-lg font-bold text-teal-800">
                            {businessSettings.company_name ?? "Nuha Mart BD"}
                        </h1>
                        <p className="truncate text-xs text-slate-500">
                            {businessSettings.company_tagline ?? "Commerce Management"}
                        </p>
                    </div>
                </div>
            </div>

            <nav className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
                <p className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Commerce
                </p>
                <div className="space-y-1">{renderItems(commerceItems)}</div>

                {visibleAdministrationItems.length > 0 && (
                    <div className="mt-5 border-t border-slate-200 pt-4">
                        <p className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Administration
                        </p>
                        <div className="space-y-1">{renderItems(visibleAdministrationItems)}</div>
                    </div>
                )}
                <div className="h-6" />
            </nav>
        </aside>
    );
}

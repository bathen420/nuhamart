import { usePage } from "@inertiajs/react";
import {
    BarChart3,
    Wallet,
    TrendingUp,
    Scale,
    Landmark,
    Bell,
    Boxes,
    FolderTree,
    History,
    KeyRound,
    LayoutDashboard,
    MonitorSmartphone,
    Package,
    RotateCcw,
    ScrollText,
    Settings,
    ShieldCheck,
    ShoppingBag,
    ShoppingCart,
    Tags,
    Truck,
    UserCog,
    Users,
    Warehouse,
    BookOpen,
    PackageCheck,
    FileText,
    ClipboardList,
    Barcode,
} from "lucide-react";

import AdminMenuItem from "./AdminMenuItem";

function normalizeNames(value) {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map((item) => {
            if (typeof item === "string") {
                return item;
            }

            if (item && typeof item === "object") {
                return item.name ?? item.slug ?? null;
            }

            return null;
        })
        .filter(Boolean);
}

export default function AdminSidebar() {
    const page = usePage();
    const props = page.props ?? {};

    const businessSettings = props.businessSettings ?? {};
    const auth = props.auth ?? {};

    const roleNames = normalizeNames(
        auth.roles ??
            auth.user?.roles ??
            []
    );

    const permissionNames = normalizeNames(
        auth.permissions ??
            auth.user?.permissions ??
            auth.user?.all_permissions ??
            []
    );

    const isSuperAdmin = roleNames.some(
        (role) =>
            role.toLowerCase() === "super admin" ||
            role.toLowerCase() === "super-admin"
    );

    const can = (permission) => {
        /*
         * যদি backend কোনো permission data না পাঠায়,
         * sidebar সম্পূর্ণ লুকিয়ে না রেখে menu দেখানো হবে।
         */
        if (roleNames.length === 0 && permissionNames.length === 0) {
            return true;
        }

        return (
            isSuperAdmin ||
            permissionNames.includes(permission)
        );
    };

    const menuItems = [
        {
            label: "Dashboard",
            routeName: "admin.dashboard",
            urlPrefix: "/admin/dashboard",
            permission: "dashboard.view",
            icon: LayoutDashboard,
        },
        {
            label: "Categories",
            routeName: "admin.categories.index",
            urlPrefix: "/admin/categories",
            permission: "categories.view",
            icon: FolderTree,
        },
        {
            label: "Brands",
            routeName: "admin.brands.index",
            urlPrefix: "/admin/brands",
            permission: "brands.view",
            icon: Tags,
        },
        {
            label: "Warehouses",
            routeName: "admin.warehouses.index",
            urlPrefix: "/admin/warehouses",
            permission: "warehouses.view",
            icon: Warehouse,
        },
        {
            label: "Customer Groups",
            routeName: "admin.customer-groups.index",
            urlPrefix: "/admin/customer-groups",
            permission: "customer-groups.view",
            icon: Users,
        },
        {
            label: "Supplier Groups",
            routeName: "admin.supplier-groups.index",
            urlPrefix: "/admin/supplier-groups",
            permission: "supplier-groups.view",
            icon: Truck,
        },
        {
            label: "Products",
            routeName: "admin.products.index",
            urlPrefix: "/admin/products",
            permission: "products.view",
            icon: Package,
        },
        {
            label: "Barcode & Labels",
            routeName: "admin.barcode-labels.index",
            urlPrefix: "/admin/barcode-labels",
            permission: "barcode-labels.view",
            icon: Barcode,
        },
        {
            label: "Units",
            routeName: "admin.units.index",
            urlPrefix: "/admin/units",
            permission: "units.view",
            icon: Boxes,
        },
        {
            label: "Product Variants",
            routeName: "admin.product-variants.index",
            urlPrefix: "/admin/product-variants",
            permission: "product-variants.view",
            icon: Boxes,
        },
        {
            label: "Customers",
            routeName: "admin.customers.index",
            urlPrefix: "/admin/customers",
            permission: "customers.view",
            icon: Users,
        },
        {
            label: "CRM & Loyalty",
            routeName: "admin.crm.index",
            urlPrefix: "/admin/crm",
            permission: "crm.view",
            icon: Users,
        },
        {
            label: "Gift Vouchers",
            routeName: "admin.gift-vouchers.index",
            urlPrefix: "/admin/gift-vouchers",
            permission: "vouchers.manage",
            icon: Tags,
        },
        {
            label: "Suppliers",
            routeName: "admin.suppliers.index",
            urlPrefix: "/admin/suppliers",
            permission: "suppliers.view",
            icon: Truck,
        },
        {
            label: "Purchases",
            routeName: "admin.purchases.index",
            urlPrefix: "/admin/purchases",
            permission: "purchases.view",
            icon: ShoppingCart,
        },
        { label: "Purchase Requisitions", routeName: "admin.purchase-requisitions.index", urlPrefix: "/admin/purchase-requisitions", permission: "purchase-requisitions.view", icon: ClipboardList },
        { label: "Purchase Orders", routeName: "admin.purchase-orders.index", urlPrefix: "/admin/purchase-orders", permission: "purchase-orders.view", icon: FileText },
        { label: "Goods Receipts", routeName: "admin.goods-receipts.index", urlPrefix: "/admin/goods-receipts", permission: "goods-receipts.view", icon: PackageCheck },
        { label: "Supplier Statements", routeName: "admin.supplier-statements.index", urlPrefix: "/admin/supplier-statements", permission: "supplier-statements.view", icon: BookOpen },
        {
            label: "Purchase Returns",
            routeName: "admin.purchase-returns.index",
            urlPrefix: "/admin/purchase-returns",
            permission: "purchase-returns.view",
            icon: RotateCcw,
        },
        {
            label: "POS",
            routeName: "admin.pos.create",
            urlPrefix: "/admin/pos",
            permission: "pos.view",
            icon: MonitorSmartphone,
        },
        {
            label: "Orders",
            routeName: "admin.orders.index",
            urlPrefix: "/admin/orders",
            permission: "orders.view",
            icon: ShoppingBag,
        },
        {
            label: "Sales",
            routeName: "admin.sales.index",
            urlPrefix: "/admin/sales",
            permission: "sales.view",
            icon: ShoppingCart,
        },
        {
            label: "Sales Returns",
            routeName: "admin.sale-returns.index",
            urlPrefix: "/admin/sale-returns",
            permission: "sale-returns.view",
            icon: RotateCcw,
        },
        {
            label: "Opening Stock",
            routeName: "admin.opening-stocks.index",
            urlPrefix: "/admin/opening-stocks",
            permission: "opening-stocks.view",
            icon: Boxes,
        },
        {
            label: "Stock Adjustments",
            routeName: "admin.stock-adjustments.index",
            urlPrefix: "/admin/stock-adjustments",
            permission: "stock-adjustments.view",
            icon: Boxes,
        },
        {
            label: "Stock Transfers",
            routeName: "admin.stock-transfers.index",
            urlPrefix: "/admin/stock-transfers",
            permission: "stock-transfers.view",
            icon: Truck,
        },
        {
            label: "Stock Ledger",
            routeName: "admin.stock-ledger.index",
            urlPrefix: "/admin/stock-ledger",
            permission: "stock-ledger.view",
            icon: History,
        },
        {
            label: "Stock History",
            routeName: "admin.stock-history.index",
            urlPrefix: "/admin/stock-history",
            permission: "stock-history.view",
            icon: History,
        },
        {
            label: "Reports",
            routeName: "admin.reports.index",
            urlPrefix: "/admin/reports",
            permission: "reports.view",
            icon: BarChart3,
        },
        {
            label: "Chart of Accounts",
            routeName: "admin.accounts.index",
            urlPrefix: "/admin/accounts",
            permission: "accounts.view",
            icon: Landmark,
        },
        {
            label: "Journal Entries",
            routeName: "admin.journals.index",
            urlPrefix: "/admin/journals",
            permission: "journals.view",
            icon: ScrollText,
        },
        {
            label: "General Ledger",
            routeName: "admin.ledger.index",
            urlPrefix: "/admin/general-ledger",
            permission: "ledger.view",
            icon: History,
        },

        {
            label: "Financial Dashboard",
            routeName: "admin.financial-statements.dashboard",
            urlPrefix: "/admin/financial-statements",
            permission: "financial-statements.view",
            icon: BarChart3,
        },
        {
            label: "Trial Balance",
            routeName: "admin.financial-statements.trial-balance",
            urlPrefix: "/admin/financial-statements/trial-balance",
            permission: "financial-statements.view",
            icon: Scale,
        },
        {
            label: "Profit & Loss",
            routeName: "admin.financial-statements.profit-loss",
            urlPrefix: "/admin/financial-statements/profit-loss",
            permission: "financial-statements.view",
            icon: TrendingUp,
        },
        {
            label: "Balance Sheet",
            routeName: "admin.financial-statements.balance-sheet",
            urlPrefix: "/admin/financial-statements/balance-sheet",
            permission: "financial-statements.view",
            icon: Landmark,
        },
        {
            label: "Cash Flow",
            routeName: "admin.financial-statements.cash-flow",
            urlPrefix: "/admin/financial-statements/cash-flow",
            permission: "financial-statements.view",
            icon: Wallet,
        },
        {
            label: "Settings",
            routeName: "admin.settings.edit",
            urlPrefix: "/admin/settings",
            permission: "settings.view",
            icon: Settings,
        },
    ];

    const administrationItems = [
        {
            label: "Users",
            routeName: "admin.users.index",
            urlPrefix: "/admin/users",
            permission: "users.view",
            icon: UserCog,
        },
        {
            label: "Roles",
            routeName: "admin.roles.index",
            urlPrefix: "/admin/roles",
            permission: "roles.view",
            icon: ShieldCheck,
        },
        {
            label: "Permissions",
            routeName: "admin.permissions.index",
            urlPrefix: "/admin/permissions",
            permission: "permissions.view",
            icon: KeyRound,
        },
        {
            label: "Activity Logs",
            routeName: "admin.activity-logs.index",
            urlPrefix: "/admin/activity-logs",
            permission: "activity-logs.view",
            icon: ScrollText,
        },
        {
            label: "Notifications",
            routeName: "admin.notifications.index",
            urlPrefix: "/admin/notifications",
            permission: "notifications.view",
            icon: Bell,
        },
    ];

    const visibleAdministrationItems =
        administrationItems.filter((item) =>
            can(item.permission)
        );

    return (
        <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-white">
            <div className="shrink-0 border-b border-gray-200 px-5 py-5">
                <div className="flex items-center gap-3">
                    {businessSettings.logo ? (
                        <img
                            src={businessSettings.logo}
                            alt={
                                businessSettings.company_name ??
                                "Company logo"
                            }
                            className="h-11 w-11 rounded-xl border border-gray-200 bg-white object-contain p-1"
                        />
                    ) : (
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
                            {(
                                businessSettings.company_name ??
                                "N"
                            )
                                .charAt(0)
                                .toUpperCase()}
                        </div>
                    )}

                    <div className="min-w-0">
                        <h1 className="truncate text-lg font-bold text-blue-700">
                            {businessSettings.company_name ??
                                "NuhaMart"}
                        </h1>

                        <p className="truncate text-xs text-gray-500">
                            {businessSettings.company_tagline ??
                                "Inventory & POS System"}
                        </p>
                    </div>
                </div>
            </div>

            <nav className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
                <div className="space-y-1">
                    {menuItems
                        .filter((item) =>
                            can(item.permission)
                        )
                        .map((item) => (
                            <AdminMenuItem
                                key={item.routeName}
                                href={route(item.routeName)}
                                active={page.url.startsWith(
                                    item.urlPrefix
                                )}
                                icon={item.icon}
                            >
                                {item.label}
                            </AdminMenuItem>
                        ))}
                </div>

                {visibleAdministrationItems.length > 0 && (
                    <div className="mt-5 border-t border-gray-200 pt-4">
                        <p className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Administration
                        </p>

                        <div className="space-y-1">
                            {visibleAdministrationItems.map(
                                (item) => (
                                    <AdminMenuItem
                                        key={item.routeName}
                                        href={route(
                                            item.routeName
                                        )}
                                        active={page.url.startsWith(
                                            item.urlPrefix
                                        )}
                                        icon={item.icon}
                                    >
                                        {item.label}
                                    </AdminMenuItem>
                                )
                            )}
                        </div>
                    </div>
                )}

                <div className="h-6" />
            </nav>
        </aside>
    );
}
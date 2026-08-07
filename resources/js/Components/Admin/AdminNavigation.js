import {
    Activity,
    BarChart3,
    Barcode,
    Bell,
    BookOpen,
    Boxes,
    Building2,
    Calculator,
    CircleDollarSign,
    Contact,
    FileBarChart,
    FolderTree,
    Gift,
    History,
    KeyRound,
    LayoutDashboard,
    LayoutTemplate,
    Megaphone,
    Package,
    ReceiptText,
    Settings,
    ShieldCheck,
    ShoppingBag,
    ShoppingCart,
    Tags,
    Truck,
    UserCog,
    Users,
    Warehouse,
} from "lucide-react";

export const adminNavigation = [
    {
        key: "overview",
        label: "Overview",
        items: [
            {
                label: "Dashboard",
                description: "Business command center",
                routeName: "admin.dashboard",
                urlPrefix: "/admin/dashboard",
                permission: "dashboard.view",
                icon: LayoutDashboard,
                keywords: "dashboard overview analytics home",
            },
        ],
    },
    {
        key: "commerce",
        label: "Commerce",
        items: [
            {
                label: "Orders",
                description: "Manage customer orders",
                routeName: "admin.orders.index",
                urlPrefix: "/admin/orders",
                permission: "orders.view",
                icon: ShoppingBag,
                keywords: "orders sales ecommerce customer",
            },
            {
                label: "Products & Books",
                description: "Catalog and inventory items",
                routeName: "admin.products.index",
                urlPrefix: "/admin/products",
                permission: "products.view",
                icon: Package,
                keywords: "products books catalog sku stock",
            },
            {
                label: "Categories",
                description: "Catalog structure",
                routeName: "admin.categories.index",
                urlPrefix: "/admin/categories",
                permission: "categories.view",
                icon: FolderTree,
                keywords: "categories taxonomy catalog",
            },
            {
                label: "Authors",
                description: "Book authors",
                routeName: "admin.authors.index",
                urlPrefix: "/admin/authors",
                permission: "authors.view",
                icon: BookOpen,
                keywords: "authors writers books",
            },
            {
                label: "Publishers",
                description: "Book publishers",
                routeName: "admin.publishers.index",
                urlPrefix: "/admin/publishers",
                permission: "publishers.view",
                icon: Building2,
                keywords: "publishers books",
            },
            {
                label: "Brands",
                description: "Product brands",
                routeName: "admin.brands.index",
                urlPrefix: "/admin/brands",
                permission: "brands.view",
                icon: Tags,
                keywords: "brands products",
            },
            {
                label: "CRM",
                description: "Customer intelligence & relationships",
                routeName: "admin.crm.index",
                urlPrefix: "/admin/crm",
                permission: "crm.view",
                icon: Contact,
                keywords: "crm customers relationships loyalty wallet customer intelligence",
            },            {
                label: "Customers",
                description: "Customer directory",
                routeName: "admin.customers.index",
                urlPrefix: "/admin/customers",
                permission: "customers.view",
                icon: Users,
                keywords: "customers crm buyers",
            },
        ],
    },
    {
        key: "inventory",
        label: "Inventory",
        items: [
            {
                label: "Stock History",
                description: "Inventory movement",
                routeName: "admin.stock-history.index",
                urlPrefix: "/admin/stock-history",
                permission: "stock-history.view",
                icon: Boxes,
                keywords: "inventory stock history movement",
            },
            {
                label: "Stock Adjustments",
                description: "Correct stock quantities",
                routeName: "admin.stock-adjustments.index",
                urlPrefix: "/admin/stock-adjustments",
                permission: "stock-adjustments.view",
                icon: History,
                keywords: "stock adjustments inventory",
            },
            {
                label: "Purchases",
                description: "Purchase operations",
                routeName: "admin.purchases.index",
                urlPrefix: "/admin/purchases",
                permission: "purchases.view",
                icon: ShoppingCart,
                keywords: "purchase procurement buying",
            },
            {
                label: "Suppliers",
                description: "Supplier directory",
                routeName: "admin.suppliers.index",
                urlPrefix: "/admin/suppliers",
                permission: "suppliers.view",
                icon: Truck,
                keywords: "suppliers vendors procurement",
            },
            {
                label: "Barcode & Labels",
                description: "Print product labels",
                routeName: "admin.barcode-labels.index",
                urlPrefix: "/admin/barcode-labels",
                permission: "barcode-labels.view",
                icon: Barcode,
                keywords: "barcode labels print",
            },
        ],
    },
    {
        key: "growth",
        label: "Growth & Content",
        items: [
            {
                label: "Homepage & Banners",
                description: "Storefront content",
                routeName: "admin.homepage-content.index",
                urlPrefix: "/admin/homepage-content",
                permission: "homepage-content.view",
                icon: LayoutTemplate,
                keywords: "homepage banners cms content",
            },
            {
                label: "Marketing & Coupons",
                description: "Promotions and discounts",
                routeName: "admin.marketing.coupons.index",
                urlPrefix: "/admin/marketing",
                permission: "marketing.view",
                icon: Megaphone,
                keywords: "marketing coupons promotions discounts",
            },
            {
                label: "Gift Vouchers",
                description: "Voucher management",
                routeName: "admin.gift-vouchers.index",
                urlPrefix: "/admin/gift-vouchers",
                permission: "vouchers.manage",
                icon: Gift,
                keywords: "gift voucher coupon",
            },
        ],
    },
    {
        key: "insights",
        label: "Insights",
        items: [
            {
                label: "Reports",
                description: "Operational reports",
                routeName: "admin.reports.index",
                urlPrefix: "/admin/reports",
                permission: "reports.view",
                icon: BarChart3,
                keywords: "reports analytics sales inventory",
            },
        ],
    },
    {
        key: "system",
        label: "System",
        items: [
            {
                label: "Business Settings",
                description: "Brand and configuration",
                routeName: "admin.settings.edit",
                urlPrefix: "/admin/settings",
                permission: "settings.view",
                icon: Settings,
                keywords: "settings business branding company",
            },
            {
                label: "Users",
                description: "Team accounts",
                routeName: "admin.users.index",
                urlPrefix: "/admin/users",
                permission: "users.view",
                icon: UserCog,
                keywords: "users staff team",
            },
            {
                label: "Roles",
                description: "Role management",
                routeName: "admin.roles.index",
                urlPrefix: "/admin/roles",
                permission: "roles.view",
                icon: ShieldCheck,
                keywords: "roles authorization",
            },
            {
                label: "Permissions",
                description: "Access control",
                routeName: "admin.permissions.index",
                urlPrefix: "/admin/permissions",
                permission: "permissions.view",
                icon: KeyRound,
                keywords: "permissions access control security",
            },
            {
                label: "Activity Logs",
                description: "Audit trail",
                routeName: "admin.activity-logs.index",
                urlPrefix: "/admin/activity-logs",
                permission: "activity-logs.view",
                icon: Activity,
                keywords: "activity logs audit history",
            },
            {
                label: "Notifications",
                description: "Notification center",
                routeName: "admin.notifications.index",
                urlPrefix: "/admin/notifications",
                permission: "notifications.view",
                icon: Bell,
                keywords: "notifications alerts",
            },
        ],
    },
];

export function normalizePermissionNames(value) {
    if (!Array.isArray(value)) return [];

    return value
        .map((item) => {
            if (typeof item === "string") return item;
            if (item && typeof item === "object") {
                return item.name ?? item.slug ?? null;
            }
            return null;
        })
        .filter(Boolean);
}

export function createAccessChecker(auth = {}) {
    const roles = normalizePermissionNames(
        auth.roles ?? auth.user?.roles ?? [],
    );
    const permissions = normalizePermissionNames(
        auth.permissions ??
            auth.user?.permissions ??
            auth.user?.all_permissions ??
            [],
    );

    const superAdmin = roles.some((role) =>
        ["super admin", "super-admin"].includes(role.toLowerCase()),
    );

    return (permission) => {
        if (!permission) return true;
        if (roles.length === 0 && permissions.length === 0) return true;

        return superAdmin || permissions.includes(permission);
    };
}

export function visibleNavigation(auth = {}) {
    const can = createAccessChecker(auth);

    return adminNavigation
        .map((section) => ({
            ...section,
            items: section.items.filter((item) => can(item.permission)),
        }))
        .filter((section) => section.items.length > 0);
}

export function searchableNavigation(auth = {}) {
    return visibleNavigation(auth).flatMap((section) =>
        section.items.map((item) => ({
            ...item,
            section: section.label,
        })),
    );
}

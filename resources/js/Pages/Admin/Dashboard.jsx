import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import StatCard from "@/Components/Dashboard/StatCard";
import SalesChart from "@/Components/Dashboard/SalesChart";
import PurchaseChart from "@/Components/Dashboard/PurchaseChart";
import RecentOrders from "@/Components/Dashboard/RecentOrders";
import RecentPurchases from "@/Components/Dashboard/RecentPurchases";
import LowStockTable from "@/Components/Dashboard/LowStockTable";
import { Head, Link, usePage } from "@inertiajs/react";

const icons = {
    plus: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
        />
    ),

    cart: (
        <>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386a1.5 1.5 0 0 1 1.451 1.113l.383 1.437m0 0L7.5 13.5h9.75l2.25-7.95H5.47Z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 18.75h.008v.008H7.5v-.008Zm9.75 0h.008v.008h-.008v-.008Z"
            />
        </>
    ),

    purchase: (
        <>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 15.75v3A2.25 2.25 0 0 0 6.75 21h10.5a2.25 2.25 0 0 0 2.25-2.25v-3"
            />
        </>
    ),

    supplier: (
        <>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.501 20.118a7.5 7.5 0 0 1 14.998 0"
            />
        </>
    ),

    sales: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 13.5 9 7.5l4.5 4.5L21 4.5M15 4.5h6v6"
        />
    ),

    expense: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 10.5 9 16.5l4.5-4.5L21 19.5M15 19.5h6v-6"
        />
    ),

    pending: (
        <>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6l4 2"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
        </>
    ),

    wallet: (
        <>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6.75A2.25 2.25 0 0 1 4.5 4.5h13.5a2.25 2.25 0 0 1 2.25 2.25v10.5A2.25 2.25 0 0 1 18 19.5H4.5a2.25 2.25 0 0 1-2.25-2.25V6.75Z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5h4.5v3h-4.5a1.5 1.5 0 0 1 0-3Z"
            />
        </>
    ),
};

function Icon({ name, className = "h-5 w-5" }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className={className}
            aria-hidden="true"
        >
            {icons[name]}
        </svg>
    );
}

function formatCurrency(value) {
    const number = Number(value ?? 0);

    return new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(number);
}

function getGreeting() {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
        return "Good Morning";
    }

    if (currentHour < 17) {
        return "Good Afternoon";
    }

    return "Good Evening";
}

function QuickAction({ href, title, description, icon, theme = "blue" }) {
    const themes = {
        blue: {
            icon: "bg-blue-100 text-blue-600",
            hover: "hover:border-blue-200 hover:bg-blue-50/60",
        },

        emerald: {
            icon: "bg-emerald-100 text-emerald-600",
            hover: "hover:border-emerald-200 hover:bg-emerald-50/60",
        },

        violet: {
            icon: "bg-violet-100 text-violet-600",
            hover: "hover:border-violet-200 hover:bg-violet-50/60",
        },

        orange: {
            icon: "bg-orange-100 text-orange-600",
            hover: "hover:border-orange-200 hover:bg-orange-50/60",
        },
    };

    const selectedTheme = themes[theme] ?? themes.blue;

    return (
        <Link
            href={href}
            className={`group flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${selectedTheme.hover}`}
        >
            <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${selectedTheme.icon}`}
            >
                <Icon name={icon} />
            </div>

            <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">
                    {title}
                </p>

                <p className="mt-0.5 truncate text-xs text-gray-500">
                    {description}
                </p>
            </div>

            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="ml-auto h-4 w-4 shrink-0 text-gray-300 transition group-hover:translate-x-1 group-hover:text-gray-500"
                aria-hidden="true"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m9 18 6-6-6-6"
                />
            </svg>
        </Link>
    );
}

function FinancialCard({
    title,
    value,
    description,
    icon,
    iconClass,
    backgroundClass,
}) {
    return (
        <div
            className={`relative overflow-hidden rounded-2xl border border-gray-100 p-5 shadow-sm ${backgroundClass}`}
        >
            <div className="relative z-10 flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>

                    <p className="mt-3 text-2xl font-bold tracking-tight text-gray-900">
                        {formatCurrency(value)}
                    </p>

                    <p className="mt-2 text-xs text-gray-500">{description}</p>
                </div>

                <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
                >
                    <Icon name={icon} />
                </div>
            </div>

            <div className="absolute -bottom-10 -right-8 h-32 w-32 rounded-full bg-white/40" />
        </div>
    );
}

export default function Dashboard({
    stats = {},
    recentOrders = [],
    recentPurchases = [],
    lowStockProducts = [],
    recentProducts = [],
    monthlyChartData = {},
    salesChartData = [],
    purchaseChartData = [],
}) {
    const { auth } = usePage().props;

    const userName =
        auth?.user?.name?.trim() ||
        auth?.user?.email?.split("@")[0] ||
        "Admin";

    /*
     * এই fallback-এর কারণে Controller থেকে chart data-এর নাম সামান্য
     * ভিন্ন হলেও Dashboard crash করবে না।
     */
    const salesData =
        monthlyChartData?.sales ??
        monthlyChartData?.salesData ??
        salesChartData ??
        [];

    const purchaseData =
        monthlyChartData?.purchases ??
        monthlyChartData?.purchaseData ??
        purchaseChartData ??
        [];

    return (
        <AuthenticatedLayout>
            <Head title="Admin Dashboard" />

            <div className="min-h-screen bg-gray-50/70">
                <div className="mx-auto max-w-[1600px] space-y-7 p-4 sm:p-6 lg:p-8">
                    {/* Dashboard header */}
                    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 px-6 py-7 text-white shadow-xl sm:px-8">
                        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
                        <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl" />

                        <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-200">
                                    {getGreeting()}, {userName} 👋
                                </p>

                                <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                                    Welcome back to NuhaMart ERP
                                </h1>

                                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                                    Monitor sales, purchases, orders and inventory
                                    from one central dashboard.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:min-w-[610px]">
                                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                                    <p className="text-xs text-slate-300">
                                        Today&apos;s Sales
                                    </p>
                                    <p className="mt-2 text-base font-bold">
                                        {formatCurrency(stats.today_sales)}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                                    <p className="text-xs text-slate-300">
                                        Today&apos;s Purchase
                                    </p>
                                    <p className="mt-2 text-base font-bold">
                                        {formatCurrency(stats.today_purchase)}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                                    <p className="text-xs text-slate-300">
                                        Pending Orders
                                    </p>
                                    <p className="mt-2 text-base font-bold">
                                        {stats.pending_orders ?? 0}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                                    <p className="text-xs text-slate-300">
                                        Low Stock
                                    </p>
                                    <p className="mt-2 text-base font-bold">
                                        {stats.low_stock ?? 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Quick actions */}
                    <section>
                        <div className="mb-4">
                            <h2 className="text-lg font-bold text-gray-900">
                                Quick Actions
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Access commonly used ERP operations.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <QuickAction
                                href="/admin/products/create"
                                title="Add Product"
                                description="Create a new inventory item"
                                icon="plus"
                                theme="blue"
                            />

                            <QuickAction
                                href="/admin/orders"
                                title="View Orders"
                                description="Manage customer sales orders"
                                icon="cart"
                                theme="emerald"
                            />

                            <QuickAction
                                href="/admin/purchases/create"
                                title="New Purchase"
                                description="Record supplier stock purchase"
                                icon="purchase"
                                theme="violet"
                            />

                            <QuickAction
                                href="/admin/suppliers/create"
                                title="Add Supplier"
                                description="Create a supplier profile"
                                icon="supplier"
                                theme="orange"
                            />
                        </div>
                    </section>

                    {/* Main statistics */}
                    <section>
                        <div className="mb-4">
                            <h2 className="text-lg font-bold text-gray-900">
                                Business Overview
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Current operational information for NuhaMart.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <StatCard
                                title="Total Products"
                                value={stats.products ?? 0}
                                icon="products"
                                accent="blue"
                                description="Products in inventory"
                            />

                            <StatCard
                                title="Total Categories"
                                value={stats.categories ?? 0}
                                icon="categories"
                                accent="violet"
                                description="Active product categories"
                            />

                            <StatCard
                                title="Total Brands"
                                value={stats.brands ?? 0}
                                icon="brands"
                                accent="pink"
                                description="Registered product brands"
                            />

                            <StatCard
                                title="Total Suppliers"
                                value={stats.suppliers ?? 0}
                                icon="suppliers"
                                accent="cyan"
                                description="Registered suppliers"
                            />

                            <StatCard
                                title="Total Customers"
                                value={stats.customers ?? 0}
                                icon="customers"
                                accent="emerald"
                                description="Unique customers served"
                            />

                            <StatCard
                                title="Total Orders"
                                value={stats.orders ?? 0}
                                icon="orders"
                                accent="orange"
                                description="All sales orders"
                            />

                            <StatCard
                                title="Total Purchases"
                                value={stats.purchases ?? 0}
                                icon="purchases"
                                accent="indigo"
                                description="All stock purchases"
                            />

                            <StatCard
                                title="Stock Alerts"
                                value={
                                    (Number(stats.low_stock) || 0) +
                                    (Number(stats.out_of_stock) || 0)
                                }
                                icon="warning"
                                accent="red"
                                description={`${stats.out_of_stock ?? 0} products out of stock`}
                            />
                        </div>
                    </section>

                    {/* Financial summary */}
                    <section>
                        <div className="mb-4">
                            <h2 className="text-lg font-bold text-gray-900">
                                Financial Summary
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Sales, purchasing and pending payment overview.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <FinancialCard
                                title="Total Sales"
                                value={stats.total_sales}
                                description="Lifetime recorded revenue"
                                icon="sales"
                                iconClass="bg-emerald-100 text-emerald-600"
                                backgroundClass="bg-gradient-to-br from-white to-emerald-50"
                            />

                            <FinancialCard
                                title="Total Purchase"
                                value={stats.total_purchase}
                                description="Lifetime inventory expense"
                                icon="expense"
                                iconClass="bg-violet-100 text-violet-600"
                                backgroundClass="bg-gradient-to-br from-white to-violet-50"
                            />

                            <FinancialCard
                                title="Pending Orders"
                                value={stats.pending_orders}
                                description="Orders waiting for completion"
                                icon="pending"
                                iconClass="bg-orange-100 text-orange-600"
                                backgroundClass="bg-gradient-to-br from-white to-orange-50"
                            />

                            <FinancialCard
                                title="Pending Payments"
                                value={stats.pending_payments}
                                description="Payments awaiting confirmation"
                                icon="wallet"
                                iconClass="bg-red-100 text-red-600"
                                backgroundClass="bg-gradient-to-br from-white to-red-50"
                            />
                        </div>
                    </section>

                    {/* Charts */}
                    <section className="grid gap-6 xl:grid-cols-2">
                        <div className="min-w-0">
                            <SalesChart
                                labels={salesData.labels ?? []}
                                values={salesData.values ?? []}
                            />
                        </div>

                        <div className="min-w-0">

                            <PurchaseChart
                                labels={purchaseData.labels ?? []}
                                values={purchaseData.values ?? []}
                            />
                            
                        </div>
                    </section>

                    {/* Recent orders and purchases */}
                    <section className="grid gap-6 xl:grid-cols-2">
                        <div className="min-w-0">
                            <RecentOrders orders={recentOrders ?? []} />
                        </div>

                        <div className="min-w-0">
                            <RecentPurchases
                                purchases={recentPurchases ?? []}
                            />
                        </div>
                    </section>

                    {/* Stock warning */}
                    <section>
                        <LowStockTable
                            products={lowStockProducts ?? []}
                            recentProducts={recentProducts ?? []}
                        />
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
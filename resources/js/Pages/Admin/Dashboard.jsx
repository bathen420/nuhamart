import { Head, Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AnalyticsCard from "@/Components/Dashboard/AnalyticsCard";
import RevenueChart from "@/Components/Dashboard/RevenueChart";
import RecentSales from "@/Components/Dashboard/RecentSales";
import BestSellingProducts from "@/Components/Dashboard/BestSellingProducts";
import LowStockAlert from "@/Components/Dashboard/LowStockAlert";
import { ArrowRight, PackagePlus, ShoppingCart, UserPlus } from "lucide-react";

const money = (value) =>
    new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "BDT",
        maximumFractionDigits: 2,
    }).format(Number(value || 0));

export default function Dashboard({
    stats = {},
    chartData = {},
    recentSales = [],
    lowStockProducts = [],
    bestSellingProducts = [],
    lowStockLimit = 5,
}) {
    const { auth } = usePage().props;
    const userName = auth?.user?.name || "Administrator";

    const quickActions = [
        {
            title: "New Sale / POS",
            description: "Create a sales invoice",
            href: route("admin.pos.create"),
            icon: ShoppingCart,
        },
        {
            title: "New Purchase",
            description: "Receive supplier stock",
            href: route("admin.purchases.create"),
            icon: PackagePlus,
        },
        {
            title: "Add Product",
            description: "Create inventory item",
            href: route("admin.products.create"),
            icon: PackagePlus,
        },
        {
            title: "Add Customer",
            description: "Register a customer",
            href: route("admin.customers.create"),
            icon: UserPlus,
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard Analytics" />

            <div className="min-h-screen bg-slate-100">
                <div className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">
                    <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 p-6 text-white shadow-xl sm:p-8">
                        <p className="text-sm font-semibold text-blue-200">
                            Welcome back, {userName}
                        </p>
                        <div className="mt-2 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                            <div>
                                <h1 className="text-3xl font-black tracking-tight">
                                    NuhaMart Business Dashboard
                                </h1>
                                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                                    Monitor POS sales, purchases, customer dues and inventory health.
                                </p>
                            </div>

                            <Link
                                href={route("admin.pos.create")}
                                className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-blue-700 shadow"
                            >
                                Open POS <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </section>

                    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <AnalyticsCard
                            title="Today's Sales"
                            value={money(stats.today_sales)}
                            description={`${stats.today_sales_count || 0} completed transaction(s)`}
                            icon="sales"
                            tone="emerald"
                        />
                        <AnalyticsCard
                            title="This Month Sales"
                            value={money(stats.month_sales)}
                            description={`${stats.month_sales_count || 0} transaction(s) this month`}
                            icon="orders"
                            tone="blue"
                        />
                        <AnalyticsCard
                            title="Today's Purchase"
                            value={money(stats.today_purchase)}
                            description={`Monthly purchase ${money(stats.month_purchase)}`}
                            icon="purchase"
                            tone="amber"
                        />
                        <AnalyticsCard
                            title="Customer Due"
                            value={money(stats.total_due)}
                            description="Outstanding balance from completed sales"
                            icon="due"
                            tone="rose"
                        />
                    </section>

                    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                        <AnalyticsCard title="Products" value={stats.products || 0} description="Inventory products" icon="products" />
                        <AnalyticsCard title="Customers" value={stats.customers || 0} description="Registered customers" icon="customers" tone="violet" />
                        <AnalyticsCard title="Suppliers" value={stats.suppliers || 0} description="Active supplier records" icon="suppliers" tone="cyan" />
                        <AnalyticsCard title="Total Sales" value={stats.sales || 0} description={money(stats.total_sales)} icon="orders" tone="emerald" />
                        <AnalyticsCard title="Low Stock" value={stats.low_stock || 0} description={`Threshold: ${lowStockLimit}`} icon="stock" tone="amber" />
                        <AnalyticsCard title="Out of Stock" value={stats.out_of_stock || 0} description="Requires restocking" icon="stock" tone="rose" />
                    </section>

                    <section>
                        <h2 className="mb-3 text-lg font-black text-slate-900">Quick Actions</h2>
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            {quickActions.map(({ title, description, href, icon: Icon }) => (
                                <Link
                                    key={title}
                                    href={href}
                                    className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                                >
                                    <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-slate-900">{title}</p>
                                        <p className="truncate text-xs text-slate-500">{description}</p>
                                    </div>
                                    <ArrowRight className="ml-auto h-4 w-4 text-slate-300 transition group-hover:translate-x-1" />
                                </Link>
                            ))}
                        </div>
                    </section>

                    <section className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
                        <RevenueChart
                            labels={chartData.labels || []}
                            sales={chartData.sales || []}
                            purchases={chartData.purchases || []}
                        />
                        <BestSellingProducts products={bestSellingProducts} />
                    </section>

                    <section className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
                        <RecentSales sales={recentSales} />
                        <LowStockAlert products={lowStockProducts} limit={lowStockLimit} />
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

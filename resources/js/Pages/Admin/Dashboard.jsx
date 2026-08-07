import { Head, Link, usePage } from "@inertiajs/react";
import {
    ArrowRight,
    Banknote,
    Boxes,
    CalendarDays,
    CreditCard,
    PackagePlus,
    PackageSearch,
    RefreshCw,
    RotateCcw,
    ShoppingBag,
    ShoppingCart,
    TrendingUp,
    Truck,
    UserPlus,
    Users,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Button from "@/Components/Admin/UI/Button";
import PageHeader from "@/Components/Admin/UI/PageHeader";
import CommandKpiCard from "@/Components/Dashboard/CommandKpiCard";
import EnterpriseRevenueChart from "@/Components/Dashboard/EnterpriseRevenueChart";
import EnterpriseRecentSales from "@/Components/Dashboard/EnterpriseRecentSales";
import InventoryAttention from "@/Components/Dashboard/InventoryAttention";
import BestProductsCard from "@/Components/Dashboard/BestProductsCard";
import BusinessHealthCard from "@/Components/Dashboard/BusinessHealthCard";
import ActivityTimeline from "@/Components/Dashboard/ActivityTimeline";

function greeting() {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
}

export default function Dashboard({
    stats = {},
    chartData = {},
    recentSales = [],
    lowStockProducts = [],
    bestSellingProducts = [],
    lowStockLimit = 5,
    recentActivities = [],
}) {
    const { auth = {}, businessSettings = {} } = usePage().props;

    const userName = auth?.user?.name || "Administrator";
    const companyName =
        businessSettings.short_name ||
        businessSettings.company_name ||
        "Nuha Mart BD";
    const currencySymbol = businessSettings.currency_symbol || "৳";

    const number = (value) =>
        new Intl.NumberFormat("en-GB").format(Number(value || 0));

    const money = (value) =>
        `${currencySymbol}${new Intl.NumberFormat("en-GB", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(Number(value || 0))}`;

    const totalInventoryRisk =
        Number(stats.low_stock || 0) + Number(stats.out_of_stock || 0);

    const quickActions = [
        {
            title: "Open POS",
            description: "Create a new sale",
            href: route("admin.pos.create"),
            icon: ShoppingCart,
            tone: "bg-brand-50 text-brand-700",
        },
        {
            title: "New purchase",
            description: "Receive supplier stock",
            href: route("admin.purchases.create"),
            icon: PackagePlus,
            tone: "bg-amber-50 text-amber-700",
        },
        {
            title: "Add product",
            description: "Create a catalog item",
            href: route("admin.products.create"),
            icon: Boxes,
            tone: "bg-sky-50 text-sky-700",
        },
        {
            title: "Add customer",
            description: "Register a customer",
            href: route("admin.customers.create"),
            icon: UserPlus,
            tone: "bg-violet-50 text-violet-700",
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Business Command Center" />

            <div className="space-y-6">
                <PageHeader
                    eyebrow="Business command center"
                    title={`${greeting()}, ${userName}`}
                    description={`A live operational view of ${companyName}: sales, purchasing, customers and inventory.`}
                    actions={
                        <>
                            <Button
                                as={Link}
                                href={route("admin.reports.index")}
                                variant="secondary"
                                size="sm"
                            >
                                <TrendingUp size={16} />
                                Reports
                            </Button>
                            <Button
                                as={Link}
                                href={route("admin.pos.create")}
                                size="sm"
                            >
                                <ShoppingCart size={16} />
                                Open POS
                            </Button>
                        </>
                    }
                >
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-ink-400">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 ring-1 ring-ink-200">
                            <CalendarDays size={13} />
                            {new Intl.DateTimeFormat("en-GB", {
                                weekday: "short",
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            }).format(new Date())}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700 ring-1 ring-emerald-100">
                            <RefreshCw size={12} />
                            Data is current
                        </span>
                    </div>
                </PageHeader>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <CommandKpiCard
                        label="Today's sales"
                        value={money(stats.today_sales)}
                        helper={`${number(
                            stats.today_sales_count,
                        )} completed transaction(s)`}
                        icon={TrendingUp}
                        tone="emerald"
                    />
                    <CommandKpiCard
                        label="Month-to-date sales"
                        value={money(stats.month_sales)}
                        helper={`${number(
                            stats.month_sales_count,
                        )} transaction(s) this month`}
                        icon={Banknote}
                        tone="sky"
                    />
                    <CommandKpiCard
                        label="Today's purchase"
                        value={money(stats.today_purchase)}
                        helper={`Month total ${money(stats.month_purchase)}`}
                        icon={ShoppingBag}
                        tone="amber"
                    />
                    <CommandKpiCard
                        label="Customer due"
                        value={money(stats.total_due)}
                        helper="Outstanding balance from completed sales"
                        icon={CreditCard}
                        tone="rose"
                    />
                </section>

                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    <CommandKpiCard
                        label="Products"
                        value={number(stats.products)}
                        helper="Catalog items"
                        icon={Boxes}
                        compact
                    />
                    <CommandKpiCard
                        label="Customers"
                        value={number(stats.customers)}
                        helper="Registered accounts"
                        icon={Users}
                        tone="violet"
                        compact
                    />
                    <CommandKpiCard
                        label="Suppliers"
                        value={number(stats.suppliers)}
                        helper="Supplier records"
                        icon={Truck}
                        tone="sky"
                        compact
                    />
                    <CommandKpiCard
                        label="Completed sales"
                        value={number(stats.sales)}
                        helper={money(stats.total_sales)}
                        icon={Banknote}
                        tone="emerald"
                        compact
                    />
                    <CommandKpiCard
                        label="Inventory risk"
                        value={number(totalInventoryRisk)}
                        helper={`${number(stats.low_stock)} low · ${number(
                            stats.out_of_stock,
                        )} out`}
                        icon={PackageSearch}
                        tone="amber"
                        compact
                    />
                    <CommandKpiCard
                        label="Total returns"
                        value={money(stats.total_return)}
                        helper={`${number(
                            stats.today_return_count,
                        )} return(s) today`}
                        icon={RotateCcw}
                        tone="rose"
                        compact
                    />
                </section>

                <section className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(340px,1fr)]">
                    <EnterpriseRevenueChart
                        labels={chartData.labels || []}
                        sales={chartData.sales || []}
                        purchases={chartData.purchases || []}
                        currencySymbol={currencySymbol}
                    />

                    <BusinessHealthCard
                        stats={stats}
                        lowStockLimit={lowStockLimit}
                    />
                </section>

                <section className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
                    <div className="rounded-3xl border border-ink-200 bg-white p-5 shadow-soft sm:p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-700">
                                    Quick actions
                                </p>
                                <h2 className="mt-1 text-lg font-black text-ink-950">
                                    Continue your workflow
                                </h2>
                            </div>
                            <ArrowRight
                                size={18}
                                className="text-ink-300"
                            />
                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            {quickActions.map(
                                ({
                                    title,
                                    description,
                                    href,
                                    icon: Icon,
                                    tone,
                                }) => (
                                    <Link
                                        key={title}
                                        href={href}
                                        className="group flex items-center gap-3 rounded-2xl border border-ink-200 bg-ink-50/40 p-3.5 transition hover:border-brand-200 hover:bg-brand-50/40"
                                    >
                                        <span
                                            className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${tone}`}
                                        >
                                            <Icon size={18} />
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block text-sm font-black text-ink-800">
                                                {title}
                                            </span>
                                            <span className="mt-0.5 block truncate text-[11px] text-ink-400">
                                                {description}
                                            </span>
                                        </span>
                                        <ArrowRight
                                            size={15}
                                            className="text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-brand-600"
                                        />
                                    </Link>
                                ),
                            )}
                        </div>
                    </div>

                    <BestProductsCard
                        products={bestSellingProducts}
                        currencySymbol={currencySymbol}
                    />
                </section>

                <section className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(340px,1fr)]">
                    <EnterpriseRecentSales
                        sales={recentSales}
                        currencySymbol={currencySymbol}
                    />
                    <InventoryAttention
                        products={lowStockProducts}
                        limit={lowStockLimit}
                    />
                </section>

                <ActivityTimeline activities={recentActivities} />
            </div>
        </AuthenticatedLayout>
    );
}

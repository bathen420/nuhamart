import { Head, Link, usePage } from "@inertiajs/react";
import {
    Activity,
    ArrowRight,
    Banknote,
    Gift,
    PieChart,
    ShoppingBag,
    Sparkles,
    UserCheck,
    UserPlus,
    Users,
    WalletCards,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Badge,
    Button,
    Card,
    CardBody,
    CardHeader,
    PageHeader,
    StatCard,
} from "@/Components/Admin/UI";

function MiniBars({ data = [], valueKey, money = false, currency = "৳" }) {
    const values = data.map((item) => Number(item[valueKey] || 0));
    const max = Math.max(...values, 1);

    return (
        <div className="flex h-32 items-end gap-2">
            {data.map((item) => {
                const value = Number(item[valueKey] || 0);
                const height = Math.max(8, (value / max) * 100);

                return (
                    <div key={item.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                        <div className="flex h-24 w-full items-end">
                            <div
                                className="w-full rounded-t-lg bg-brand-500/80 transition-all"
                                style={{ height: `${height}%` }}
                                title={money ? `${currency}${value}` : String(value)}
                            />
                        </div>
                        <span className="text-[10px] font-black text-ink-400">
                            {item.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

export default function Index({
    summary = {},
    monthly = [],
    segments = [],
    topCustomers = [],
    recentCustomers = [],
    recentActivity = [],
}) {
    const { businessSettings = {} } = usePage().props;
    const currency = businessSettings.currency_symbol || "৳";

    const money = (value) =>
        `${currency}${new Intl.NumberFormat("en-BD", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(Number(value || 0))}`;

    const maxSegment = Math.max(
        ...segments.map((item) => Number(item.value || 0)),
        1,
    );

    return (
        <AuthenticatedLayout>
            <Head title="CRM Dashboard" />

            <div className="space-y-6">
                <PageHeader
                    eyebrow="Customer relationship management"
                    title="CRM Dashboard"
                    description="Customer growth, lifetime value, retention, loyalty, wallet and recent relationship activity."
                    actions={
                        <>
                            <Button
                                as={Link}
                                href={route("admin.customers.index")}
                                variant="secondary"
                            >
                                <Users size={16} />
                                Customers
                            </Button>
                            <Button
                                as={Link}
                                href={route("admin.customers.create")}
                            >
                                <UserPlus size={16} />
                                Add customer
                            </Button>
                        </>
                    }
                />

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        label="Total customers"
                        value={summary.total_customers || 0}
                        helper={`${summary.new_this_month || 0} joined this month`}
                        icon={Users}
                        tone="brand"
                    />
                    <StatCard
                        label="Returning customers"
                        value={summary.returning_customers || 0}
                        helper={`${summary.repeat_rate || 0}% repeat rate`}
                        icon={UserCheck}
                        tone="green"
                    />
                    <StatCard
                        label="Lifetime revenue"
                        value={money(summary.lifetime_revenue)}
                        helper={`Avg. ${money(summary.average_order_value)} per completed sale`}
                        icon={Banknote}
                        tone="purple"
                    />
                    <StatCard
                        label="Outstanding due"
                        value={money(summary.outstanding_due)}
                        helper={`${money(summary.wallet_balance)} wallet balance`}
                        icon={WalletCards}
                        tone="amber"
                    />
                </section>

                <div className="grid gap-6 xl:grid-cols-2">
                    <Card>
                        <CardHeader
                            title="Customer growth"
                            description="New customers registered in the last six months."
                        />
                        <CardBody>
                            <MiniBars data={monthly} valueKey="customers" />
                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader
                            title="Revenue trend"
                            description="Completed sales revenue in the last six months."
                        />
                        <CardBody>
                            <MiniBars
                                data={monthly}
                                valueKey="revenue"
                                money
                                currency={currency}
                            />
                        </CardBody>
                    </Card>
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,.65fr)]">
                    <Card>
                        <CardHeader
                            title="Top customers"
                            description="Customers ranked by completed sales value."
                            action={
                                <Button
                                    as={Link}
                                    href={route("admin.customers.index")}
                                    variant="ghost"
                                >
                                    View all
                                    <ArrowRight size={15} />
                                </Button>
                            }
                        />
                        <CardBody className="space-y-3">
                            {topCustomers.length > 0 ? (
                                topCustomers.map((customer, index) => (
                                    <Link
                                        key={customer.id}
                                        href={route("admin.crm.show", customer.id)}
                                        className="flex items-center gap-4 rounded-2xl border border-ink-200 p-4 transition hover:border-brand-200 hover:bg-brand-50/30"
                                    >
                                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink-950 text-xs font-black text-white">
                                            {index + 1}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="truncate font-black text-ink-900">
                                                    {customer.name}
                                                </p>
                                                <Badge tone="purple">
                                                    {customer.crm_profile?.loyalty_tier?.name ||
                                                        "Standard"}
                                                </Badge>
                                            </div>
                                            <p className="mt-1 text-xs text-ink-400">
                                                {customer.customer_code} ·{" "}
                                                {customer.sales_count || 0} sale(s)
                                            </p>
                                        </div>
                                        <p className="shrink-0 font-black text-brand-700">
                                            {money(customer.lifetime_spend)}
                                        </p>
                                    </Link>
                                ))
                            ) : (
                                <div className="py-10 text-center">
                                    <ShoppingBag
                                        size={30}
                                        className="mx-auto text-ink-300"
                                    />
                                    <p className="mt-3 font-black text-ink-700">
                                        No customer revenue yet
                                    </p>
                                </div>
                            )}
                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader
                            title="Customer segments"
                            description="Current CRM audience breakdown."
                        />
                        <CardBody className="space-y-5">
                            {segments.map((segment) => (
                                <div key={segment.label}>
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-sm font-black text-ink-700">
                                            {segment.label}
                                        </span>
                                        <span className="text-sm font-black text-ink-950">
                                            {segment.value}
                                        </span>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-ink-100">
                                        <div
                                            className="h-full rounded-full bg-brand-600"
                                            style={{
                                                width: `${Math.max(
                                                    3,
                                                    (Number(segment.value || 0) /
                                                        maxSegment) *
                                                        100,
                                                )}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <div className="rounded-2xl bg-purple-50 p-4">
                                    <Gift
                                        size={18}
                                        className="text-purple-600"
                                    />
                                    <p className="mt-3 text-xl font-black text-purple-900">
                                        {summary.points_balance || 0}
                                    </p>
                                    <p className="mt-1 text-xs text-purple-600">
                                        Points outstanding
                                    </p>
                                </div>
                                <div className="rounded-2xl bg-emerald-50 p-4">
                                    <WalletCards
                                        size={18}
                                        className="text-emerald-600"
                                    />
                                    <p className="mt-3 text-xl font-black text-emerald-900">
                                        {money(summary.wallet_balance)}
                                    </p>
                                    <p className="mt-1 text-xs text-emerald-600">
                                        Wallet liability
                                    </p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                    <Card>
                        <CardHeader
                            title="Recently added customers"
                            description="Latest customer profiles created in the system."
                        />
                        <CardBody className="space-y-3">
                            {recentCustomers.map((customer) => (
                                <Link
                                    key={customer.id}
                                    href={route("admin.crm.show", customer.id)}
                                    className="flex items-center gap-3 rounded-2xl p-3 transition hover:bg-ink-50"
                                >
                                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-xs font-black text-brand-700">
                                        {customer.name
                                            ?.split(/\s+/)
                                            .slice(0, 2)
                                            .map((part) => part.charAt(0))
                                            .join("")
                                            .toUpperCase()}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-black text-ink-800">
                                            {customer.name}
                                        </p>
                                        <p className="mt-1 text-xs text-ink-400">
                                            {customer.phone} ·{" "}
                                            {customer.customer_code}
                                        </p>
                                    </div>
                                    <Badge
                                        tone={customer.status ? "success" : "neutral"}
                                        dot
                                    >
                                        {customer.status ? "Active" : "Inactive"}
                                    </Badge>
                                </Link>
                            ))}

                            {recentCustomers.length === 0 && (
                                <p className="py-10 text-center text-sm text-ink-400">
                                    No customers yet.
                                </p>
                            )}
                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader
                            title="Recent CRM activity"
                            description="Latest wallet, loyalty and internal-note activity."
                        />
                        <CardBody>
                            {recentActivity.length > 0 ? (
                                <div className="relative space-y-1 before:absolute before:bottom-3 before:left-[18px] before:top-3 before:w-px before:bg-ink-200">
                                    {recentActivity.map((entry) => (
                                        <div
                                            key={entry.id}
                                            className="relative flex gap-3 py-3"
                                        >
                                            <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-brand-100 bg-brand-50 text-brand-700">
                                                <Activity size={16} />
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="text-sm font-black text-ink-800">
                                                        {entry.title}
                                                    </p>
                                                    <Badge tone="neutral">
                                                        {entry.type}
                                                    </Badge>
                                                </div>
                                                <p className="mt-1 text-xs text-ink-500">
                                                    {entry.customer?.name ||
                                                        "Customer"}{" "}
                                                    · {entry.user?.name || "System"}
                                                </p>
                                                {entry.description && (
                                                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-ink-400">
                                                        {entry.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-10 text-center">
                                    <Sparkles
                                        size={30}
                                        className="mx-auto text-ink-300"
                                    />
                                    <p className="mt-3 font-black text-ink-700">
                                        No CRM activity yet
                                    </p>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

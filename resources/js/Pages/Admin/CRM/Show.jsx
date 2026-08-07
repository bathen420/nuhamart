import { Head, Link, useForm, usePage } from "@inertiajs/react";
import {
    ArrowLeft,
    Activity,
    Banknote,
    CalendarDays,
    Clock3,
    CreditCard,
    Edit3,
    Gift,
    Mail,
    MapPin,
    MessageSquarePlus,
    PackageCheck,
    Phone,
    ReceiptText,
    ShoppingBag,
    Sparkles,
    TrendingUp,
    UserRound,
    WalletCards,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Badge,
    Button,
    Card,
    CardBody,
    CardHeader,
    FormField,
    Input,
    PageHeader,
    StatCard,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableHeader,
    TableRow,
    Textarea,
} from "@/Components/Admin/UI";

const formatStatus = (value) =>
    String(value || "n/a")
        .replaceAll("_", " ")
        .replace(/\b\w/g, (character) => character.toUpperCase());

const statusTone = (status) => {
    if (["completed", "delivered", "paid"].includes(status)) return "success";
    if (["cancelled", "failed"].includes(status)) return "danger";
    if (["processing", "confirmed"].includes(status)) return "brand";
    if (["shipped"].includes(status)) return "purple";
    return "warning";
};

function EmptyState({ icon: Icon, title, description }) {
    return (
        <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-ink-50/70 px-5 py-8 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white text-ink-300 shadow-sm">
                <Icon size={22} />
            </span>
            <p className="mt-4 text-sm font-black text-ink-700">{title}</p>
            <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-ink-400">
                {description}
            </p>
        </div>
    );
}

export default function Show({ customer }) {
    const { businessSettings = {} } = usePage().props;
    const currency = businessSettings.currency_symbol || "৳";

    const points = useForm({ points: "", note: "" });
    const wallet = useForm({ amount: "", note: "" });
    const note = useForm({ note: "" });

    const money = (value) =>
        `${currency}${new Intl.NumberFormat("en-BD", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(Number(value || 0))}`;

    const sales = customer.sales || [];
    const orders = customer.orders || [];
    const addresses = customer.addresses || [];
    const timeline = customer.activity || customer.timeline || [];

    const initials = customer.name
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join("")
        .toUpperCase();

    return (
        <AuthenticatedLayout>
            <Head title={`${customer.name} — CRM`} />

            <div className="min-w-0 space-y-6 overflow-x-hidden">
                <PageHeader
                    eyebrow="Customer 360°"
                    title={customer.name}
                    description="Unified customer profile, purchase history, loyalty, wallet and relationship activity."
                    actions={
                        <>
                            <Button
                                as={Link}
                                href={route("admin.customers.index")}
                                variant="secondary"
                            >
                                <ArrowLeft size={16} />
                                Customers
                            </Button>
                            <Button
                                as={Link}
                                href={route("admin.customers.edit", customer.id)}
                            >
                                <Edit3 size={16} />
                                Edit profile
                            </Button>
                        </>
                    }
                >
                    <div className="mt-3 flex flex-wrap gap-2">
                        <Badge tone="brand">{customer.customer_code}</Badge>
                        <Badge tone={customer.status ? "success" : "neutral"} dot>
                            {customer.status ? "Active" : "Inactive"}
                        </Badge>
                        <Badge tone="purple">
                            {customer.profile.tier || "Standard"}
                        </Badge>
                        <Badge tone="neutral">
                            {customer.profile.membership_number}
                        </Badge>
                        <Badge tone="brand">
                            {customer.statistics.customer_stage}
                        </Badge>
                    </div>
                </PageHeader>

                <Card className="overflow-hidden">
                    <CardBody className="p-0">
                        <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_auto]">
                            <div className="p-6 sm:p-7">
                                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                                    <span className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-brand-500 to-brand-800 text-2xl font-black text-white shadow-card">
                                        {initials}
                                    </span>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h2 className="text-2xl font-black text-ink-950">
                                                {customer.name}
                                            </h2>
                                            <Badge tone="purple">
                                                {customer.profile.tier || "Standard"} member
                                            </Badge>
                                        </div>

                                        <div className="mt-3 flex min-w-0 flex-wrap gap-x-5 gap-y-2 text-sm text-ink-500">
                                            <span className="inline-flex items-center gap-2">
                                                <Phone size={15} />
                                                {customer.phone}
                                            </span>
                                            <span className="inline-flex min-w-0 items-center gap-2">
                                                <Mail size={15} />
                                                <span className="min-w-0 break-all">{customer.email || "No email"}</span>
                                            </span>
                                            <span className="inline-flex items-center gap-2">
                                                <MapPin size={15} />
                                                {customer.address || "No address"}
                                            </span>
                                            <span className="inline-flex items-center gap-2">
                                                <CalendarDays size={15} />
                                                Joined{" "}
                                                {customer.created_at
                                                    ? new Date(customer.created_at).toLocaleDateString()
                                                    : "—"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-ink-100 bg-ink-50 px-6 py-5 xl:min-w-64 xl:border-l xl:border-t-0">
                                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-ink-400">
                                    Customer value
                                </p>
                                <p className="mt-2 text-3xl font-black text-brand-700">
                                    {money(customer.statistics.lifetime_spend)}
                                </p>
                                <p className="mt-1 text-xs text-ink-400">
                                    Lifetime spend
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        label="Lifetime spend"
                        value={money(customer.statistics.lifetime_spend)}
                        helper={`${customer.statistics.completed_sales} completed sale(s)`}
                        icon={Banknote}
                        tone="green"
                    />
                    <StatCard
                        label="Average order"
                        value={money(customer.statistics.average_order_value)}
                        helper={`${customer.statistics.total_orders} ecommerce order(s)`}
                        icon={ShoppingBag}
                        tone="brand"
                    />
                    <StatCard
                        label="Loyalty points"
                        value={customer.profile.points_balance}
                        helper={`${customer.profile.lifetime_points} lifetime points`}
                        icon={Gift}
                        tone="purple"
                    />
                    <StatCard
                        label="Wallet balance"
                        value={money(customer.profile.wallet_balance)}
                        helper={`${money(customer.current_balance)} outstanding due`}
                        icon={WalletCards}
                        tone="amber"
                    />
                </section>


                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <Card>
                        <CardBody className="flex items-center gap-4">
                            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-700">
                                <ShoppingBag size={19} />
                            </span>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-wider text-ink-400">
                                    Transactions
                                </p>
                                <p className="mt-1 text-xl font-black text-ink-950">
                                    {customer.statistics.total_transactions}
                                </p>
                            </div>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardBody className="flex items-center gap-4">
                            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-purple-50 text-purple-700">
                                <TrendingUp size={19} />
                            </span>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-wider text-ink-400">
                                    Purchase frequency
                                </p>
                                <p className="mt-1 text-xl font-black text-ink-950">
                                    {customer.statistics.purchase_frequency}
                                    <span className="ml-1 text-xs font-bold text-ink-400">/month</span>
                                </p>
                            </div>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardBody className="flex items-center gap-4">
                            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-amber-50 text-amber-700">
                                <Clock3 size={19} />
                            </span>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-wider text-ink-400">
                                    Last purchase
                                </p>
                                <p className="mt-1 text-sm font-black text-ink-950">
                                    {customer.statistics.last_purchase_at
                                        ? new Date(customer.statistics.last_purchase_at).toLocaleDateString()
                                        : "No purchase"}
                                </p>
                                <p className="mt-0.5 text-[10px] text-ink-400">
                                    {customer.statistics.days_since_last_purchase !== null
                                        ? `${customer.statistics.days_since_last_purchase} day(s) ago`
                                        : "No history"}
                                </p>
                            </div>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardBody className="flex items-center gap-4">
                            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                                <UserRound size={19} />
                            </span>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-wider text-ink-400">
                                    Customer stage
                                </p>
                                <p className="mt-1 text-xl font-black text-ink-950">
                                    {customer.statistics.customer_stage}
                                </p>
                            </div>
                        </CardBody>
                    </Card>
                </section>

                <div className="grid gap-6 xl:grid-cols-[minmax(260px,0.82fr)_minmax(0,1.45fr)] 2xl:grid-cols-[280px_minmax(0,1fr)_350px]">
                    <aside className="min-w-0 space-y-6">
                        <Card>
                            <CardHeader
                                title="Customer profile"
                                description="Identity and account information."
                            />
                            <CardBody className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-50 font-black text-brand-700">
                                        {initials}
                                    </span>
                                    <div className="min-w-0">
                                        <p className="truncate font-black text-ink-900">
                                            {customer.name}
                                        </p>
                                        <p className="mt-0.5 text-xs text-ink-400">
                                            {customer.customer_code}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3 rounded-2xl bg-ink-50 p-4 text-sm">
                                    <div className="flex items-start gap-3">
                                        <Phone size={15} className="mt-0.5 shrink-0 text-ink-400" />
                                        <span className="font-bold text-ink-700">{customer.phone}</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Mail size={15} className="mt-0.5 shrink-0 text-ink-400" />
                                        <span className="break-all text-ink-600">{customer.email || "No email"}</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin size={15} className="mt-0.5 shrink-0 text-ink-400" />
                                        <span className="leading-6 text-ink-600">{customer.address || "No address"}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-2xl border border-ink-200 p-3">
                                        <p className="text-[10px] font-black uppercase tracking-wider text-ink-400">
                                            Sales
                                        </p>
                                        <p className="mt-1 text-lg font-black text-ink-900">
                                            {customer.statistics.total_sales}
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border border-ink-200 p-3">
                                        <p className="text-[10px] font-black uppercase tracking-wider text-ink-400">
                                            Orders
                                        </p>
                                        <p className="mt-1 text-lg font-black text-ink-900">
                                            {customer.statistics.total_orders}
                                        </p>
                                    </div>
                                </div>

                                {customer.notes && (
                                    <div className="rounded-2xl bg-amber-50 p-4">
                                        <p className="text-[10px] font-black uppercase tracking-wider text-amber-700">
                                            Existing note
                                        </p>
                                        <p className="mt-2 text-sm leading-6 text-amber-900">
                                            {customer.notes}
                                        </p>
                                    </div>
                                )}
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader
                                title="Addresses"
                                description="Saved storefront delivery addresses."
                            />
                            <CardBody className="space-y-3">
                                {addresses.length > 0 ? (
                                    addresses.map((address) => (
                                        <div
                                            key={address.id}
                                            className="rounded-2xl border border-ink-200 p-4"
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="font-black text-ink-800">
                                                    {address.label || "Address"}
                                                </p>
                                                {address.is_default && (
                                                    <Badge tone="brand">
                                                        Default
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="mt-2 text-sm leading-6 text-ink-500">
                                                {[
                                                    address.address,
                                                    address.area,
                                                    address.district,
                                                    address.division,
                                                ]
                                                    .filter(Boolean)
                                                    .join(", ")}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <EmptyState
                                        icon={MapPin}
                                        title="No saved address"
                                        description="No storefront delivery address is linked to this customer."
                                    />
                                )}
                            </CardBody>
                        </Card>
                    </aside>

                    <main className="min-w-0 space-y-6">
                        <Card>
                            <CardHeader
                                title="Recent sales"
                                description="Latest POS and admin sales activity."
                            />
                            <CardBody className="p-3 sm:p-4">
                                {sales.length > 0 ? (
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <tr>
                                                    <TableHeader>Sale</TableHeader>
                                                    <TableHeader>Status</TableHeader>
                                                    <TableHeader className="text-right">
                                                        Total
                                                    </TableHeader>
                                                    <TableHeader className="text-right">
                                                        Due
                                                    </TableHeader>
                                                </tr>
                                            </TableHead>
                                            <TableBody>
                                                {sales.map((sale) => (
                                                    <TableRow key={sale.id}>
                                                        <TableCell>
                                                            <p className="font-black text-brand-700">
                                                                {sale.sale_number}
                                                            </p>
                                                            <p className="mt-1 text-[10px] text-ink-400">
                                                                {sale.created_at
                                                                    ? new Date(sale.created_at).toLocaleString()
                                                                    : ""}
                                                            </p>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge tone={statusTone(sale.sale_status)} dot>
                                                                {formatStatus(sale.sale_status)}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right font-black">
                                                            {money(sale.total)}
                                                        </TableCell>
                                                        <TableCell className="text-right font-black text-rose-600">
                                                            {money(sale.due_amount)}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                ) : (
                                    <EmptyState
                                        icon={ReceiptText}
                                        title="No sales yet"
                                        description="POS and admin sales linked to this customer will appear here."
                                    />
                                )}
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader
                                title="Ecommerce orders"
                                description="Latest storefront order activity."
                            />
                            <CardBody className="space-y-3">
                                {orders.length > 0 ? (
                                    orders.map((order) => (
                                        <Link
                                            key={order.id}
                                            href={route("admin.orders.show", order.id)}
                                            className="group block rounded-2xl border border-ink-200 p-4 transition hover:border-brand-200 hover:bg-brand-50/30"
                                        >
                                            <div className="flex min-w-0 flex-col gap-4">
                                                <div className="flex min-w-0 items-start justify-between gap-3">
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-black text-brand-700">
                                                            {order.order_no || `#${order.id}`}
                                                        </p>
                                                        <p className="mt-1 text-xs text-ink-400">
                                                            {order.created_at
                                                                ? new Date(order.created_at).toLocaleDateString()
                                                                : ""}
                                                        </p>
                                                    </div>

                                                    <Badge
                                                        tone={statusTone(order.status)}
                                                        dot
                                                        className="shrink-0"
                                                    >
                                                        {formatStatus(order.status)}
                                                    </Badge>
                                                </div>

                                                <div className="grid min-w-0 gap-3 border-t border-ink-100 pt-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                                                    <div className="min-w-0">
                                                        <p className="text-[10px] font-black uppercase tracking-wider text-ink-400">
                                                            Order total
                                                        </p>
                                                        <p className="mt-1 break-words text-lg font-black leading-tight text-ink-950 sm:text-xl">
                                                            {money(order.total)}
                                                        </p>
                                                    </div>

                                                    <span className="shrink-0 text-xs font-black text-brand-700 transition group-hover:translate-x-0.5">
                                                        View order →
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <EmptyState
                                        icon={PackageCheck}
                                        title="No ecommerce orders"
                                        description="Storefront orders linked to this customer will appear here."
                                    />
                                )}
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader
                                title="Activity timeline"
                                description="CRM events and staff actions."
                            />
                            <CardBody>
                                {timeline.length > 0 ? (
                                    <div className="relative space-y-1 before:absolute before:bottom-3 before:left-[18px] before:top-3 before:w-px before:bg-ink-200">
                                        {timeline.map((entry) => (
                                            <div key={entry.id} className="relative flex gap-3 py-3">
                                                <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-brand-100 bg-brand-50 text-brand-700">
                                                    <MessageSquarePlus size={16} />
                                                </span>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <p className="text-sm font-black text-ink-800">
                                                            {entry.title}
                                                        </p>
                                                        <Badge tone="neutral">
                                                            {formatStatus(entry.type)}
                                                        </Badge>
                                                    </div>
                                                    {entry.description && (
                                                        <p className="mt-1 text-sm leading-6 text-ink-500">
                                                            {entry.description}
                                                        </p>
                                                    )}
                                                    <div className="mt-2 flex flex-wrap items-center gap-2">
                                                        {entry.amount !== null &&
                                                            entry.amount !== undefined && (
                                                                <Badge tone={entry.type === "loyalty" ? "purple" : "brand"}>
                                                                    {entry.type === "loyalty"
                                                                        ? `${entry.amount} pts`
                                                                        : money(entry.amount)}
                                                                </Badge>
                                                            )}
                                                        {entry.status && (
                                                            <Badge tone={statusTone(entry.status)} dot>
                                                                {formatStatus(entry.status)}
                                                            </Badge>
                                                        )}
                                                        <span className="text-[10px] text-ink-400">
                                                            {entry.actor || entry.user?.name || "System"} ·{" "}
                                                            {entry.created_at
                                                                ? new Date(entry.created_at).toLocaleString()
                                                                : ""}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState
                                        icon={MessageSquarePlus}
                                        title="No CRM activity"
                                        description="Wallet, loyalty and note activity will be recorded here."
                                    />
                                )}
                            </CardBody>
                        </Card>
                    </main>

                    <aside className="space-y-6 xl:col-span-2 2xl:col-span-1">
                        <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-1">
                        <Card>
                            <CardHeader
                                title="Loyalty adjustment"
                                description="Award or deduct customer points."
                            />
                            <CardBody>
                                <form
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        points.post(
                                            route("admin.crm.points", customer.id),
                                            {
                                                preserveScroll: true,
                                                onSuccess: () => points.reset(),
                                            },
                                        );
                                    }}
                                    className="space-y-4"
                                >
                                    <FormField label="Points" error={points.errors.points}>
                                        <Input
                                            type="number"
                                            value={points.data.points}
                                            onChange={(event) =>
                                                points.setData("points", event.target.value)
                                            }
                                            placeholder="Use negative to deduct"
                                        />
                                    </FormField>
                                    <FormField label="Reason" error={points.errors.note}>
                                        <Textarea
                                            rows={2}
                                            value={points.data.note}
                                            onChange={(event) =>
                                                points.setData("note", event.target.value)
                                            }
                                        />
                                    </FormField>
                                    <Button
                                        type="submit"
                                        loading={points.processing}
                                        className="w-full"
                                    >
                                        <Sparkles size={16} />
                                        Update points
                                    </Button>
                                </form>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader
                                title="Wallet adjustment"
                                description="Credit or debit customer wallet."
                            />
                            <CardBody>
                                <form
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        wallet.post(
                                            route("admin.crm.wallet", customer.id),
                                            {
                                                preserveScroll: true,
                                                onSuccess: () => wallet.reset(),
                                            },
                                        );
                                    }}
                                    className="space-y-4"
                                >
                                    <FormField label="Amount" error={wallet.errors.amount}>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={wallet.data.amount}
                                            onChange={(event) =>
                                                wallet.setData("amount", event.target.value)
                                            }
                                            placeholder="Use negative to debit"
                                        />
                                    </FormField>
                                    <FormField label="Reason" error={wallet.errors.note}>
                                        <Textarea
                                            rows={2}
                                            value={wallet.data.note}
                                            onChange={(event) =>
                                                wallet.setData("note", event.target.value)
                                            }
                                        />
                                    </FormField>
                                    <Button
                                        type="submit"
                                        loading={wallet.processing}
                                        className="w-full"
                                    >
                                        <CreditCard size={16} />
                                        Update wallet
                                    </Button>
                                </form>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader
                                title="Wallet history"
                                description="Latest customer wallet transactions."
                            />
                            <CardBody className="space-y-3">
                                {(customer.wallet_transactions || []).length > 0 ? (
                                    customer.wallet_transactions.slice(0, 6).map((transaction) => (
                                        <div
                                            key={transaction.id}
                                            className="flex items-start justify-between gap-3 rounded-2xl border border-ink-200 p-3"
                                        >
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Badge
                                                        tone={transaction.type === "credit" ? "success" : "warning"}
                                                        dot
                                                    >
                                                        {formatStatus(transaction.type)}
                                                    </Badge>
                                                    <span className="text-xs font-black text-ink-800">
                                                        {money(transaction.amount)}
                                                    </span>
                                                </div>
                                                <p className="mt-1 line-clamp-2 text-xs text-ink-400">
                                                    {transaction.note || transaction.reference || "Wallet adjustment"}
                                                </p>
                                            </div>
                                            <span className="shrink-0 text-[10px] text-ink-400">
                                                {transaction.created_at
                                                    ? new Date(transaction.created_at).toLocaleDateString()
                                                    : ""}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="py-6 text-center text-xs text-ink-400">
                                        No wallet transactions.
                                    </p>
                                )}
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader
                                title="Loyalty history"
                                description="Latest points earned and redeemed."
                            />
                            <CardBody className="space-y-3">
                                {(customer.loyalty_transactions || []).length > 0 ? (
                                    customer.loyalty_transactions.slice(0, 6).map((transaction) => (
                                        <div
                                            key={transaction.id}
                                            className="flex items-start justify-between gap-3 rounded-2xl border border-ink-200 p-3"
                                        >
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Badge
                                                        tone={transaction.type === "credit" ? "purple" : "warning"}
                                                        dot
                                                    >
                                                        {formatStatus(transaction.type)}
                                                    </Badge>
                                                    <span className="text-xs font-black text-ink-800">
                                                        {transaction.points} pts
                                                    </span>
                                                </div>
                                                <p className="mt-1 line-clamp-2 text-xs text-ink-400">
                                                    {transaction.note || transaction.reference || "Loyalty activity"}
                                                </p>
                                            </div>
                                            <span className="shrink-0 text-[10px] text-ink-400">
                                                {transaction.created_at
                                                    ? new Date(transaction.created_at).toLocaleDateString()
                                                    : ""}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="py-6 text-center text-xs text-ink-400">
                                        No loyalty transactions.
                                    </p>
                                )}
                            </CardBody>
                        </Card>

                        <Card className="md:col-span-2 2xl:col-span-1">
                            <CardHeader
                                title="Internal note"
                                description="Visible only to authorised staff."
                            />
                            <CardBody>
                                <form
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        note.post(
                                            route("admin.crm.notes", customer.id),
                                            {
                                                preserveScroll: true,
                                                onSuccess: () => note.reset(),
                                            },
                                        );
                                    }}
                                    className="space-y-4"
                                >
                                    <FormField label="Note" error={note.errors.note}>
                                        <Textarea
                                            rows={4}
                                            value={note.data.note}
                                            onChange={(event) =>
                                                note.setData("note", event.target.value)
                                            }
                                            placeholder="Customer preferences, follow-up instructions, priority information..."
                                        />
                                    </FormField>
                                    <Button
                                        type="submit"
                                        loading={note.processing}
                                        variant="secondary"
                                        className="w-full"
                                    >
                                        <MessageSquarePlus size={16} />
                                        Add note
                                    </Button>
                                </form>
                            </CardBody>
                        </Card>
                        </div>
                    </aside>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

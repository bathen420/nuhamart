import { Head, Link, router } from "@inertiajs/react";
import {
    Banknote,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Eye,
    Filter,
    PackageCheck,
    Pencil,
    Plus,
    Search,
    ShoppingBag,
    Truck,
    XCircle,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Badge,
    Button,
    Card,
    CardBody,
    PageHeader,
    Select,
    StatCard,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/Admin/UI";
import Input from "@/Components/Admin/UI/Input";

const orderTones = {
    pending: "warning",
    confirmed: "info",
    processing: "brand",
    shipped: "purple",
    delivered: "success",
    cancelled: "danger",
};

const paymentTones = {
    pending: "warning",
    paid: "success",
    failed: "danger",
    refunded: "purple",
};

const formatStatus = (value) =>
    String(value || "n/a")
        .replaceAll("_", " ")
        .replace(/\b\w/g, (character) => character.toUpperCase());

export default function Index({
    orders = {},
    filters = {},
    summary = {},
}) {
    const rows = orders.data || [];
    const money = (value) =>
        `৳${new Intl.NumberFormat("en-BD", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(Number(value || 0))}`;

    const applyFilters = (event) => {
        event.preventDefault();
        const query = Object.fromEntries(new FormData(event.currentTarget));
        Object.keys(query).forEach(
            (key) => query[key] === "" && delete query[key],
        );

        router.get(route("admin.orders.index"), query, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Orders" />

            <div className="space-y-6">
                <PageHeader
                    eyebrow="Sales operations"
                    title="Orders"
                    description="Manage customer orders, payment, fulfilment, courier delivery and invoices."
                    actions={
                        <Button as={Link} href={route("admin.orders.create")}>
                            <Plus size={16} />
                            Create order
                        </Button>
                    }
                />

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        label="All orders"
                        value={summary.total || 0}
                        helper={`${summary.today || 0} received today`}
                        icon={ShoppingBag}
                        tone="brand"
                    />
                    <StatCard
                        label="Needs attention"
                        value={(summary.pending || 0) + (summary.processing || 0)}
                        helper={`${summary.pending || 0} pending · ${summary.processing || 0} processing`}
                        icon={Clock3}
                        tone="amber"
                    />
                    <StatCard
                        label="In delivery"
                        value={summary.shipped || 0}
                        helper={`${summary.delivered || 0} delivered`}
                        icon={Truck}
                        tone="purple"
                    />
                    <StatCard
                        label="Delivered revenue"
                        value={money(summary.revenue)}
                        helper={`${summary.pending_payment || 0} payment(s) pending`}
                        icon={Banknote}
                        tone="green"
                    />
                </section>

                <Card>
                    <CardBody>
                        <form
                            onSubmit={applyFilters}
                            className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8"
                        >
                            <div className="relative xl:col-span-2">
                                <Search
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
                                />
                                <Input
                                    name="search"
                                    defaultValue={filters.search || ""}
                                    placeholder="Order, customer, phone or tracking..."
                                    className="pl-9"
                                />
                            </div>

                            <Select
                                name="status"
                                defaultValue={filters.status || ""}
                            >
                                <option value="">All order status</option>
                                {[
                                    "pending",
                                    "confirmed",
                                    "processing",
                                    "shipped",
                                    "delivered",
                                    "cancelled",
                                ].map((value) => (
                                    <option key={value} value={value}>
                                        {formatStatus(value)}
                                    </option>
                                ))}
                            </Select>

                            <Select
                                name="payment_status"
                                defaultValue={filters.payment_status || ""}
                            >
                                <option value="">All payment status</option>
                                {["pending", "paid", "failed"].map((value) => (
                                    <option key={value} value={value}>
                                        {formatStatus(value)}
                                    </option>
                                ))}
                            </Select>

                            <Select
                                name="payment_method"
                                defaultValue={filters.payment_method || ""}
                            >
                                <option value="">All payment methods</option>
                                {["cod", "sslcommerz", "bkash", "nagad"].map(
                                    (value) => (
                                        <option key={value} value={value}>
                                            {formatStatus(value)}
                                        </option>
                                    ),
                                )}
                            </Select>

                            <Input
                                name="courier"
                                defaultValue={filters.courier || ""}
                                placeholder="Courier"
                            />

                            <Input
                                name="date_from"
                                type="date"
                                defaultValue={filters.date_from || ""}
                            />

                            <Input
                                name="date_to"
                                type="date"
                                defaultValue={filters.date_to || ""}
                            />

                            <Select
                                name="sort"
                                defaultValue={filters.sort || "latest"}
                            >
                                <option value="latest">Latest first</option>
                                <option value="oldest">Oldest first</option>
                                <option value="total_high">
                                    Highest total
                                </option>
                                <option value="total_low">Lowest total</option>
                            </Select>

                            <div className="flex gap-2 xl:col-span-3 2xl:col-span-2">
                                <Button type="submit" className="flex-1">
                                    <Filter size={15} />
                                    Apply filters
                                </Button>
                                <Button
                                    as={Link}
                                    href={route("admin.orders.index")}
                                    variant="secondary"
                                >
                                    Reset
                                </Button>
                            </div>
                        </form>
                    </CardBody>
                </Card>

                <Card>
                    <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4 sm:px-6">
                        <div>
                            <h2 className="font-black text-ink-950">
                                Order queue
                            </h2>
                            <p className="mt-1 text-xs text-ink-400">
                                {orders.total || rows.length} matching order(s)
                            </p>
                        </div>
                        <Badge tone="brand">
                            Page {orders.current_page || 1}
                        </Badge>
                    </div>

                    <div className="p-3 sm:p-4">
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <tr>
                                        <TableHeader>Order</TableHeader>
                                        <TableHeader>Customer</TableHeader>
                                        <TableHeader>Payment</TableHeader>
                                        <TableHeader>Fulfilment</TableHeader>
                                        <TableHeader>Courier</TableHeader>
                                        <TableHeader className="text-right">
                                            Total
                                        </TableHeader>
                                        <TableHeader className="text-right">
                                            Actions
                                        </TableHeader>
                                    </tr>
                                </TableHead>
                                <TableBody>
                                    {rows.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell>
                                                <Link
                                                    href={route(
                                                        "admin.orders.show",
                                                        order.id,
                                                    )}
                                                    className="font-black text-brand-700 hover:text-brand-900"
                                                >
                                                    {order.order_no ||
                                                        `#${order.id}`}
                                                </Link>
                                                <p className="mt-1 flex items-center gap-1 text-[10px] font-medium text-ink-400">
                                                    <CalendarDays size={11} />
                                                    {new Date(
                                                        order.created_at,
                                                    ).toLocaleString()}
                                                    <span>
                                                        · {order.items_count}{" "}
                                                        item(s)
                                                    </span>
                                                </p>
                                            </TableCell>
                                            <TableCell>
                                                <p className="font-black text-ink-800">
                                                    {order.customer_name}
                                                </p>
                                                <p className="mt-1 text-[10px] text-ink-400">
                                                    {order.customer_phone}
                                                </p>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    tone={
                                                        paymentTones[
                                                            order.payment_status
                                                        ] || "neutral"
                                                    }
                                                    dot
                                                >
                                                    {formatStatus(
                                                        order.payment_status,
                                                    )}
                                                </Badge>
                                                <p className="mt-2 text-[10px] font-bold uppercase text-ink-400">
                                                    {order.payment_method}
                                                </p>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    tone={
                                                        orderTones[
                                                            order.status
                                                        ] || "neutral"
                                                    }
                                                    dot
                                                >
                                                    {formatStatus(order.status)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <p className="font-bold text-ink-700">
                                                    {order.courier_name || "—"}
                                                </p>
                                                <p className="mt-1 max-w-32 truncate text-[10px] text-ink-400">
                                                    {order.tracking_number ||
                                                        "Not booked"}
                                                </p>
                                            </TableCell>
                                            <TableCell className="text-right font-black text-ink-950">
                                                {money(order.total)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        as={Link}
                                                        href={route(
                                                            "admin.orders.show",
                                                            order.id,
                                                        )}
                                                        variant="ghost"
                                                        size="icon"
                                                        title="View order"
                                                    >
                                                        <Eye size={16} />
                                                    </Button>
                                                    <Button
                                                        as={Link}
                                                        href={route(
                                                            "admin.orders.edit",
                                                            order.id,
                                                        )}
                                                        variant="ghost"
                                                        size="icon"
                                                        title="Edit order"
                                                    >
                                                        <Pencil size={16} />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {rows.length === 0 && (
                            <div className="py-14 text-center">
                                <PackageCheck
                                    size={32}
                                    className="mx-auto text-ink-300"
                                />
                                <p className="mt-3 font-black text-ink-700">
                                    No orders found
                                </p>
                                <p className="mt-1 text-xs text-ink-400">
                                    Adjust the filters or create a new order.
                                </p>
                            </div>
                        )}

                        {(orders.links || []).length > 0 && (
                            <div className="mt-4 flex flex-wrap justify-center gap-2">
                                {orders.links.map((link, index) =>
                                    link.url ? (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            preserveScroll
                                            preserveState
                                            className={`rounded-lg border px-3 py-2 text-xs font-black ${
                                                link.active
                                                    ? "border-brand-700 bg-brand-700 text-white"
                                                    : "border-ink-200 bg-white text-ink-600 hover:bg-ink-50"
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ) : (
                                        <span
                                            key={index}
                                            className="rounded-lg border border-ink-100 px-3 py-2 text-xs text-ink-300"
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ),
                                )}
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}

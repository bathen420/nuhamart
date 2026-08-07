import { Head, Link, router, usePage } from "@inertiajs/react";
import {
    Banknote,
    Eye,
    Filter,
    Pencil,
    Plus,
    Search,
    Trash2,
    UserCheck,
    UserRound,
    Users,
    UserX,
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

export default function Index({ customers = {}, filters = {}, summary = {} }) {
    const { businessSettings = {} } = usePage().props;
    const currency = businessSettings.currency_symbol || "৳";
    const rows = customers.data || [];

    const money = (value) =>
        `${currency}${new Intl.NumberFormat("en-BD", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(Number(value || 0))}`;

    const apply = (event) => {
        event.preventDefault();
        const query = Object.fromEntries(new FormData(event.currentTarget));
        Object.keys(query).forEach(
            (key) => query[key] === "" && delete query[key],
        );

        router.get(route("admin.customers.index"), query, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Customers & CRM" />

            <div className="space-y-6">
                <PageHeader
                    eyebrow="Customer relationship management"
                    title="Customers"
                    description="Manage customer profiles, lifetime value, loyalty, wallet, balances and purchase activity."
                    actions={
                        <Button as={Link} href={route("admin.customers.create")}>
                            <Plus size={16} />
                            Add customer
                        </Button>
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
                        label="Active customers"
                        value={summary.active_customers || 0}
                        helper={`${summary.returning_customers || 0} returning`}
                        icon={UserCheck}
                        tone="green"
                    />
                    <StatCard
                        label="Lifetime revenue"
                        value={money(summary.lifetime_revenue)}
                        helper="Completed sales"
                        icon={Banknote}
                        tone="purple"
                    />
                    <StatCard
                        label="Outstanding due"
                        value={money(summary.total_due)}
                        helper="Current customer balances"
                        icon={UserX}
                        tone="amber"
                    />
                </section>

                <Card>
                    <CardBody>
                        <form
                            onSubmit={apply}
                            className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(260px,2fr)_1fr_1fr_140px_auto]"
                        >
                            <div className="relative">
                                <Search
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
                                />
                                <Input
                                    name="search"
                                    defaultValue={filters.search || ""}
                                    placeholder="Code, name, phone or email..."
                                    className="pl-9"
                                />
                            </div>

                            <Select
                                name="status"
                                defaultValue={filters.status ?? ""}
                            >
                                <option value="">All status</option>
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </Select>

                            <Select
                                name="segment"
                                defaultValue={filters.segment || ""}
                            >
                                <option value="">All segments</option>
                                <option value="new">New this month</option>
                                <option value="returning">Returning</option>
                                <option value="vip">VIP</option>
                                <option value="due">Outstanding due</option>
                            </Select>

                            <Select
                                name="per_page"
                                defaultValue={String(filters.per_page || 15)}
                            >
                                {[10, 15, 25, 50, 100].map((value) => (
                                    <option key={value} value={value}>
                                        {value} rows
                                    </option>
                                ))}
                            </Select>

                            <div className="flex gap-2">
                                <Button type="submit" className="flex-1">
                                    <Filter size={15} />
                                    Apply
                                </Button>
                                <Button
                                    as={Link}
                                    href={route("admin.customers.index")}
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
                                Customer directory
                            </h2>
                            <p className="mt-1 text-xs text-ink-400">
                                {customers.total || rows.length} matching customer(s)
                            </p>
                        </div>
                        <Badge tone="brand">
                            Page {customers.current_page || 1}
                        </Badge>
                    </div>

                    <div className="p-3 sm:p-4">
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <tr>
                                        <TableHeader>Customer</TableHeader>
                                        <TableHeader>Contact</TableHeader>
                                        <TableHeader>Segment</TableHeader>
                                        <TableHeader>Orders</TableHeader>
                                        <TableHeader className="text-right">
                                            Lifetime value
                                        </TableHeader>
                                        <TableHeader className="text-right">
                                            Balance
                                        </TableHeader>
                                        <TableHeader>Status</TableHeader>
                                        <TableHeader className="text-right">
                                            Actions
                                        </TableHeader>
                                    </tr>
                                </TableHead>

                                <TableBody>
                                    {rows.map((customer) => (
                                        <TableRow key={customer.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-black text-white">
                                                        {customer.name
                                                            ?.split(/\s+/)
                                                            .slice(0, 2)
                                                            .map((part) =>
                                                                part.charAt(0),
                                                            )
                                                            .join("")
                                                            .toUpperCase()}
                                                    </span>
                                                    <div className="min-w-0">
                                                        <Link
                                                            href={route(
                                                                "admin.crm.show",
                                                                customer.id,
                                                            )}
                                                            className="block max-w-56 truncate font-black text-ink-900 hover:text-brand-700"
                                                        >
                                                            {customer.name}
                                                        </Link>
                                                        <p className="mt-1 text-[10px] font-bold text-ink-400">
                                                            {customer.customer_code}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <p className="font-bold text-ink-700">
                                                    {customer.phone}
                                                </p>
                                                <p className="mt-1 max-w-52 truncate text-[10px] text-ink-400">
                                                    {customer.email || "No email"}
                                                </p>
                                            </TableCell>

                                            <TableCell>
                                                <Badge
                                                    tone={
                                                        customer.crm_profile
                                                            ?.loyalty_tier
                                                            ? "purple"
                                                            : "neutral"
                                                    }
                                                >
                                                    {customer.crm_profile
                                                        ?.loyalty_tier?.name ||
                                                        (customer.sales_count >= 2
                                                            ? "Returning"
                                                            : "Standard")}
                                                </Badge>
                                                <p className="mt-2 text-[10px] text-ink-400">
                                                    {customer.crm_profile
                                                        ?.points_balance || 0}{" "}
                                                    points
                                                </p>
                                            </TableCell>

                                            <TableCell>
                                                <p className="font-black text-ink-800">
                                                    {customer.sales_count || 0}
                                                </p>
                                                <p className="mt-1 text-[10px] text-ink-400">
                                                    {customer.last_purchase_at
                                                        ? new Date(
                                                              customer.last_purchase_at,
                                                          ).toLocaleDateString()
                                                        : "No purchase"}
                                                </p>
                                            </TableCell>

                                            <TableCell className="text-right font-black text-ink-950">
                                                {money(customer.lifetime_spend)}
                                            </TableCell>

                                            <TableCell className="text-right">
                                                <span
                                                    className={
                                                        Number(
                                                            customer.current_balance,
                                                        ) > 0
                                                            ? "font-black text-rose-600"
                                                            : "font-black text-emerald-600"
                                                    }
                                                >
                                                    {money(
                                                        customer.current_balance,
                                                    )}
                                                </span>
                                            </TableCell>

                                            <TableCell>
                                                <Badge
                                                    tone={
                                                        customer.status
                                                            ? "success"
                                                            : "neutral"
                                                    }
                                                    dot
                                                >
                                                    {customer.status
                                                        ? "Active"
                                                        : "Inactive"}
                                                </Badge>
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        as={Link}
                                                        href={route(
                                                            "admin.crm.show",
                                                            customer.id,
                                                        )}
                                                        variant="ghost"
                                                        size="icon"
                                                        title="360° profile"
                                                    >
                                                        <Eye size={16} />
                                                    </Button>
                                                    <Button
                                                        as={Link}
                                                        href={route(
                                                            "admin.customers.edit",
                                                            customer.id,
                                                        )}
                                                        variant="ghost"
                                                        size="icon"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={16} />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-rose-600 hover:bg-rose-50"
                                                        title="Delete"
                                                        onClick={() => {
                                                            if (
                                                                window.confirm(
                                                                    `Delete ${customer.name}?`,
                                                                )
                                                            ) {
                                                                router.delete(
                                                                    route(
                                                                        "admin.customers.destroy",
                                                                        customer.id,
                                                                    ),
                                                                    {
                                                                        preserveScroll: true,
                                                                    },
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 size={16} />
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
                                <UserRound
                                    size={32}
                                    className="mx-auto text-ink-300"
                                />
                                <p className="mt-3 font-black text-ink-700">
                                    No customers found
                                </p>
                            </div>
                        )}

                        {(customers.links || []).length > 0 && (
                            <div className="mt-4 flex flex-wrap justify-center gap-2">
                                {customers.links.map((link, index) =>
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

import { Head, Link, router, useForm } from "@inertiajs/react";
import { CalendarDays, Package, Search, X } from "lucide-react";
import CustomerAccountLayout from "@/Layouts/CustomerAccountLayout";

const money = (value) => `৳${Number(value || 0).toLocaleString("en-BD")}`;

const statuses = [
    ["all", "All"],
    ["pending", "Pending"],
    ["confirmed", "Confirmed"],
    ["processing", "Processing"],
    ["shipped", "Shipped"],
    ["delivered", "Delivered"],
    ["cancelled", "Cancelled"],
];

const statusClass = {
    pending: "bg-amber-50 text-amber-700",
    confirmed: "bg-blue-50 text-blue-700",
    processing: "bg-indigo-50 text-indigo-700",
    shipped: "bg-violet-50 text-violet-700",
    delivered: "bg-emerald-50 text-emerald-700",
    cancelled: "bg-rose-50 text-rose-700",
};

export default function Orders({ orders, filters, statusCounts }) {
    const form = useForm({
        search: filters.search || "",
        status: filters.status || "all",
        from: filters.from || "",
        to: filters.to || "",
    });

    const apply = (event) => {
        event.preventDefault();

        router.get(route("customer.orders.index"), form.data, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const selectStatus = (status) => {
        form.setData("status", status);

        router.get(
            route("customer.orders.index"),
            { ...form.data, status },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const reset = () => {
        form.setData({
            search: "",
            status: "all",
            from: "",
            to: "",
        });

        router.get(route("customer.orders.index"));
    };

    return (
        <CustomerAccountLayout title="My Orders">
            <Head title="My Orders" />

            <div className="space-y-5">
                <section className="rounded-3xl bg-white p-5 shadow-sm">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[.2em] text-teal-700">
                                Purchase history
                            </p>
                            <h1 className="mt-2 text-3xl font-black text-slate-900">
                                My Orders
                            </h1>
                            <p className="mt-2 text-sm text-slate-500">
                                Search, filter and review every order from one place.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-teal-50 px-4 py-3 text-right">
                            <p className="text-xs font-bold text-teal-700">
                                Total orders
                            </p>
                            <p className="text-2xl font-black text-teal-900">
                                {statusCounts.all || 0}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
                        {statuses.map(([value, label]) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => selectStatus(value)}
                                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-black transition ${
                                    form.data.status === value
                                        ? "bg-teal-700 text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-teal-50 hover:text-teal-700"
                                }`}
                            >
                                {label} ({statusCounts[value] || 0})
                            </button>
                        ))}
                    </div>

                    <form
                        onSubmit={apply}
                        className="mt-5 grid gap-3 lg:grid-cols-[1fr_170px_170px_auto_auto]"
                    >
                        <label className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                value={form.data.search}
                                onChange={(event) => form.setData("search", event.target.value)}
                                placeholder="Search order number..."
                                className="w-full rounded-xl border-slate-300 pl-10 focus:border-teal-600 focus:ring-teal-600"
                            />
                        </label>

                        <label className="relative">
                            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                            <input
                                type="date"
                                value={form.data.from}
                                onChange={(event) => form.setData("from", event.target.value)}
                                className="w-full rounded-xl border-slate-300 pl-10 focus:border-teal-600 focus:ring-teal-600"
                            />
                        </label>

                        <label className="relative">
                            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                            <input
                                type="date"
                                value={form.data.to}
                                onChange={(event) => form.setData("to", event.target.value)}
                                className="w-full rounded-xl border-slate-300 pl-10 focus:border-teal-600 focus:ring-teal-600"
                            />
                        </label>

                        <button className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-black text-white hover:bg-teal-700">
                            Apply
                        </button>

                        <button
                            type="button"
                            onClick={reset}
                            className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-600"
                        >
                            <X size={17} />
                            Reset
                        </button>
                    </form>
                </section>

                <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
                    {orders.data.length ? (
                        <div className="divide-y divide-slate-100">
                            {orders.data.map((order) => (
                                <Link
                                    key={order.id}
                                    href={route("customer.orders.show", order.id)}
                                    className="grid gap-4 p-5 transition hover:bg-slate-50 sm:grid-cols-[1.4fr_.7fr_.8fr_.7fr] sm:items-center"
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-700">
                                            <Package size={21} />
                                        </span>
                                        <div>
                                            <b className="text-slate-900">{order.order_no}</b>
                                            <p className="mt-1 text-xs text-slate-500">
                                                {order.ordered_at
                                                    ? new Date(order.ordered_at).toLocaleString()
                                                    : "Date unavailable"}
                                            </p>
                                        </div>
                                    </div>

                                    <span className="text-sm font-semibold text-slate-600">
                                        {order.items_count} item(s)
                                    </span>

                                    <div>
                                        <span
                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-black capitalize ${
                                                statusClass[order.status] || "bg-slate-100 text-slate-700"
                                            }`}
                                        >
                                            {order.status}
                                        </span>
                                        {order.cancellation_requested_at && (
                                            <p className="mt-2 text-xs font-bold text-rose-600">
                                                Cancellation requested
                                            </p>
                                        )}
                                    </div>

                                    <b className="text-lg text-slate-900 sm:text-right">
                                        {money(order.total)}
                                    </b>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center">
                            <Package className="mx-auto h-14 w-14 text-slate-300" />
                            <h2 className="mt-4 text-xl font-black text-slate-800">
                                No orders found
                            </h2>
                            <p className="mt-2 text-sm text-slate-500">
                                Try changing your filters or continue shopping.
                            </p>
                            <Link
                                href={route("storefront.catalog")}
                                className="mt-5 inline-flex rounded-xl bg-teal-700 px-6 py-3 text-sm font-black text-white"
                            >
                                Explore products
                            </Link>
                        </div>
                    )}

                    {orders.links?.length > 3 && (
                        <div className="flex flex-wrap justify-center gap-2 border-t p-5">
                            {orders.links.map((link, index) => (
                                link.url ? (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        preserveScroll
                                        className={`rounded-lg px-3 py-2 text-sm font-bold ${
                                            link.active
                                                ? "bg-teal-700 text-white"
                                                : "bg-slate-100 text-slate-600"
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        key={index}
                                        className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-300"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                )
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </CustomerAccountLayout>
    );
}

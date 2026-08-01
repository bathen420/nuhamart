import { Head, Link, router, usePage } from "@inertiajs/react";
import { useMemo, useState } from "react";
import {
    Download,
    FileSpreadsheet,
    Printer,
    RotateCcw,
    Search,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Pagination from "@/Components/Pagination";

function money(value) {
    const number = Number(value ?? 0);

    return new Intl.NumberFormat("en-BD", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number.isFinite(number) ? number : 0);
}

function dateTime(value) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
    });
}

const statusClass = {
    completed: "bg-green-100 text-green-700",
    partially_returned: "bg-amber-100 text-amber-700",
    fully_returned: "bg-red-100 text-red-700",
};

export default function Index({
    sales = {},
    summary = {},
    filters = {},
    customers = [],
    paymentMethods = [],
}) {
    const { businessSettings = {} } = usePage().props;
    const currency = businessSettings.currency_symbol ?? "৳";
    const rows = Array.isArray(sales.data) ? sales.data : [];
    const links = Array.isArray(sales.links) ? sales.links : [];

    const [form, setForm] = useState({
        date_from: filters.date_from ?? "",
        date_to: filters.date_to ?? "",
        search: filters.search ?? "",
        customer_id: filters.customer_id ?? "",
        payment_method: filters.payment_method ?? "",
        payment_status: filters.payment_status ?? "",
    });

    const query = useMemo(
        () =>
            Object.fromEntries(
                Object.entries(form).filter(
                    ([, value]) => value !== "" && value !== null
                )
            ),
        [form]
    );

    const change = (key, value) =>
        setForm((current) => ({ ...current, [key]: value }));

    const submit = (event) => {
        event.preventDefault();

        router.get(route("admin.reports.sales"), query, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const reset = () => {
        const next = {
            date_from: filters.date_from ?? "",
            date_to: filters.date_to ?? "",
            search: "",
            customer_id: "",
            payment_method: "",
            payment_status: "",
        };

        setForm(next);

        router.get(
            route("admin.reports.sales"),
            {
                date_from: next.date_from,
                date_to: next.date_to,
            },
            { replace: true }
        );
    };

    const printUrl = route("admin.reports.sales.print", query);
    const csvUrl = route("admin.reports.sales.export", query);
    const excelUrl = route("admin.reports.sales.export-excel", query);

    const openPrintView = () => {
        window.open(printUrl, "_blank", "noopener,noreferrer");
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                        Sales Report
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Gross sales, returns and net sales for the selected
                        sales period.
                    </p>
                </div>
            }
        >
            <Head title="Sales Report" />

            <section className="mx-auto max-w-screen-2xl space-y-5">
                <form
                    onSubmit={submit}
                    className="grid gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:grid-cols-2 xl:grid-cols-6"
                >
                    <label>
                        <span className="mb-1 block text-xs font-semibold uppercase text-gray-500">
                            Date From
                        </span>
                        <input
                            type="date"
                            value={form.date_from}
                            onChange={(event) =>
                                change("date_from", event.target.value)
                            }
                            className="w-full rounded-lg border-gray-300"
                        />
                    </label>

                    <label>
                        <span className="mb-1 block text-xs font-semibold uppercase text-gray-500">
                            Date To
                        </span>
                        <input
                            type="date"
                            value={form.date_to}
                            onChange={(event) =>
                                change("date_to", event.target.value)
                            }
                            className="w-full rounded-lg border-gray-300"
                        />
                    </label>

                    <label>
                        <span className="mb-1 block text-xs font-semibold uppercase text-gray-500">
                            Customer
                        </span>
                        <select
                            value={form.customer_id}
                            onChange={(event) =>
                                change("customer_id", event.target.value)
                            }
                            className="w-full rounded-lg border-gray-300"
                        >
                            <option value="">All customers</option>
                            {customers.map((customer) => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        <span className="mb-1 block text-xs font-semibold uppercase text-gray-500">
                            Payment Method
                        </span>
                        <select
                            value={form.payment_method}
                            onChange={(event) =>
                                change("payment_method", event.target.value)
                            }
                            className="w-full rounded-lg border-gray-300"
                        >
                            <option value="">All methods</option>
                            {paymentMethods.map((method) => (
                                <option key={method} value={method}>
                                    {method}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        <span className="mb-1 block text-xs font-semibold uppercase text-gray-500">
                            Payment Status
                        </span>
                        <select
                            value={form.payment_status}
                            onChange={(event) =>
                                change("payment_status", event.target.value)
                            }
                            className="w-full rounded-lg border-gray-300"
                        >
                            <option value="">All statuses</option>
                            <option value="Paid">Paid</option>
                            <option value="Partial">Partial</option>
                            <option value="Due">Due</option>
                        </select>
                    </label>

                    <label>
                        <span className="mb-1 block text-xs font-semibold uppercase text-gray-500">
                            Search
                        </span>
                        <input
                            value={form.search}
                            onChange={(event) =>
                                change("search", event.target.value)
                            }
                            placeholder="Sale no. or customer"
                            className="w-full rounded-lg border-gray-300"
                        />
                    </label>

                    <div className="flex flex-wrap gap-2 md:col-span-2 xl:col-span-6">
                        <button
                            type="submit"
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700"
                        >
                            <Search size={17} /> Apply Filters
                        </button>

                        <button
                            type="button"
                            onClick={reset}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            <RotateCcw size={17} /> Reset
                        </button>

                        <button
                            type="button"
                            onClick={openPrintView}
                            className="inline-flex items-center gap-2 rounded-lg bg-gray-700 px-4 py-2.5 font-semibold text-white hover:bg-gray-800"
                        >
                            <Printer size={17} /> Print / PDF
                        </button>

                        <a
                            href={csvUrl}
                            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white hover:bg-emerald-700"
                        >
                            <Download size={17} /> CSV
                        </a>

                        <a
                            href={excelUrl}
                            className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 font-semibold text-white hover:bg-green-800"
                        >
                            <FileSpreadsheet size={17} /> Excel
                        </a>

                        <Link
                            href={route("admin.reports.index", {
                                date_from: form.date_from,
                                date_to: form.date_to,
                            })}
                            className="ml-auto rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Reports Dashboard
                        </Link>
                    </div>
                </form>

                <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                    This report filters sales by sale date. Returned and net
                    values include all completed returns linked to those sales,
                    so every row and the grand totals always reconcile.
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    <SummaryCard
                        label="Gross Sales"
                        value={`${currency}${money(summary.gross_sales)}`}
                        valueClass="text-blue-700"
                    />
                    <SummaryCard
                        label="Sales Returns"
                        value={`${currency}${money(summary.sales_returns)}`}
                        valueClass="text-red-600"
                    />
                    <SummaryCard
                        label="Net Sales"
                        value={`${currency}${money(summary.net_sales)}`}
                        valueClass="text-green-700"
                    />
                    <SummaryCard
                        label="Sales Count"
                        value={summary.sales_count ?? 0}
                        valueClass="text-gray-900"
                    />
                    <SummaryCard
                        label="Average Net Sale"
                        value={`${currency}${money(summary.average_sale)}`}
                        valueClass="text-purple-700"
                    />
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <ReportHeading>Sale No.</ReportHeading>
                                    <ReportHeading>Date</ReportHeading>
                                    <ReportHeading>Customer</ReportHeading>
                                    <ReportHeading>Payment</ReportHeading>
                                    <ReportHeading align="right">
                                        Gross
                                    </ReportHeading>
                                    <ReportHeading align="right">
                                        Returned
                                    </ReportHeading>
                                    <ReportHeading align="right">
                                        Net
                                    </ReportHeading>
                                    <ReportHeading>Status</ReportHeading>
                                    <ReportHeading align="center">
                                        Action
                                    </ReportHeading>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {rows.length > 0 ? (
                                    rows.map((sale) => (
                                        <tr
                                            key={sale.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-gray-900">
                                                {sale.sale_number}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                                {dateTime(sale.created_at)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {sale.customer?.name ??
                                                    "Walk-in Customer"}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                <div>{sale.payment_method}</div>
                                                <div className="text-xs text-gray-500">
                                                    {sale.payment_status}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold">
                                                {currency}
                                                {money(sale.gross_total)}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-red-600">
                                                {currency}
                                                {money(sale.returned_total)}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-bold text-green-700">
                                                {currency}
                                                {money(sale.net_total)}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                        statusClass[
                                                            sale.return_status
                                                        ] ??
                                                        "bg-gray-100 text-gray-700"
                                                    }`}
                                                >
                                                    {sale.return_status_label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Link
                                                    href={route(
                                                        "admin.sales.show",
                                                        sale.id
                                                    )}
                                                    className="rounded bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={9}
                                            className="px-4 py-14 text-center text-gray-500"
                                        >
                                            No sales found for the selected
                                            filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                            {rows.length > 0 && (
                                <tfoot className="border-t-2 border-gray-300 bg-gray-50">
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-4 py-3 text-right text-sm font-bold text-gray-900"
                                        >
                                            Page Totals
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm font-bold text-gray-900">
                                            {currency}
                                            {money(
                                                rows.reduce(
                                                    (total, sale) =>
                                                        total +
                                                        Number(
                                                            sale.gross_total ?? 0
                                                        ),
                                                    0
                                                )
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm font-bold text-red-600">
                                            {currency}
                                            {money(
                                                rows.reduce(
                                                    (total, sale) =>
                                                        total +
                                                        Number(
                                                            sale.returned_total ??
                                                                0
                                                        ),
                                                    0
                                                )
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm font-bold text-green-700">
                                            {currency}
                                            {money(
                                                rows.reduce(
                                                    (total, sale) =>
                                                        total +
                                                        Number(
                                                            sale.net_total ?? 0
                                                        ),
                                                    0
                                                )
                                            )}
                                        </td>
                                        <td colSpan={2} />
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>

                    {links.length > 3 && (
                        <div className="border-t border-gray-200 p-4">
                            <Pagination links={links} />
                        </div>
                    )}
                </div>
            </section>
        </AuthenticatedLayout>
    );
}

function SummaryCard({ label, value, valueClass }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">{label}</p>
            <p className={`mt-2 text-2xl font-bold ${valueClass}`}>{value}</p>
        </div>
    );
}

function ReportHeading({ children, align = "left" }) {
    const alignClass = {
        left: "text-left",
        right: "text-right",
        center: "text-center",
    }[align];

    return (
        <th
            className={`px-4 py-3 text-xs font-semibold uppercase text-gray-600 ${alignClass}`}
        >
            {children}
        </th>
    );
}

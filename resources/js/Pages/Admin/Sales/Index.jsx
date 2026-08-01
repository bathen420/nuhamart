import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

function formatMoney(value) {
    const amount = Number(value ?? 0);

    return new Intl.NumberFormat("en-BD", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number.isFinite(amount) ? amount : 0);
}

function formatDate(value) {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleDateString("en-GB");
}

const statusStyles = {
    completed: "bg-green-100 text-green-700",
    partially_returned: "bg-amber-100 text-amber-700",
    fully_returned: "bg-red-100 text-red-700",
};

const statusLabels = {
    completed: "Completed",
    partially_returned: "Partially Returned",
    fully_returned: "Fully Returned",
};

export default function Index({
    sales = {},
    filters = {},
}) {
    const [search, setSearch] = useState(
        filters?.search ?? ""
    );

    const saleRows = Array.isArray(sales?.data)
        ? sales.data
        : [];

    const paginationLinks = Array.isArray(
        sales?.links
    )
        ? sales.links
        : [];

    const submitSearch = (event) => {
        event.preventDefault();

        router.get(
            route("admin.sales.index"),
            {
                search: search || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    const clearSearch = () => {
        setSearch("");

        router.get(
            route("admin.sales.index"),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                        Sales
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Gross sales, returned amounts and net sales.
                    </p>
                </div>
            }
        >
            <Head title="Sales" />

            <section className="mx-auto max-w-screen-2xl space-y-5">
                <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <form
                        onSubmit={submitSearch}
                        className="flex w-full max-w-2xl flex-col gap-2 sm:flex-row"
                    >
                        <input
                            type="search"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search sale number or customer"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                        <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
                        >
                            Search
                        </button>

                        {search && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-50"
                            >
                                Clear
                            </button>
                        )}
                    </form>

                    <Link
                        href={route("admin.pos.create")}
                        className="shrink-0 rounded-lg bg-green-600 px-5 py-2.5 text-center font-semibold text-white transition hover:bg-green-700"
                    >
                        New Sale / POS
                    </Link>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                                        Sale No.
                                    </th>

                                    <th className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                                        Customer
                                    </th>

                                    <th className="whitespace-nowrap px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-gray-600">
                                        Original Total
                                    </th>

                                    <th className="whitespace-nowrap px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-gray-600">
                                        Returned
                                    </th>

                                    <th className="whitespace-nowrap px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-gray-600">
                                        Net Sale
                                    </th>

                                    <th className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                                        Status
                                    </th>

                                    <th className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                                        Date
                                    </th>

                                    <th className="whitespace-nowrap px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-gray-600">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {saleRows.length > 0 ? (
                                    saleRows.map((sale) => {
                                        const status =
                                            sale.return_status ??
                                            "completed";

                                        const isFullyReturned =
                                            status ===
                                            "fully_returned";

                                        return (
                                            <tr
                                                key={sale.id}
                                                className="transition hover:bg-gray-50"
                                            >
                                                <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-gray-900">
                                                    {sale.sale_number ??
                                                        `#${sale.id}`}
                                                </td>

                                                <td className="px-4 py-4 text-sm text-gray-700">
                                                    {sale.customer
                                                        ?.name ??
                                                        "Walk-in Customer"}
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-semibold text-gray-900">
                                                    ৳
                                                    {formatMoney(
                                                        sale.original_total
                                                    )}
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-semibold text-red-600">
                                                    ৳
                                                    {formatMoney(
                                                        sale.returned_total
                                                    )}
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-bold text-blue-700">
                                                    ৳
                                                    {formatMoney(
                                                        sale.net_total
                                                    )}
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-4">
                                                    <span
                                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                            statusStyles[
                                                                status
                                                            ] ??
                                                            "bg-gray-100 text-gray-700"
                                                        }`}
                                                    >
                                                        {statusLabels[
                                                            status
                                                        ] ??
                                                            "Completed"}
                                                    </span>
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                                                    {formatDate(
                                                        sale.created_at
                                                    )}
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-4">
                                                    <div className="flex flex-wrap items-center justify-center gap-2">
                                                        <Link
                                                            href={route(
                                                                "admin.sales.show",
                                                                sale.id
                                                            )}
                                                            className="rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-700"
                                                        >
                                                            View
                                                        </Link>

                                                        {!isFullyReturned && (
                                                            <Link
                                                                href={route(
                                                                    "admin.sales.returns.create",
                                                                    sale.id
                                                                )}
                                                                className="rounded-md bg-amber-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-amber-600"
                                                            >
                                                                Return
                                                            </Link>
                                                        )}

                                                        {Number(
                                                            sale.returns_count ??
                                                                0
                                                        ) > 0 && (
                                                            <Link
                                                                href={route(
                                                                    "admin.sales.show",
                                                                    sale.id
                                                                )}
                                                                className="rounded-md bg-purple-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-purple-700"
                                                            >
                                                                Return History
                                                            </Link>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="px-5 py-14 text-center"
                                        >
                                            <p className="font-medium text-gray-700">
                                                No sales found
                                            </p>

                                            <p className="mt-1 text-sm text-gray-500">
                                                Create a sale through
                                                POS or change your
                                                search.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {paginationLinks.length > 3 && (
                        <div className="flex flex-wrap gap-1 border-t border-gray-200 p-4">
                            {paginationLinks.map(
                                (link, index) =>
                                    link.url ? (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            preserveState
                                            preserveScroll
                                            className={`rounded-md border px-3 py-2 text-sm transition ${
                                                link.active
                                                    ? "border-blue-600 bg-blue-600 text-white"
                                                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ) : (
                                        <span
                                            key={index}
                                            className="rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-400"
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    )
                            )}
                        </div>
                    )}
                </div>

                <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                    Sales records remain available after a return.
                    Original Total shows the gross sale, Returned
                    shows returned value, and Net Sale shows the
                    remaining recognised sale amount.
                </div>
            </section>
        </AuthenticatedLayout>
    );
}
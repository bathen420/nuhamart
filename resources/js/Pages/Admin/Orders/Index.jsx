import { Head, Link, router, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Pagination from "@/Components/Pagination";

const paymentStatusClasses = {
    paid: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    failed: "bg-red-100 text-red-700",
    refunded: "bg-purple-100 text-purple-700",
};

const orderStatusClasses = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-cyan-100 text-cyan-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
};

function formatStatus(value) {
    if (!value) {
        return "N/A";
    }

    return String(value)
        .replaceAll("_", " ")
        .replaceAll("-", " ")
        .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatCurrency(value) {
    const numericValue = Number(value ?? 0);

    return new Intl.NumberFormat("en-BD", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number.isFinite(numericValue) ? numericValue : 0);
}

export default function Index({
    orders = {},
    filters = {},
}) {
    const orderRows = Array.isArray(orders?.data)
        ? orders.data
        : [];

    const paginationLinks = Array.isArray(orders?.links)
        ? orders.links
        : [];

    const { data, setData, processing } = useForm({
        search: filters?.search ?? "",
    });

    const searchOrder = (event) => {
        event.preventDefault();

        router.get(
            route("admin.orders.index"),
            {
                search: data.search || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    const clearSearch = () => {
        setData("search", "");

        router.get(
            route("admin.orders.index"),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    const deleteOrder = (order) => {
        const orderReference =
            order?.order_no ?? `#${order?.id}`;

        const confirmed = window.confirm(
            `Are you sure you want to delete order ${orderReference}?`
        );

        if (!confirmed) {
            return;
        }

        router.delete(
            route("admin.orders.destroy", order.id),
            {
                preserveScroll: true,
            }
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Orders
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage customer orders and order statuses.
                    </p>
                </div>
            }
        >
            <Head title="Orders" />

            <section className="space-y-6">
                <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
                    <form
                        onSubmit={searchOrder}
                        className="flex w-full flex-col gap-3 sm:flex-row lg:max-w-2xl"
                    >
                        <input
                            type="search"
                            placeholder="Search by order number, customer or phone..."
                            value={data.search}
                            onChange={(event) =>
                                setData(
                                    "search",
                                    event.target.value
                                )
                            }
                            className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {processing
                                ? "Searching..."
                                : "Search"}
                        </button>

                        {data.search && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                            >
                                Clear
                            </button>
                        )}
                    </form>

                    <Link
                        href={route(
                            "admin.orders.create"
                        )}
                        className="inline-flex shrink-0 items-center justify-center rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-700"
                    >
                        + Add Order
                    </Link>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                                        Order No
                                    </th>

                                    <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                                        Customer
                                    </th>

                                    <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                                        Phone
                                    </th>

                                    <th className="whitespace-nowrap px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-gray-600">
                                        Total
                                    </th>

                                    <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                                        Payment
                                    </th>

                                    <th className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                                        Status
                                    </th>

                                    <th className="whitespace-nowrap px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-gray-600">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100 bg-white">
                                {orderRows.length > 0 ? (
                                    orderRows.map((order) => {
                                        const paymentStatus =
                                            String(
                                                order?.payment_status ??
                                                    "pending"
                                            ).toLowerCase();

                                        const orderStatus =
                                            String(
                                                order?.status ??
                                                    "pending"
                                            ).toLowerCase();

                                        return (
                                            <tr
                                                key={order.id}
                                                className="transition hover:bg-gray-50"
                                            >
                                                <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-gray-900">
                                                    {order.order_no ??
                                                        `#${order.id}`}
                                                </td>

                                                <td className="px-5 py-4 text-sm text-gray-700">
                                                    <div className="font-medium text-gray-900">
                                                        {order.customer_name ??
                                                            "Walk-in Customer"}
                                                    </div>

                                                    {order.customer_email && (
                                                        <div className="mt-0.5 text-xs text-gray-500">
                                                            {
                                                                order.customer_email
                                                            }
                                                        </div>
                                                    )}
                                                </td>

                                                <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-700">
                                                    {order.customer_phone ??
                                                        "N/A"}
                                                </td>

                                                <td className="whitespace-nowrap px-5 py-4 text-right text-sm font-semibold text-gray-900">
                                                    ৳
                                                    {formatCurrency(
                                                        order.total
                                                    )}
                                                </td>

                                                <td className="whitespace-nowrap px-5 py-4">
                                                    <span
                                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                            paymentStatusClasses[
                                                                paymentStatus
                                                            ] ??
                                                            "bg-gray-100 text-gray-700"
                                                        }`}
                                                    >
                                                        {formatStatus(
                                                            paymentStatus
                                                        )}
                                                    </span>
                                                </td>

                                                <td className="whitespace-nowrap px-5 py-4">
                                                    <span
                                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                            orderStatusClasses[
                                                                orderStatus
                                                            ] ??
                                                            "bg-gray-100 text-gray-700"
                                                        }`}
                                                    >
                                                        {formatStatus(
                                                            orderStatus
                                                        )}
                                                    </span>
                                                </td>

                                                <td className="whitespace-nowrap px-5 py-4 text-center">
                                                    <div className="inline-flex flex-wrap items-center justify-center gap-2">
                                                        <Link
                                                            href={route(
                                                                "admin.orders.show",
                                                                order.id
                                                            )}
                                                            className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700"
                                                        >
                                                            View
                                                        </Link>

                                                        <Link
                                                            href={route(
                                                                "admin.orders.edit",
                                                                order.id
                                                            )}
                                                            className="rounded-md bg-amber-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-amber-600"
                                                        >
                                                            Edit
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                deleteOrder(
                                                                    order
                                                                )
                                                            }
                                                            className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-5 py-16 text-center"
                                        >
                                            <div className="text-base font-medium text-gray-700">
                                                No orders found
                                            </div>

                                            <p className="mt-1 text-sm text-gray-500">
                                                Create a new order or
                                                change your search
                                                criteria.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {paginationLinks.length > 0 && (
                        <div className="border-t border-gray-200 px-5 py-4">
                            <Pagination
                                links={
                                    paginationLinks
                                }
                            />
                        </div>
                    )}
                </div>
            </section>
        </AuthenticatedLayout>
    );
}
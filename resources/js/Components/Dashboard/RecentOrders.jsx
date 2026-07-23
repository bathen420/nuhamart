import { Link } from "@inertiajs/react";

function StatusBadge({ value, type = "order" }) {
    const styles = {
        order: {
            Pending: "bg-amber-100 text-amber-700",
            Processing: "bg-blue-100 text-blue-700",
            Shipped: "bg-indigo-100 text-indigo-700",
            Delivered: "bg-emerald-100 text-emerald-700",
            Cancelled: "bg-red-100 text-red-700",
        },
        payment: {
            Pending: "bg-amber-100 text-amber-700",
            Paid: "bg-emerald-100 text-emerald-700",
            Failed: "bg-red-100 text-red-700",
        },
    };

    const badgeStyle =
        styles[type]?.[value] ?? "bg-gray-100 text-gray-700";

    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${badgeStyle}`}
        >
            {value ?? "Unknown"}
        </span>
    );
}

function formatCurrency(amount) {
    return new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
        minimumFractionDigits: 2,
    }).format(Number(amount ?? 0));
}

export default function RecentOrders({ orders = [] }) {
    return (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        Recent Orders
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        সর্বশেষ ৫টি বিক্রয় অর্ডার
                    </p>
                </div>

                <Link
                    href={route("orders.index")}
                    className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-800"
                >
                    View all
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Order
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Customer
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Total
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Payment
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Status
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100 bg-white">
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <tr
                                    key={order.id}
                                    className="transition hover:bg-gray-50"
                                >
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <Link
                                            href={route(
                                                "orders.show",
                                                order.id,
                                            )}
                                            className="font-semibold text-indigo-600 hover:text-indigo-800"
                                        >
                                            {order.order_number}
                                        </Link>

                                        <p className="mt-1 text-xs text-gray-500">
                                            {order.created_at}
                                        </p>
                                    </td>

                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-900">
                                            {order.customer_name}
                                        </p>

                                        <p className="mt-1 text-xs text-gray-500">
                                            {order.customer_phone}
                                        </p>
                                    </td>

                                    <td className="whitespace-nowrap px-6 py-4 font-semibold text-gray-900">
                                        {formatCurrency(order.total)}
                                    </td>

                                    <td className="whitespace-nowrap px-6 py-4">
                                        <StatusBadge
                                            value={order.payment_status}
                                            type="payment"
                                        />
                                    </td>

                                    <td className="whitespace-nowrap px-6 py-4">
                                        <StatusBadge
                                            value={order.order_status}
                                            type="order"
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="px-6 py-10 text-center"
                                >
                                    <p className="font-medium text-gray-700">
                                        No recent orders found
                                    </p>

                                    <p className="mt-1 text-sm text-gray-500">
                                        নতুন Order তৈরি হলে এখানে দেখা যাবে।
                                    </p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
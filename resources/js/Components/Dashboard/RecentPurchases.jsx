import { Link } from "@inertiajs/react";

function formatCurrency(amount) {
    return new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
        minimumFractionDigits: 2,
    }).format(Number(amount ?? 0));
}

export default function RecentPurchases({ purchases = [] }) {
    return (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        Recent Purchases
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        সর্বশেষ ৫টি Purchase
                    </p>
                </div>

                <Link
                    href={route("purchases.index")}
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
                                Purchase
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Supplier
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Total
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Date
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100 bg-white">
                        {purchases.length > 0 ? (
                            purchases.map((purchase) => (
                                <tr
                                    key={purchase.id}
                                    className="transition hover:bg-gray-50"
                                >
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <Link
                                            href={route(
                                                "purchases.show",
                                                purchase.id,
                                            )}
                                            className="font-semibold text-indigo-600 hover:text-indigo-800"
                                        >
                                            {purchase.purchase_number}
                                        </Link>
                                    </td>

                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-900">
                                            {purchase.supplier_name}
                                        </p>
                                    </td>

                                    <td className="whitespace-nowrap px-6 py-4 font-semibold text-gray-900">
                                        {formatCurrency(purchase.total)}
                                    </td>

                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                        {purchase.created_at}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="px-6 py-10 text-center"
                                >
                                    <p className="font-medium text-gray-700">
                                        No recent purchases found
                                    </p>

                                    <p className="mt-1 text-sm text-gray-500">
                                        নতুন Purchase তৈরি হলে এখানে দেখা যাবে।
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
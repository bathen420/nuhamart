import { Link } from "@inertiajs/react";

function formatCurrency(amount) {
    return new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
        minimumFractionDigits: 2,
    }).format(Number(amount ?? 0));
}

function StockBadge({ quantity }) {
    const stock = Number(quantity ?? 0);

    if (stock <= 0) {
        return (
            <span className="inline-flex rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                Out of Stock
            </span>
        );
    }

    return (
        <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
            {stock} left
        </span>
    );
}

export default function LowStockTable({
    products = [],
    lowStockLimit = 5,
}) {
    return (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
            <div className="flex flex-col gap-3 border-b border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        Low Stock Products
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Stock quantity {lowStockLimit} বা তার কম
                    </p>
                </div>

                <Link
                    href={route("products.index")}
                    className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-800"
                >
                    View all products
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Product
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Category
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Brand
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Price
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Stock
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100 bg-white">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <tr
                                    key={product.id}
                                    className="transition hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4">
                                        <Link
                                            href={route(
                                                "products.show",
                                                product.id,
                                            )}
                                            className="font-semibold text-indigo-600 hover:text-indigo-800"
                                        >
                                            {product.name}
                                        </Link>

                                        <p className="mt-1 text-xs text-gray-500">
                                            SKU: {product.sku || "N/A"}
                                        </p>
                                    </td>

                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                                        {product.category}
                                    </td>

                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                                        {product.brand}
                                    </td>

                                    <td className="whitespace-nowrap px-6 py-4 font-semibold text-gray-900">
                                        {formatCurrency(product.price)}
                                    </td>

                                    <td className="whitespace-nowrap px-6 py-4">
                                        <StockBadge
                                            quantity={product.stock_quantity}
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
                                        No low stock products found
                                    </p>

                                    <p className="mt-1 text-sm text-gray-500">
                                        বর্তমানে সব পণ্যের Stock পর্যাপ্ত আছে।
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
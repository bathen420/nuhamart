import { Head, Link, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Show({ auth, purchase }) {
    const { flash = {}, errors = {} } = usePage().props;

    const formatMoney = (amount) => {
        return Number(amount || 0).toLocaleString("en-BD", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const formatDate = (date) => {
        if (!date) {
            return "—";
        }

        return new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(date));
    };

    const deletePurchase = () => {
        const confirmed = window.confirm(
            `Are you sure you want to delete purchase ${purchase.purchase_number}?\n\nProduct stock will be reversed.`
        );

        if (!confirmed) {
            return;
        }

        router.delete(
            route("purchases.destroy", purchase.id)
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold text-gray-800">
                    Purchase Details
                </h2>
            }
        >
            <Head
                title={`Purchase ${purchase.purchase_number}`}
            />

            <div className="py-8">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">

                    {flash.success && (
                        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
                            {flash.success}
                        </div>
                    )}

                    {errors.error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                            {errors.error}
                        </div>
                    )}

                    {/* Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {purchase.purchase_number}
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Created {formatDate(purchase.created_at)}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">

                            <Link
                                href={route("purchases.index")}
                                className="rounded-lg bg-gray-600 px-4 py-2 font-semibold text-white hover:bg-gray-700"
                            >
                                Back
                            </Link>

                            <button
                                type="button"
                                onClick={() => window.print()}
                                className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
                            >
                                Print
                            </button>

                            <a
                                href={route(
                                    "purchases.pdf",
                                    purchase.id
                                )}
                                className="rounded-lg bg-purple-600 px-4 py-2 font-semibold text-white hover:bg-purple-700"
                            >
                                Download PDF
                            </a>

                            <button
                                type="button"
                                onClick={deletePurchase}
                                className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
                            >
                                Delete
                            </button>

                        </div>
                    </div>

                    {/* Information Cards */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                        <div className="rounded-xl bg-white p-6 shadow">

                            <h2 className="mb-5 text-xl font-bold text-gray-900">
                                Purchase Information
                            </h2>

                            <div className="space-y-4">

                                <InfoRow
                                    label="Purchase Number"
                                    value={purchase.purchase_number}
                                />

                                <InfoRow
                                    label="Purchase Date"
                                    value={formatDate(
                                        purchase.created_at
                                    )}
                                />

                                <InfoRow
                                    label="Created By"
                                    value={
                                        purchase.user?.name ?? "—"
                                    }
                                />

                                <InfoRow
                                    label="Note"
                                    value={purchase.note || "No note"}
                                />

                            </div>
                        </div>

                        <div className="rounded-xl bg-white p-6 shadow">

                            <h2 className="mb-5 text-xl font-bold text-gray-900">
                                Supplier Information
                            </h2>

                            <div className="space-y-4">

                                <InfoRow
                                    label="Supplier Name"
                                    value={
                                        purchase.supplier?.name ?? "—"
                                    }
                                />

                                <InfoRow
                                    label="Phone"
                                    value={
                                        purchase.supplier?.phone ?? "—"
                                    }
                                />

                                <InfoRow
                                    label="Email"
                                    value={
                                        purchase.supplier?.email ?? "—"
                                    }
                                />

                                <InfoRow
                                    label="Address"
                                    value={
                                        purchase.supplier?.address ?? "—"
                                    }
                                />

                            </div>
                        </div>

                    </div>

                    {/* Products Table */}
                    <div className="overflow-hidden rounded-xl bg-white shadow">

                        <div className="border-b px-6 py-5">
                            <h2 className="text-xl font-bold text-gray-900">
                                Purchased Products
                            </h2>
                        </div>

                        <div className="overflow-x-auto">

                            <table className="min-w-full">

                                <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        #
                                    </th>

                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        Product
                                    </th>

                                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                                        Quantity
                                    </th>

                                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                                        Buy Price
                                    </th>

                                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                                        Subtotal
                                    </th>
                                </tr>
                                </thead>

                                <tbody>

                                {purchase.items?.length > 0 ? (
                                    purchase.items.map(
                                        (item, index) => (
                                            <tr
                                                key={item.id}
                                                className="border-t"
                                            >
                                                <td className="px-4 py-3 text-gray-600">
                                                    {index + 1}
                                                </td>

                                                <td className="px-4 py-3 font-semibold text-gray-900">
                                                    {item.product?.name ??
                                                        "Deleted product"}
                                                </td>

                                                <td className="px-4 py-3 text-center">
                                                    {item.quantity}
                                                </td>

                                                <td className="px-4 py-3 text-right">
                                                    ৳{" "}
                                                    {formatMoney(
                                                        item.price
                                                    )}
                                                </td>

                                                <td className="px-4 py-3 text-right font-bold">
                                                    ৳{" "}
                                                    {formatMoney(
                                                        item.subtotal
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    )
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="py-10 text-center text-gray-500"
                                        >
                                            No purchase items found.
                                        </td>
                                    </tr>
                                )}

                                </tbody>

                            </table>

                        </div>
                    </div>

                    {/* Summary */}
                    <div className="flex justify-end">

                        <div className="w-full rounded-xl bg-white p-6 shadow sm:max-w-md">

                            <h2 className="mb-5 text-xl font-bold text-gray-900">
                                Purchase Summary
                            </h2>

                            <div className="space-y-3">

                                <SummaryRow
                                    label="Subtotal"
                                    value={`৳ ${formatMoney(
                                        purchase.subtotal
                                    )}`}
                                />

                                <SummaryRow
                                    label="Discount"
                                    value={`৳ ${formatMoney(
                                        purchase.discount
                                    )}`}
                                />

                                <SummaryRow
                                    label="Shipping"
                                    value={`৳ ${formatMoney(
                                        purchase.shipping
                                    )}`}
                                />

                                <div className="border-t pt-4">

                                    <div className="flex items-center justify-between">

                                        <span className="text-lg font-bold text-gray-900">
                                            Grand Total
                                        </span>

                                        <span className="text-2xl font-bold text-green-700">
                                            ৳{" "}
                                            {formatMoney(
                                                purchase.total
                                            )}
                                        </span>

                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>

                </div>
            </div>

        </AuthenticatedLayout>
    );
}

function InfoRow({ label, value }) {
    return (
        <div className="border-b border-gray-100 pb-3 last:border-b-0">

            <p className="text-sm font-medium text-gray-500">
                {label}
            </p>

            <p className="mt-1 break-words font-semibold text-gray-900">
                {value}
            </p>

        </div>
    );
}

function SummaryRow({ label, value }) {
    return (
        <div className="flex items-center justify-between">

            <span className="text-gray-600">
                {label}
            </span>

            <span className="font-semibold text-gray-900">
                {value}
            </span>

        </div>
    );
}
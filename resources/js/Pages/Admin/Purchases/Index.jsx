import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Index({
    auth,
    purchases,
    filters = {},
}) {
    const { flash = {}, errors = {} } = usePage().props;

    const [search, setSearch] = useState(filters.search ?? "");

    const submitSearch = (event) => {
        event.preventDefault();

        router.get(
            route("purchases.index"),
            {
                search,
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
            route("purchases.index"),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    const deletePurchase = (purchase) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete purchase ${purchase.purchase_number}?\n\nThe purchased quantities will be removed from product stock.`
        );

        if (!confirmed) {
            return;
        }

        router.delete(
            route("purchases.destroy", purchase.id),
            {
                preserveScroll: true,
            }
        );
    };

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
            month: "short",
            year: "numeric",
        }).format(new Date(date));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold text-gray-800">
                    Purchases
                </h2>
            }
        >
            <Head title="Purchases" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                    {/* Success Message */}
                    {flash.success && (
                        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
                            {flash.success}
                        </div>
                    )}

                    {/* Error Message */}
                    {errors.error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                            {errors.error}
                        </div>
                    )}

                    {/* Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Purchase List
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Manage supplier purchases and incoming stock.
                            </p>
                        </div>

                        <Link
                            href={route("purchases.create")}
                            className="inline-flex justify-center rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
                        >
                            + New Purchase
                        </Link>
                    </div>

                    {/* Search */}
                    <div className="rounded-xl bg-white p-5 shadow">
                        <form
                            onSubmit={submitSearch}
                            className="flex flex-col gap-3 sm:flex-row"
                        >
                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search purchase number or supplier..."
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-blue-500"
                            />

                            <button
                                type="submit"
                                className="rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white hover:bg-blue-700"
                            >
                                Search
                            </button>

                            {filters.search && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="rounded-lg bg-gray-500 px-6 py-2.5 font-semibold text-white hover:bg-gray-600"
                                >
                                    Clear
                                </button>
                            )}
                        </form>
                    </div>

                    {/* Purchase Table */}
                    <div className="overflow-hidden rounded-xl bg-white shadow">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Purchase No.
                                        </th>

                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Supplier
                                        </th>

                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Created By
                                        </th>

                                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                                            Total
                                        </th>

                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                                            Date
                                        </th>

                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {purchases.data.length > 0 ? (
                                        purchases.data.map((purchase) => (
                                            <tr
                                                key={purchase.id}
                                                className="border-t hover:bg-gray-50"
                                            >
                                                <td className="whitespace-nowrap px-4 py-3 font-semibold text-gray-900">
                                                    {
                                                        purchase.purchase_number
                                                    }
                                                </td>

                                                <td className="px-4 py-3 text-gray-700">
                                                    {purchase.supplier?.name ??
                                                        "Supplier unavailable"}
                                                </td>

                                                <td className="px-4 py-3 text-gray-700">
                                                    {purchase.user?.name ?? "—"}
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-3 text-right font-bold text-gray-900">
                                                    ৳{" "}
                                                    {formatMoney(
                                                        purchase.total
                                                    )}
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-3 text-center text-gray-700">
                                                    {formatDate(
                                                        purchase.created_at
                                                    )}
                                                </td>

                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Link
                                                            href={route(
                                                                "purchases.show",
                                                                purchase.id
                                                            )}
                                                            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                                                        >
                                                            View
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                deletePurchase(
                                                                    purchase
                                                                )
                                                            }
                                                            className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="py-12 text-center text-gray-500"
                                            >
                                                No purchases found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {purchases.links &&
                            purchases.links.length > 3 && (
                                <div className="flex flex-wrap items-center justify-between gap-4 border-t px-5 py-4">
                                    <p className="text-sm text-gray-600">
                                        Showing {purchases.from ?? 0} to{" "}
                                        {purchases.to ?? 0} of{" "}
                                        {purchases.total ?? 0} purchases
                                    </p>

                                    <div className="flex flex-wrap gap-1">
                                        {purchases.links.map(
                                            (link, index) =>
                                                link.url ? (
                                                    <Link
                                                        key={index}
                                                        href={link.url}
                                                        preserveScroll
                                                        preserveState
                                                        className={`rounded border px-3 py-2 text-sm ${
                                                            link.active
                                                                ? "border-blue-600 bg-blue-600 text-white"
                                                                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                                                        }`}
                                                        dangerouslySetInnerHTML={{
                                                            __html: link.label,
                                                        }}
                                                    />
                                                ) : (
                                                    <span
                                                        key={index}
                                                        className="cursor-not-allowed rounded border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-400"
                                                        dangerouslySetInnerHTML={{
                                                            __html: link.label,
                                                        }}
                                                    />
                                                )
                                        )}
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Index({ auth, purchases }) {

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold">
                    Purchases
                </h2>
            }
        >
            <Head title="Purchases" />

            <div className="space-y-6">

                {/* Header */}

                <div className="flex items-center justify-between">

                    <h1 className="text-3xl font-bold">
                        Purchase List
                    </h1>

                    <Link
                        href={route("purchases.create")}
                        className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                    >
                        + New Purchase
                    </Link>

                </div>

                {/* Table */}

                <div className="overflow-hidden rounded-xl bg-white shadow">

                    <table className="min-w-full">

                        <thead className="bg-gray-100">

                            <tr>

                                <th className="px-4 py-3 text-left">
                                    Purchase No
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Supplier
                                </th>

                                <th className="px-4 py-3 text-right">
                                    Total
                                </th>

                                <th className="px-4 py-3 text-center">
                                    Date
                                </th>

                                <th className="px-4 py-3 text-center">
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {purchases.data.length > 0 ? (

                                purchases.data.map((purchase) => (

                                    <tr
                                        key={purchase.id}
                                        className="border-t"
                                    >

                                        <td className="px-4 py-3">
                                            {purchase.purchase_number}
                                        </td>

                                        <td className="px-4 py-3">
                                            {purchase.supplier?.name}
                                        </td>

                                        <td className="px-4 py-3 text-right">
                                            ৳ {Number(purchase.total).toFixed(2)}
                                        </td>

                                        <td className="px-4 py-3 text-center">
                                            {new Date(
                                                purchase.created_at
                                            ).toLocaleDateString()}
                                        </td>

                                        <td className="px-4 py-3 text-center">

                                            <Link
                                                href={route(
                                                    "purchases.show",
                                                    purchase.id
                                                )}
                                                className="rounded bg-blue-600 px-3 py-1 text-white"
                                            >
                                                View
                                            </Link>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="py-10 text-center text-gray-500"
                                    >
                                        No Purchase Found
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </AuthenticatedLayout>
    );
}
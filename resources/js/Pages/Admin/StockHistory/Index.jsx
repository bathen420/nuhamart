import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Index({ auth, histories }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold text-gray-800">
                    Stock History
                </h2>
            }
        >
            <Head title="Stock History" />

            <div className="mx-auto max-w-7xl py-6">

                <div className="overflow-hidden rounded-xl bg-white shadow">

                    <div className="border-b p-6">

                        <h1 className="text-2xl font-bold">
                            Stock History
                        </h1>

                        <p className="mt-2 text-gray-500">
                            All Stock In / Out Transactions
                        </p>

                    </div>

                    <div className="overflow-x-auto">

                        <table className="min-w-full">

                            <thead className="bg-gray-100">

                                <tr>

                                    <th className="border px-4 py-3">
                                        #
                                    </th>

                                    <th className="border px-4 py-3 text-left">
                                        Product
                                    </th>

                                    <th className="border px-4 py-3">
                                        Type
                                    </th>

                                    <th className="border px-4 py-3">
                                        Qty
                                    </th>

                                    <th className="border px-4 py-3">
                                        Before
                                    </th>

                                    <th className="border px-4 py-3">
                                        After
                                    </th>

                                    <th className="border px-4 py-3">
                                        Reference
                                    </th>

                                    <th className="border px-4 py-3">
                                        User
                                    </th>

                                    <th className="border px-4 py-3">
                                        Date
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {histories.data.length === 0 && (

                                    <tr>

                                        <td
                                            colSpan="9"
                                            className="p-8 text-center text-gray-500"
                                        >
                                            No Stock History Found
                                        </td>

                                    </tr>

                                )}

                                {histories.data.map((history, index) => (

                                    <tr
                                        key={history.id}
                                        className="hover:bg-gray-50"
                                    >

                                        <td className="border p-3 text-center">
                                            {index + 1}
                                        </td>

                                        <td className="border p-3">
                                            {history.product?.name}
                                        </td>

                                        <td className="border p-3 text-center">

                                            <span
                                                className={`rounded-full px-3 py-1 text-sm font-semibold ${
                                                    history.type === "IN"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {history.type}
                                            </span>

                                        </td>

                                        <td className="border p-3 text-center">
                                            {history.quantity}
                                        </td>

                                        <td className="border p-3 text-center">
                                            {history.stock_before}
                                        </td>

                                        <td className="border p-3 text-center">
                                            {history.stock_after}
                                        </td>

                                        <td className="border p-3 text-center">
                                            {history.reference}
                                        </td>

                                        <td className="border p-3 text-center">
                                            {history.user?.name}
                                        </td>

                                        <td className="border p-3 text-center">
                                            {new Date(
                                                history.created_at
                                            ).toLocaleString()}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                    {/* Pagination */}

                    <div className="flex justify-center gap-2 border-t p-5">

                        {histories.links.map((link, index) => (

                            <Link
                                key={index}
                                href={link.url || "#"}
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                                className={`rounded border px-4 py-2 ${
                                    link.active
                                        ? "bg-blue-600 text-white"
                                        : "bg-white"
                                } ${
                                    !link.url
                                        ? "pointer-events-none opacity-50"
                                        : ""
                                }`}
                            />

                        ))}

                    </div>

                </div>

            </div>

        </AuthenticatedLayout>
    );
}
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";

export default function Index({ auth, returns, filters }) {
    const [search, setSearch] = useState(filters.search || "");

    const submit = (e) => {
        e.preventDefault();
        router.get(route("admin.sale-returns.index"), { search }, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Sales Returns" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold">Sales Returns</h1>
                    </div>

                    <form onSubmit={submit} className="mb-6 flex gap-2">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Return no, invoice or customer..."
                            className="w-full max-w-md rounded-lg border-gray-300"
                        />
                        <button className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white">
                            Search
                        </button>
                    </form>

                    <div className="overflow-hidden rounded-xl bg-white shadow">
                        <table className="w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left">Return No.</th>
                                    <th className="px-4 py-3 text-left">Invoice</th>
                                    <th className="px-4 py-3 text-left">Customer</th>
                                    <th className="px-4 py-3 text-left">Date</th>
                                    <th className="px-4 py-3 text-right">Amount</th>
                                    <th className="px-4 py-3 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {returns.data.map((item) => (
                                    <tr key={item.id} className="border-t">
                                        <td className="px-4 py-4 font-semibold">{item.return_number}</td>
                                        <td className="px-4 py-4">{item.sale?.sale_number}</td>
                                        <td className="px-4 py-4">{item.customer?.name || "Walk-in Customer"}</td>
                                        <td className="px-4 py-4">{item.return_date}</td>
                                        <td className="px-4 py-4 text-right font-bold">
                                            BDT {Number(item.subtotal).toLocaleString("en-GB", {
                                                minimumFractionDigits: 2,
                                            })}
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <Link
                                                href={route("admin.sale-returns.show", item.id)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {returns.data.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-4 py-10 text-center text-gray-500">
                                            No sales return found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

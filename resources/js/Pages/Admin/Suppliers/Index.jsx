import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Index({ auth, suppliers }) {

    const deleteSupplier = (id) => {

        if (confirm("Are you sure you want to delete this supplier?")) {

            router.delete(route("suppliers.destroy", id));

        }

    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold text-gray-800">
                    Suppliers
                </h2>
            }
        >
            <Head title="Suppliers" />

            <div className="mx-auto max-w-7xl py-6">

                <div className="mb-6 flex items-center justify-between">

                    <h1 className="text-2xl font-bold">
                        Supplier List
                    </h1>

                    <Link
                        href={route("suppliers.create")}
                        className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                    >
                        + Add Supplier
                    </Link>

                </div>

                <div className="overflow-hidden rounded-xl bg-white shadow">

                    <table className="min-w-full">

                        <thead className="bg-gray-100">

                            <tr>

                                <th className="px-4 py-3 text-left">#</th>

                                <th className="px-4 py-3 text-left">
                                    Name
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Company
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Phone
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Status
                                </th>

                                <th className="px-4 py-3 text-center">
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {suppliers.data.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="py-10 text-center text-gray-500"
                                    >
                                        No Supplier Found
                                    </td>

                                </tr>

                            ) : (

                                suppliers.data.map((supplier, index) => (

                                    <tr
                                        key={supplier.id}
                                        className="border-t"
                                    >

                                        <td className="px-4 py-3">
                                            {index + 1}
                                        </td>

                                        <td className="px-4 py-3">
                                            {supplier.name}
                                        </td>

                                        <td className="px-4 py-3">
                                            {supplier.company_name || "-"}
                                        </td>

                                        <td className="px-4 py-3">
                                            {supplier.phone}
                                        </td>

                                        <td className="px-4 py-3">

                                            {supplier.status ? (

                                                <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">
                                                    Active
                                                </span>

                                            ) : (

                                                <span className="rounded-full bg-red-100 px-3 py-1 text-red-700">
                                                    Inactive
                                                </span>

                                            )}

                                        </td>

                                        <td className="px-4 py-3 text-center">

                                            <Link
                                                href={route(
                                                    "suppliers.edit",
                                                    supplier.id
                                                )}
                                                className="rounded bg-yellow-500 px-3 py-1 text-white"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                onClick={() => deleteSupplier(supplier.id)}
                                                className="rounded bg-red-600 px-3 py-1 text-white"
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </AuthenticatedLayout>
    );
}
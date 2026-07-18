import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Pagination from "@/Components/Pagination";


export default function Index({ auth, categories }) {

    const deleteCategory = (id) => {

        if (confirm("Are you sure you want to delete this category?")) {

            router.delete(route("categories.destroy", id));
        }
    };


    return (

        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Categories
                </h2>
            }
        >

            <Head title="Categories" />


            <div className="py-8">

                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">


                    <div className="mb-4 flex justify-end">

                        <Link
                            href={route("categories.create")}
                            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            + Add Category
                        </Link>

                    </div>



                    <div className="overflow-hidden bg-white shadow sm:rounded-lg">

                        <table className="min-w-full divide-y divide-gray-200">


                            <thead className="bg-gray-50">

                                <tr>

                                    <th className="px-6 py-3 text-left">
                                        ID
                                    </th>

                                    <th className="px-6 py-3 text-left">
                                        Name
                                    </th>


                                    <th className="px-6 py-3 text-left">
                                        Status
                                    </th>


                                    <th className="px-6 py-3 text-left">
                                        Action
                                    </th>

                                </tr>

                            </thead>



                            <tbody className="divide-y divide-gray-200">


                                {categories.data.length > 0 ? (

                                    categories.data.map((category) => (

                                        <tr key={category.id}>


                                            <td className="px-6 py-4">
                                                {category.id}
                                            </td>


                                            <td className="px-6 py-4">
                                                {category.name}
                                            </td>


                                            <td className="px-6 py-4">

                                                {category.status ? (
                                                    <span className="rounded bg-green-100 px-3 py-1 text-sm text-green-700">
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="rounded bg-red-100 px-3 py-1 text-sm text-red-700">
                                                        Inactive
                                                    </span>
                                                )}

                                            </td>



                                            <td className="space-x-2 px-6 py-4">


                                                <Link
                                                    href={route(
                                                        "categories.edit",
                                                        category.id
                                                    )}
                                                    className="rounded bg-yellow-500 px-3 py-1 text-white"
                                                >
                                                    Edit
                                                </Link>



                                                <button
                                                    onClick={() =>
                                                        deleteCategory(category.id)
                                                    }
                                                    className="rounded bg-red-600 px-3 py-1 text-white"
                                                >
                                                    Delete
                                                </button>


                                            </td>


                                        </tr>

                                    ))

                                ) : (

                                    <tr>

                                        <td
                                            colSpan="4"
                                            className="px-6 py-6 text-center text-gray-500"
                                        >
                                            No categories found.
                                        </td>

                                    </tr>

                                )}


                            </tbody>


                        </table>

                        <Pagination links={categories.links} />


                    </div>


                </div>

            </div>


        </AuthenticatedLayout>

    );
}
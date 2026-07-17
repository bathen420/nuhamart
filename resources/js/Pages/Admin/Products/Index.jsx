import { Head, Link, router, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Index({ auth, products, filters }) {

    const { data, setData, get } = useForm({
        search: filters.search || "",
    });

    const searchProduct = (e) => {
        e.preventDefault();

        get(route("products.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const deleteProduct = (id) => {
        if (confirm("Are you sure you want to delete this product?")) {
            router.delete(route("products.destroy", id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Products
                </h2>
            }
        >
            <Head title="Products" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    <div className="mb-4 flex items-center justify-between">

                        <form
                            onSubmit={searchProduct}
                            className="flex items-center gap-2"
                        >
                            <input
                                type="text"
                                placeholder="Search product..."
                                value={data.search}
                                onChange={(e) => setData("search", e.target.value)}
                                className="w-72 rounded-md border border-gray-300 px-3 py-2"
                            />

                            <button
                                type="submit"
                                className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                            >
                                Search
                            </button>

                            <Link
                                href={route("products.index")}
                                className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                            >
                                Reset
                            </Link>
                        </form>

                        <Link
                            href={route("products.create")}
                            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            + Add Product
                        </Link>

                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">

                        <table className="min-w-full divide-y divide-gray-200">

                            <thead className="bg-gray-100">

                                <tr>

                                    <th className="px-4 py-3 text-left">ID</th>
                                    <th className="px-4 py-3 text-left">Image</th>
                                    <th className="px-4 py-3 text-left">Product</th>
                                    <th className="px-4 py-3 text-left">Category</th>
                                    <th className="px-4 py-3 text-left">Brand</th>
                                    <th className="px-4 py-3 text-left">Price</th>
                                    <th className="px-4 py-3 text-left">Stock</th>
                                    <th className="px-4 py-3 text-left">Status</th>
                                    <th className="px-4 py-3 text-left">Action</th>

                                </tr>

                            </thead>

                            <tbody className="divide-y divide-gray-200">

                                {products.data.length > 0 ? (

                                    products.data.map((product) => (

                                        <tr key={product.id}>

                                            <td className="px-4 py-3">
                                                {product.id}
                                            </td>

                                            <td className="px-4 py-3">
                                                {product.image ? (
                                                    <img
                                                        src={`/storage/${product.image}`}
                                                        alt={product.name}
                                                        className="h-16 w-16 rounded object-cover border"
                                                    />
                                                ) : (
                                                    <div className="h-16 w-16 rounded border flex items-center justify-center text-xs text-gray-400">
                                                        No Image
                                                    </div>
                                                )}
                                            </td>

                                        <td className="px-4 py-3 font-medium">
                                            {product.name}
                                        </td>

                                            <td className="px-4 py-3">
                                                {product.category?.name}
                                            </td>

                                            <td className="px-4 py-3">
                                                {product.brand?.name}
                                            </td>

                                            <td className="px-4 py-3">
                                                ৳ {product.price}
                                            </td>

                                            <td className="px-4 py-3">
                                                {product.stock_quantity}
                                            </td>

                                            <td className="px-4 py-3">
                                                {product.status ? (
                                                    <span className="rounded bg-green-100 px-2 py-1 text-sm text-green-700">
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="rounded bg-red-100 px-2 py-1 text-sm text-red-700">
                                                        Inactive
                                                    </span>
                                                )}
                                            </td>

                                            <td className="space-x-2 px-4 py-3">

                                                <Link
                                                    href={route("products.edit", product.id)}
                                                    className="rounded bg-yellow-500 px-3 py-1 text-white"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    onClick={() => deleteProduct(product.id)}
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
                                            colSpan="9"
                                            className="px-6 py-6 text-center text-gray-500"
                                        >
                                            No products found.
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
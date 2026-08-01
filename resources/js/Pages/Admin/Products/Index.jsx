import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const money = (value) => Number(value || 0).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

export default function Index({ products = {}, filters = {}, filterOptions = {} }) {
    const rows = Array.isArray(products?.data) ? products.data : [];
    const categories = Array.isArray(filterOptions?.categories) ? filterOptions.categories : [];
    const brands = Array.isArray(filterOptions?.brands) ? filterOptions.brands : [];

    const submitFilters = (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const query = Object.fromEntries(form.entries());
        Object.keys(query).forEach((key) => query[key] === "" && delete query[key]);

        router.get(route("admin.products.index"), query, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const remove = (product) => {
        if (!window.confirm(`Delete ${product.name}?`)) return;
        router.delete(route("admin.products.destroy", product.id), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Products" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Products</h1>
                        <p className="mt-1 text-sm text-slate-500">Manage products, pricing and stock.</p>
                    </div>
                    <Link
                        href={route("admin.products.create")}
                        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                    >
                        + Add Product
                    </Link>
                </div>

                <form onSubmit={submitFilters} className="grid gap-3 rounded-xl bg-white p-4 shadow-sm md:grid-cols-5">
                    <input
                        name="search"
                        defaultValue={filters?.search || ""}
                        placeholder="Search name or SKU"
                        className="rounded-lg border-slate-300 md:col-span-2"
                    />
                    <select name="category" defaultValue={filters?.category || ""} className="rounded-lg border-slate-300">
                        <option value="">All categories</option>
                        {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                    </select>
                    <select name="brand" defaultValue={filters?.brand || ""} className="rounded-lg border-slate-300">
                        <option value="">All brands</option>
                        {brands.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                    </select>
                    <div className="flex gap-2">
                        <button className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">Search</button>
                        <Link href={route("admin.products.index")} className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50">Reset</Link>
                    </div>
                </form>

                <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-5 py-4 text-left text-sm font-bold">ID</th>
                                    <th className="px-5 py-4 text-left text-sm font-bold">Product</th>
                                    <th className="px-5 py-4 text-left text-sm font-bold">Category</th>
                                    <th className="px-5 py-4 text-left text-sm font-bold">Brand</th>
                                    <th className="px-5 py-4 text-right text-sm font-bold">Price</th>
                                    <th className="px-5 py-4 text-center text-sm font-bold">Stock</th>
                                    <th className="px-5 py-4 text-center text-sm font-bold">Status</th>
                                    <th className="px-5 py-4 text-right text-sm font-bold">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {rows.length === 0 ? (
                                    <tr><td colSpan="8" className="px-5 py-12 text-center text-slate-500">No products found.</td></tr>
                                ) : rows.map((product) => (
                                    <tr key={product.id} className="hover:bg-slate-50">
                                        <td className="px-5 py-4">{product.id}</td>
                                        <td className="px-5 py-4">
                                            <div className="font-semibold text-slate-900">{product.name || "—"}</div>
                                            <div className="text-xs text-slate-500">{product.sku || "No SKU"}</div>
                                        </td>
                                        <td className="px-5 py-4">{product.category?.name || "—"}</td>
                                        <td className="px-5 py-4">{product.brand?.name || "—"}</td>
                                        <td className="px-5 py-4 text-right">৳ {money(product.price)}</td>
                                        <td className="px-5 py-4 text-center">{product.stock_quantity ?? 0}</td>
                                        <td className="px-5 py-4 text-center">
                                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${product.status ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-600"}`}>
                                                {product.status ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-2">
                                                <Link href={route("admin.products.show", product.id)} className="rounded bg-blue-600 px-3 py-2 text-sm text-white">View</Link>
                                                <Link href={route("admin.products.edit", product.id)} className="rounded bg-amber-500 px-3 py-2 text-sm text-white">Edit</Link>
                                                <button type="button" onClick={() => remove(product)} className="rounded bg-red-600 px-3 py-2 text-sm text-white">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {Array.isArray(products?.links) && products.links.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2">
                        {products.links.map((link, index) => link.url ? (
                            <Link key={index} href={link.url} preserveScroll className={`rounded-lg border px-4 py-2 text-sm ${link.active ? "bg-blue-600 text-white" : "bg-white text-slate-700"}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                        ) : (
                            <span key={index} className="rounded-lg border bg-slate-100 px-4 py-2 text-sm text-slate-400" dangerouslySetInnerHTML={{ __html: link.label }} />
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

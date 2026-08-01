import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Show({ product = {} }) {
    return (
        <AuthenticatedLayout>
            <Head title={product.name || "Product Details"} />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Product Details</h1>
                        <p className="text-slate-500">{product.name}</p>
                    </div>
                    <div className="flex gap-2">
                        <Link href={route("admin.products.edit", product.id)} className="rounded-lg bg-amber-500 px-4 py-2 text-white">Edit</Link>
                        <Link href={route("admin.products.index")} className="rounded-lg border bg-white px-4 py-2">Back</Link>
                    </div>
                </div>
                <div className="grid gap-6 rounded-xl bg-white p-6 shadow-sm md:grid-cols-2">
                    <div>
                        {product.image ? <img src={`/storage/${product.image}`} alt={product.name} className="max-h-96 w-full rounded-xl object-contain" /> : <div className="flex h-64 items-center justify-center rounded-xl bg-slate-100 text-slate-400">No image</div>}
                    </div>
                    <dl className="grid grid-cols-2 gap-4">
                        <dt className="font-semibold">Name</dt><dd>{product.name || "—"}</dd>
                        <dt className="font-semibold">SKU</dt><dd>{product.sku || "—"}</dd>
                        <dt className="font-semibold">Category</dt><dd>{product.category?.name || "—"}</dd>
                        <dt className="font-semibold">Brand</dt><dd>{product.brand?.name || "—"}</dd>
                        <dt className="font-semibold">Price</dt><dd>৳ {Number(product.price || 0).toFixed(2)}</dd>
                        <dt className="font-semibold">Stock</dt><dd>{product.stock_quantity ?? 0}</dd>
                        <dt className="font-semibold">Status</dt><dd>{product.status ? "Active" : "Inactive"}</dd>
                        <dt className="font-semibold">Description</dt><dd>{product.description || product.short_description || "—"}</dd>
                    </dl>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

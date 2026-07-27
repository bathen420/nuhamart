import { Link } from "@inertiajs/react";

export default function LowStockAlert({ products = [], limit = 5 }) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-bold text-slate-900">Low Stock Alert</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Products with {limit} or fewer units
                    </p>
                </div>
                <Link href={route("admin.products.index")} className="text-sm font-bold text-blue-600">
                    Products
                </Link>
            </div>

            <div className="mt-4 divide-y divide-slate-100">
                {products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between gap-4 py-3">
                        <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-800">{product.name}</p>
                            <p className="text-xs text-slate-400">
                                {product.sku || "No SKU"} · {product.category}
                            </p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-black ${
                            product.stock <= 0
                                ? "bg-rose-100 text-rose-700"
                                : "bg-amber-100 text-amber-700"
                        }`}>
                            {product.stock <= 0 ? "Out" : `${product.stock} left`}
                        </span>
                    </div>
                ))}

                {products.length === 0 && (
                    <p className="py-8 text-center text-sm text-slate-500">
                        Stock levels are healthy.
                    </p>
                )}
            </div>
        </section>
    );
}

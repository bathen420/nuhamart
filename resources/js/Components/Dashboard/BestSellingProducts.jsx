const money = (value) =>
    new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "BDT",
        maximumFractionDigits: 0,
    }).format(Number(value || 0));

export default function BestSellingProducts({ products = [] }) {
    const max = Math.max(...products.map((item) => Number(item.quantity_sold || 0)), 1);

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-slate-900">Best Selling Products</h2>
            <p className="mt-1 text-sm text-slate-500">Ranked by units sold</p>

            <div className="mt-5 space-y-4">
                {products.map((item, index) => (
                    <div key={item.product_id}>
                        <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                                <p className="truncate text-sm font-bold text-slate-800">
                                    {index + 1}. {item.name}
                                </p>
                                <p className="text-xs text-slate-400">
                                    {item.quantity_sold} sold · {money(item.revenue)}
                                </p>
                            </div>
                            <span className="text-xs font-semibold text-slate-500">
                                Stock {item.stock}
                            </span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                                className="h-full rounded-full bg-blue-600"
                                style={{ width: `${Math.max(5, (item.quantity_sold / max) * 100)}%` }}
                            />
                        </div>
                    </div>
                ))}

                {products.length === 0 && (
                    <p className="py-8 text-center text-sm text-slate-500">
                        No sales data available.
                    </p>
                )}
            </div>
        </section>
    );
}

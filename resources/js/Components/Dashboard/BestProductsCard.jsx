import { Crown, PackageSearch } from "lucide-react";

export default function BestProductsCard({
    products = [],
    currencySymbol = "৳",
}) {
    const max = Math.max(
        ...products.map((item) => Number(item.quantity_sold || 0)),
        1,
    );

    const money = (value) =>
        `${currencySymbol}${new Intl.NumberFormat("en-GB", {
            maximumFractionDigits: 0,
        }).format(Number(value || 0))}`;

    return (
        <section className="rounded-3xl border border-ink-200 bg-white p-5 shadow-soft">
            <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet-700">
                    <Crown size={19} />
                </span>
                <div>
                    <h2 className="font-black text-ink-950">
                        Best-selling products
                    </h2>
                    <p className="mt-0.5 text-xs text-ink-400">
                        Ranked by units sold
                    </p>
                </div>
            </div>

            <div className="mt-5 space-y-4">
                {products.slice(0, 6).map((item, index) => (
                    <div key={item.product_id ?? item.id ?? index}>
                        <div className="flex items-center gap-3">
                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-ink-100 text-xs font-black text-ink-600">
                                {index + 1}
                            </span>

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-black text-ink-800">
                                    {item.name}
                                </p>
                                <p className="mt-0.5 text-[10px] text-ink-400">
                                    {item.quantity_sold || 0} sold ·{" "}
                                    {money(item.revenue)}
                                </p>
                            </div>

                            <span className="text-[10px] font-black text-ink-400">
                                Stock {item.stock ?? 0}
                            </span>
                        </div>

                        <div className="ml-11 mt-2 h-1.5 overflow-hidden rounded-full bg-ink-100">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-violet-500"
                                style={{
                                    width: `${Math.max(
                                        5,
                                        (Number(item.quantity_sold || 0) /
                                            max) *
                                            100,
                                    )}%`,
                                }}
                            />
                        </div>
                    </div>
                ))}

                {products.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-ink-200 bg-ink-50/60 px-5 py-10 text-center">
                        <PackageSearch
                            className="mx-auto text-ink-300"
                            size={28}
                        />
                        <p className="mt-3 text-sm font-black text-ink-600">
                            No product ranking yet
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}

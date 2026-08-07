import { Link } from "@inertiajs/react";
import {
    AlertTriangle,
    ArrowUpRight,
    CheckCircle2,
    PackageX,
} from "lucide-react";
import Badge from "@/Components/Admin/UI/Badge";

export default function InventoryAttention({
    products = [],
    limit = 5,
}) {
    return (
        <section className="rounded-3xl border border-ink-200 bg-white p-5 shadow-soft">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-700">
                        <AlertTriangle size={19} />
                    </span>
                    <div>
                        <h2 className="font-black text-ink-950">
                            Inventory attention
                        </h2>
                        <p className="mt-0.5 text-xs text-ink-400">
                            Items at or below {limit} units
                        </p>
                    </div>
                </div>

                <Link
                    href={route("admin.products.index")}
                    className="inline-flex items-center gap-1 text-xs font-black text-brand-700"
                >
                    Products
                    <ArrowUpRight size={13} />
                </Link>
            </div>

            <div className="mt-5 space-y-2.5">
                {products.slice(0, 6).map((product) => {
                    const out = Number(product.stock || 0) <= 0;

                    return (
                        <div
                            key={product.id}
                            className="flex items-center gap-3 rounded-2xl border border-ink-100 bg-ink-50/50 px-3.5 py-3"
                        >
                            <span
                                className={
                                    out
                                        ? "grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-rose-50 text-rose-600"
                                        : "grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600"
                                }
                            >
                                {out ? (
                                    <PackageX size={17} />
                                ) : (
                                    <AlertTriangle size={17} />
                                )}
                            </span>

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-black text-ink-800">
                                    {product.name}
                                </p>
                                <p className="mt-0.5 truncate text-[10px] text-ink-400">
                                    {product.sku || "No SKU"} ·{" "}
                                    {product.category || "Uncategorized"}
                                </p>
                            </div>

                            <Badge tone={out ? "danger" : "warning"}>
                                {out ? "Out" : `${product.stock} left`}
                            </Badge>
                        </div>
                    );
                })}

                {products.length === 0 && (
                    <div className="rounded-2xl bg-emerald-50 px-5 py-10 text-center">
                        <CheckCircle2
                            className="mx-auto text-emerald-600"
                            size={28}
                        />
                        <p className="mt-3 text-sm font-black text-emerald-800">
                            Stock levels are healthy
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}

import {
    AlertTriangle,
    CheckCircle2,
    PackageX,
    ShieldCheck,
} from "lucide-react";
import cn from "@/lib/cn";

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export default function BusinessHealthCard({
    stats = {},
    lowStockLimit = 5,
}) {
    const outOfStock = Number(stats.out_of_stock || 0);
    const lowStock = Number(stats.low_stock || 0);
    const due = Number(stats.total_due || 0);
    const products = Math.max(Number(stats.products || 0), 1);

    const stockPenalty = clamp(
        ((outOfStock * 2 + lowStock) / products) * 100,
        0,
        40,
    );
    const duePenalty = due > 0 ? 12 : 0;
    const score = Math.round(clamp(100 - stockPenalty - duePenalty, 35, 100));

    const tone =
        score >= 85
            ? {
                  ring: "text-emerald-600",
                  badge: "bg-emerald-50 text-emerald-700",
                  label: "Healthy",
              }
            : score >= 65
              ? {
                    ring: "text-amber-600",
                    badge: "bg-amber-50 text-amber-700",
                    label: "Needs attention",
                }
              : {
                    ring: "text-rose-600",
                    badge: "bg-rose-50 text-rose-700",
                    label: "At risk",
                };

    const items = [
        {
            label: "Inventory",
            value:
                outOfStock > 0
                    ? `${outOfStock} out of stock`
                    : "No products out of stock",
            icon: outOfStock > 0 ? PackageX : CheckCircle2,
            good: outOfStock === 0,
        },
        {
            label: "Low stock",
            value: `${lowStock} item(s) at or below ${lowStockLimit}`,
            icon: AlertTriangle,
            good: lowStock === 0,
        },
        {
            label: "Customer due",
            value: due > 0 ? "Outstanding balance exists" : "No outstanding due",
            icon: due > 0 ? AlertTriangle : ShieldCheck,
            good: due === 0,
        },
    ];

    return (
        <section className="rounded-3xl border border-ink-200 bg-white p-5 shadow-soft">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-700">
                        Business health
                    </p>
                    <h2 className="mt-1 text-lg font-black text-ink-950">
                        Operational readiness
                    </h2>
                </div>

                <span
                    className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-black",
                        tone.badge,
                    )}
                >
                    {tone.label}
                </span>
            </div>

            <div className="mt-5 flex items-center gap-5">
                <div
                    className={cn(
                        "grid h-24 w-24 shrink-0 place-items-center rounded-full border-[9px] border-current bg-white shadow-inner",
                        tone.ring,
                    )}
                    style={{
                        background: `conic-gradient(currentColor ${score * 3.6}deg, rgb(241 245 249) 0deg)`,
                    }}
                >
                    <div className="grid h-[70px] w-[70px] place-items-center rounded-full bg-white">
                        <div className="text-center">
                            <p className="text-2xl font-black text-ink-950">
                                {score}
                            </p>
                            <p className="text-[9px] font-black uppercase tracking-wider text-ink-400">
                                Score
                            </p>
                        </div>
                    </div>
                </div>

                <div className="min-w-0 flex-1 space-y-3">
                    {items.map(({ label, value, icon: Icon, good }) => (
                        <div
                            key={label}
                            className="flex items-start gap-3 rounded-xl bg-ink-50 px-3 py-2.5"
                        >
                            <Icon
                                size={16}
                                className={cn(
                                    "mt-0.5 shrink-0",
                                    good
                                        ? "text-emerald-600"
                                        : "text-amber-600",
                                )}
                            />
                            <div className="min-w-0">
                                <p className="text-xs font-black text-ink-700">
                                    {label}
                                </p>
                                <p className="truncate text-[11px] text-ink-400">
                                    {value}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

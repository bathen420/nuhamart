import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import cn from "@/lib/cn";

const tones = {
    brand: {
        icon: "bg-brand-50 text-brand-700 ring-brand-100",
        accent: "bg-brand-500",
    },
    emerald: {
        icon: "bg-emerald-50 text-emerald-700 ring-emerald-100",
        accent: "bg-emerald-500",
    },
    sky: {
        icon: "bg-sky-50 text-sky-700 ring-sky-100",
        accent: "bg-sky-500",
    },
    amber: {
        icon: "bg-amber-50 text-amber-700 ring-amber-100",
        accent: "bg-amber-500",
    },
    rose: {
        icon: "bg-rose-50 text-rose-700 ring-rose-100",
        accent: "bg-rose-500",
    },
    violet: {
        icon: "bg-violet-50 text-violet-700 ring-violet-100",
        accent: "bg-violet-500",
    },
};

export default function CommandKpiCard({
    label,
    value,
    helper,
    icon: Icon,
    tone = "brand",
    change,
    trend = "up",
    compact = false,
}) {
    const config = tones[tone] || tones.brand;
    const TrendIcon = trend === "down" ? ArrowDownRight : ArrowUpRight;

    return (
        <article className="group relative overflow-hidden rounded-3xl border border-ink-200 bg-white p-5 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card">
            <span
                className={cn(
                    "absolute inset-x-0 top-0 h-1 opacity-0 transition group-hover:opacity-100",
                    config.accent,
                )}
            />

            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-sm font-bold text-ink-500">{label}</p>
                    <p
                        className={cn(
                            "mt-2 truncate font-black tracking-tight text-ink-950",
                            compact ? "text-2xl" : "text-[1.7rem]",
                        )}
                        title={String(value)}
                    >
                        {value}
                    </p>
                </div>

                {Icon && (
                    <span
                        className={cn(
                            "grid h-11 w-11 shrink-0 place-items-center rounded-2xl ring-1 ring-inset",
                            config.icon,
                        )}
                    >
                        <Icon size={20} strokeWidth={2} />
                    </span>
                )}
            </div>

            <div className="mt-4 flex min-h-5 items-center gap-2">
                {change !== undefined && change !== null && (
                    <span
                        className={cn(
                            "inline-flex items-center gap-1 text-xs font-black",
                            trend === "down"
                                ? "text-rose-600"
                                : "text-emerald-600",
                        )}
                    >
                        <TrendIcon size={14} />
                        {change}
                    </span>
                )}

                {helper && (
                    <span className="truncate text-xs font-medium text-ink-400">
                        {helper}
                    </span>
                )}
            </div>
        </article>
    );
}

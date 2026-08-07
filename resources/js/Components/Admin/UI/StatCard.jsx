import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import cn from "@/lib/cn";

const tones = {
    brand: "bg-brand-50 text-brand-700",
    blue: "bg-sky-50 text-sky-700",
    purple: "bg-violet-50 text-violet-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
    green: "bg-emerald-50 text-emerald-700",
};

export default function StatCard({
    label,
    value,
    icon: Icon,
    tone = "brand",
    change,
    trend = "up",
    helper,
    className = "",
}) {
    const TrendIcon = trend === "down" ? ArrowDownRight : ArrowUpRight;

    return (
        <div
            className={cn(
                "rounded-3xl border border-ink-200 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card",
                className,
            )}
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-bold text-ink-500">{label}</p>
                    <p className="mt-2 text-2xl font-black tracking-tight text-ink-900">
                        {value}
                    </p>
                </div>

                {Icon && (
                    <span
                        className={cn(
                            "grid h-11 w-11 place-items-center rounded-2xl",
                            tones[tone] || tones.brand,
                        )}
                    >
                        <Icon size={21} />
                    </span>
                )}
            </div>

            {(change || helper) && (
                <div className="mt-4 flex items-center gap-2 text-xs">
                    {change && (
                        <span
                            className={cn(
                                "inline-flex items-center gap-1 font-black",
                                trend === "down"
                                    ? "text-rose-600"
                                    : "text-emerald-600",
                            )}
                        >
                            <TrendIcon size={14} />
                            {change}
                        </span>
                    )}
                    {helper && <span className="text-ink-400">{helper}</span>}
                </div>
            )}
        </div>
    );
}

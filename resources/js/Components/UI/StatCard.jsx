import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

const variantStyles = {
    indigo: {
        icon: "bg-indigo-50 text-indigo-600 ring-indigo-100",
        accent: "from-indigo-500 to-violet-500",
    },
    emerald: {
        icon: "bg-emerald-50 text-emerald-600 ring-emerald-100",
        accent: "from-emerald-500 to-teal-500",
    },
    amber: {
        icon: "bg-amber-50 text-amber-600 ring-amber-100",
        accent: "from-amber-500 to-orange-500",
    },
    rose: {
        icon: "bg-rose-50 text-rose-600 ring-rose-100",
        accent: "from-rose-500 to-pink-500",
    },
    sky: {
        icon: "bg-sky-50 text-sky-600 ring-sky-100",
        accent: "from-sky-500 to-blue-500",
    },
    slate: {
        icon: "bg-slate-100 text-slate-600 ring-slate-200",
        accent: "from-slate-500 to-slate-700",
    },
};

function formatValue(value, type, currency) {
    if (type === "currency") {
        return new Intl.NumberFormat("en-BD", {
            style: "currency",
            currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(Number(value || 0));
    }

    if (type === "number") {
        return new Intl.NumberFormat("en-BD").format(Number(value || 0));
    }

    return value ?? 0;
}

export default function StatCard({
    title,
    value = 0,
    icon: Icon,
    variant = "indigo",
    valueType = "number",
    currency = "BDT",
    subtitle = "",
    trend = null,
    trendLabel = "",
    loading = false,
    className = "",
}) {
    const styles = variantStyles[variant] ?? variantStyles.indigo;
    const numericTrend = Number(trend || 0);

    const TrendIcon =
        numericTrend > 0
            ? ArrowUpRight
            : numericTrend < 0
              ? ArrowDownRight
              : Minus;

    const trendColor =
        numericTrend > 0
            ? "text-emerald-600"
            : numericTrend < 0
              ? "text-rose-600"
              : "text-slate-500";

    return (
        <div
            className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg ${className}`}
        >
            <div
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${styles.accent}`}
            />

            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-500">
                        {title}
                    </p>

                    {loading ? (
                        <div className="mt-3 h-9 w-32 animate-pulse rounded-lg bg-slate-200" />
                    ) : (
                        <p className="mt-2 break-words text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            {formatValue(value, valueType, currency)}
                        </p>
                    )}
                </div>

                {Icon && (
                    <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 transition duration-300 group-hover:scale-105 ${styles.icon}`}
                    >
                        <Icon className="h-6 w-6" />
                    </div>
                )}
            </div>

            {(subtitle || trend !== null) && (
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 text-xs">
                    {trend !== null && (
                        <span
                            className={`inline-flex items-center gap-1 font-semibold ${trendColor}`}
                        >
                            <TrendIcon className="h-3.5 w-3.5" />

                            {numericTrend > 0 ? "+" : ""}
                            {numericTrend}%
                        </span>
                    )}

                    {trendLabel && (
                        <span className="text-slate-400">{trendLabel}</span>
                    )}

                    {subtitle && (
                        <span className="text-slate-500">{subtitle}</span>
                    )}
                </div>
            )}
        </div>
    );
}
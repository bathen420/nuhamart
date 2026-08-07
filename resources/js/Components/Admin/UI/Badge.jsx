import cn from "@/lib/cn";

const tones = {
    neutral: "bg-ink-100 text-ink-700 ring-ink-200",
    brand: "bg-brand-50 text-brand-800 ring-brand-200",
    info: "bg-sky-50 text-sky-700 ring-sky-200",
    success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    warning: "bg-amber-50 text-amber-700 ring-amber-200",
    danger: "bg-rose-50 text-rose-700 ring-rose-200",
    purple: "bg-violet-50 text-violet-700 ring-violet-200",
};

export default function Badge({
    tone = "neutral",
    dot = false,
    className = "",
    children,
}) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-black ring-1 ring-inset",
                tones[tone] || tones.neutral,
                className,
            )}
        >
            {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
            {children}
        </span>
    );
}

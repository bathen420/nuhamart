import cn from "@/lib/cn";

export default function Toggle({
    checked,
    onChange,
    label,
    description,
    disabled = false,
    className = "",
}) {
    return (
        <label
            className={cn(
                "flex items-center justify-between gap-4 rounded-2xl border border-ink-200 bg-white p-4 transition",
                disabled
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer hover:border-brand-200 hover:bg-brand-50/30",
                className,
            )}
        >
            <span className="min-w-0">
                <span className="block text-sm font-black text-ink-800">
                    {label}
                </span>
                {description && (
                    <span className="mt-1 block text-xs leading-5 text-ink-500">
                        {description}
                    </span>
                )}
            </span>

            <span
                className={cn(
                    "relative h-6 w-11 shrink-0 rounded-full transition",
                    checked ? "bg-brand-600" : "bg-ink-300",
                )}
            >
                <input
                    type="checkbox"
                    checked={Boolean(checked)}
                    disabled={disabled}
                    onChange={(event) => onChange?.(event.target.checked)}
                    className="sr-only"
                />
                <span
                    className={cn(
                        "absolute top-1 h-4 w-4 rounded-full bg-white shadow transition",
                        checked ? "left-6" : "left-1",
                    )}
                />
            </span>
        </label>
    );
}

import { forwardRef } from "react";
import cn from "@/lib/cn";

const Select = forwardRef(function Select(
    { className = "", invalid = false, children, ...props },
    ref,
) {
    return (
        <select
            ref={ref}
            className={cn(
                "block w-full rounded-xl border bg-white px-3.5 py-2.5 pr-10 text-sm text-ink-900 shadow-sm outline-none transition focus:ring-4",
                invalid
                    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10"
                    : "border-ink-200 focus:border-brand-500 focus:ring-brand-500/10",
                className,
            )}
            aria-invalid={invalid || undefined}
            {...props}
        >
            {children}
        </select>
    );
});

export default Select;

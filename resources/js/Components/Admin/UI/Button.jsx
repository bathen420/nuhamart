import { forwardRef } from "react";
import cn from "@/lib/cn";

const variants = {
    primary:
        "border-transparent bg-brand-700 text-white shadow-brand hover:bg-brand-800 focus-visible:ring-brand-500",
    secondary:
        "border-ink-200 bg-white text-ink-700 shadow-sm hover:border-ink-300 hover:bg-ink-50 focus-visible:ring-ink-400",
    subtle:
        "border-transparent bg-ink-100 text-ink-700 hover:bg-ink-200 focus-visible:ring-ink-400",
    danger:
        "border-transparent bg-rose-600 text-white shadow-sm hover:bg-rose-700 focus-visible:ring-rose-500",
    ghost:
        "border-transparent bg-transparent text-ink-600 hover:bg-ink-100 hover:text-ink-900 focus-visible:ring-ink-400",
};

const sizes = {
    xs: "h-8 gap-1.5 rounded-lg px-2.5 text-xs",
    sm: "h-9 gap-2 rounded-xl px-3 text-sm",
    md: "h-10 gap-2 rounded-xl px-4 text-sm",
    lg: "h-11 gap-2.5 rounded-xl px-5 text-sm",
    icon: "h-10 w-10 rounded-xl",
};

const Button = forwardRef(function Button(
    {
        as: Component = "button",
        type = "button",
        variant = "primary",
        size = "md",
        loading = false,
        disabled = false,
        className = "",
        children,
        ...props
    },
    ref,
) {
    const isDisabled = disabled || loading;

    return (
        <Component
            ref={ref}
            type={Component === "button" ? type : undefined}
            disabled={Component === "button" ? isDisabled : undefined}
            aria-disabled={isDisabled || undefined}
            className={cn(
                "inline-flex shrink-0 items-center justify-center border font-black transition duration-150 focus:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-50",
                variants[variant] || variants.primary,
                sizes[size] || sizes.md,
                className,
            )}
            {...props}
        >
            {loading && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
            )}
            {children}
        </Component>
    );
});

export default Button;

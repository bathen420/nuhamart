const variants = {
    success:
        "border-emerald-200 bg-emerald-50 text-emerald-700 ring-emerald-100",
    danger: "border-rose-200 bg-rose-50 text-rose-700 ring-rose-100",
    warning: "border-amber-200 bg-amber-50 text-amber-700 ring-amber-100",
    info: "border-sky-200 bg-sky-50 text-sky-700 ring-sky-100",
    primary:
        "border-indigo-200 bg-indigo-50 text-indigo-700 ring-indigo-100",
    secondary:
        "border-slate-200 bg-slate-100 text-slate-700 ring-slate-200",
    dark: "border-slate-700 bg-slate-800 text-white ring-slate-700",
};

const sizes = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
};

export default function Badge({
    children,
    variant = "secondary",
    size = "md",
    dot = false,
    icon: Icon = null,
    rounded = true,
    className = "",
}) {
    const variantClass = variants[variant] ?? variants.secondary;
    const sizeClass = sizes[size] ?? sizes.md;

    return (
        <span
            className={`inline-flex w-fit items-center gap-1.5 border font-semibold ring-1 ring-inset ${
                rounded ? "rounded-full" : "rounded-lg"
            } ${variantClass} ${sizeClass} ${className}`}
        >
            {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}

            {Icon && <Icon className="h-3.5 w-3.5" />}

            {children}
        </span>
    );
}
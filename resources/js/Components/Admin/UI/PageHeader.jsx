import cn from "@/lib/cn";

export default function PageHeader({
    eyebrow,
    title,
    description,
    actions,
    children,
    className = "",
}) {
    return (
        <div
            className={cn(
                "flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between",
                className,
            )}
        >
            <div className="min-w-0">
                {eyebrow && (
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-700">
                        {eyebrow}
                    </p>
                )}
                <h1 className="mt-1 text-2xl font-black tracking-tight text-ink-900 sm:text-3xl">
                    {title}
                </h1>
                {description && (
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-500">
                        {description}
                    </p>
                )}
                {children}
            </div>

            {actions && (
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                    {actions}
                </div>
            )}
        </div>
    );
}

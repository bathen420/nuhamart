import cn from "@/lib/cn";

export function Card({ className = "", children, ...props }) {
    return (
        <section
            className={cn(
                "rounded-3xl border border-ink-200 bg-white shadow-soft",
                className,
            )}
            {...props}
        >
            {children}
        </section>
    );
}

export function CardHeader({
    title,
    description,
    action,
    className = "",
    children,
}) {
    return (
        <div
            className={cn(
                "flex flex-col gap-3 border-b border-ink-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6",
                className,
            )}
        >
            <div className="min-w-0">
                {children || (
                    <>
                        <h2 className="text-lg font-black text-ink-900">
                            {title}
                        </h2>
                        {description && (
                            <p className="mt-1 text-sm leading-6 text-ink-500">
                                {description}
                            </p>
                        )}
                    </>
                )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
}

export function CardBody({ className = "", children }) {
    return <div className={cn("p-5 sm:p-6", className)}>{children}</div>;
}

export function CardFooter({ className = "", children }) {
    return (
        <div
            className={cn(
                "border-t border-ink-100 px-5 py-4 sm:px-6",
                className,
            )}
        >
            {children}
        </div>
    );
}

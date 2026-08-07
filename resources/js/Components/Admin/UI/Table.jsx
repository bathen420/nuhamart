import cn from "@/lib/cn";

export function TableContainer({ className = "", children }) {
    return (
        <div
            className={cn(
                "overflow-hidden rounded-2xl border border-ink-200 bg-white",
                className,
            )}
        >
            <div className="overflow-x-auto nm-scrollbar">{children}</div>
        </div>
    );
}

export function Table({ className = "", children }) {
    return (
        <table
            className={cn(
                "min-w-full divide-y divide-ink-200",
                className,
            )}
        >
            {children}
        </table>
    );
}

export function TableHead({ className = "", children }) {
    return <thead className={cn("bg-ink-50", className)}>{children}</thead>;
}

export function TableBody({ className = "", children }) {
    return (
        <tbody className={cn("divide-y divide-ink-100", className)}>
            {children}
        </tbody>
    );
}

export function TableRow({ className = "", children, ...props }) {
    return (
        <tr
            className={cn(
                "transition-colors hover:bg-brand-50/40",
                className,
            )}
            {...props}
        >
            {children}
        </tr>
    );
}

export function TableHeader({ className = "", children, ...props }) {
    return (
        <th
            className={cn(
                "px-4 py-3 text-left text-xs font-black uppercase tracking-[0.08em] text-ink-500",
                className,
            )}
            {...props}
        >
            {children}
        </th>
    );
}

export function TableCell({ className = "", children, ...props }) {
    return (
        <td
            className={cn(
                "whitespace-nowrap px-4 py-3.5 text-sm text-ink-700",
                className,
            )}
            {...props}
        >
            {children}
        </td>
    );
}

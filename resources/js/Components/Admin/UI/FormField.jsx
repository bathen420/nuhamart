import cn from "@/lib/cn";

export default function FormField({
    label,
    htmlFor,
    required = false,
    description,
    error,
    className = "",
    children,
}) {
    return (
        <div className={cn("min-w-0", className)}>
            {label && (
                <label
                    htmlFor={htmlFor}
                    className="mb-2 block text-sm font-bold text-ink-700"
                >
                    {label}
                    {required && (
                        <span className="ml-1 text-rose-500" aria-hidden="true">
                            *
                        </span>
                    )}
                </label>
            )}

            {children}

            {error ? (
                <p className="mt-1.5 text-xs font-semibold text-rose-600">
                    {error}
                </p>
            ) : description ? (
                <p className="mt-1.5 text-xs leading-5 text-ink-500">
                    {description}
                </p>
            ) : null}
        </div>
    );
}

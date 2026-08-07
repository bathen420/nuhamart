import Button from "./Button";

export default function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
    className = "",
}) {
    return (
        <div
            className={`rounded-3xl border border-dashed border-ink-300 bg-ink-50/60 px-6 py-14 text-center ${className}`}
        >
            {Icon && (
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white text-ink-400 shadow-sm">
                    <Icon size={26} />
                </span>
            )}
            <h3 className="mt-4 text-lg font-black text-ink-900">{title}</h3>
            {description && (
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-500">
                    {description}
                </p>
            )}
            {actionLabel && (
                <Button className="mt-5" onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}

import { Link } from "@inertiajs/react";
import { Inbox, Plus } from "lucide-react";

export default function EmptyState({
    icon: Icon = Inbox,
    title = "No data found",
    description = "There is currently no information available.",
    actionLabel = "",
    actionHref = "",
    onAction = null,
    actionIcon: ActionIcon = Plus,
    compact = false,
    className = "",
}) {
    const actionClasses =
        "inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:-translate-y-0.5 hover:from-indigo-700 hover:to-violet-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2";

    return (
        <div
            className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-6 text-center ${
                compact ? "min-h-56 py-10" : "min-h-80 py-14"
            } ${className}`}
        >
            <div className="relative">
                <div className="absolute inset-0 scale-150 rounded-full bg-indigo-100/60 blur-xl" />

                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200">
                    <Icon className="h-8 w-8" />
                </div>
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">{title}</h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                {description}
            </p>

            {actionLabel && actionHref && (
                <Link href={actionHref} className={`mt-6 ${actionClasses}`}>
                    {ActionIcon && <ActionIcon className="h-4 w-4" />}
                    {actionLabel}
                </Link>
            )}

            {actionLabel && !actionHref && onAction && (
                <button
                    type="button"
                    onClick={onAction}
                    className={`mt-6 ${actionClasses}`}
                >
                    {ActionIcon && <ActionIcon className="h-4 w-4" />}
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
import { Link } from "@inertiajs/react";
import { ChevronRight, Home } from "lucide-react";

export default function PageHeader({
    title,
    description = "",
    icon: Icon = null,
    breadcrumbs = [],
    action = null,
    children = null,
}) {
    return (
        <div className="space-y-5">
            {breadcrumbs.length > 0 && (
                <nav
                    className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500"
                    aria-label="Breadcrumb"
                >
                    <Link
                        href={route("admin.dashboard")}
                        className="inline-flex items-center gap-1.5 transition hover:text-indigo-600"
                    >
                        <Home className="h-4 w-4" />
                        Dashboard
                    </Link>

                    {breadcrumbs.map((breadcrumb, index) => {
                        const isLast = index === breadcrumbs.length - 1;

                        return (
                            <div
                                key={`${breadcrumb.label}-${index}`}
                                className="flex items-center gap-1.5"
                            >
                                <ChevronRight className="h-4 w-4 text-slate-400" />

                                {breadcrumb.href && !isLast ? (
                                    <Link
                                        href={breadcrumb.href}
                                        className="transition hover:text-indigo-600"
                                    >
                                        {breadcrumb.label}
                                    </Link>
                                ) : (
                                    <span
                                        className={
                                            isLast
                                                ? "font-medium text-slate-700"
                                                : ""
                                        }
                                    >
                                        {breadcrumb.label}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </nav>
            )}

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-start gap-4">
                    {Icon && (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-200/70">
                            <Icon className="h-6 w-6" />
                        </div>
                    )}

                    <div className="min-w-0">
                        <h1 className="truncate text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            {title}
                        </h1>

                        {description && (
                            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                {(action || children) && (
                    <div className="flex shrink-0 flex-wrap items-center gap-3">
                        {action}
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
}
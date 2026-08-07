import { Link } from "@inertiajs/react";
import { ChevronRight } from "lucide-react";
import cn from "@/lib/cn";

export default function AdminMenuItem({
    href,
    active = false,
    icon: Icon,
    label,
    description,
    collapsed = false,
    onNavigate,
}) {
    return (
        <Link
            href={href}
            onClick={onNavigate}
            title={collapsed ? label : undefined}
            className={cn(
                "group relative flex min-h-11 items-center rounded-xl border transition duration-150",
                collapsed
                    ? "justify-center px-2"
                    : "gap-3 px-3 py-2.5",
                active
                    ? "border-brand-500/30 bg-brand-500/15 text-white shadow-sm"
                    : "border-transparent text-slate-300 hover:bg-white/7 hover:text-white",
            )}
        >
            {active && (
                <span className="absolute -left-[13px] h-7 w-1 rounded-r-full bg-brand-400" />
            )}

            {Icon && (
                <span
                    className={cn(
                        "grid h-8 w-8 shrink-0 place-items-center rounded-lg transition",
                        active
                            ? "bg-brand-500 text-white shadow-brand"
                            : "bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white",
                    )}
                >
                    <Icon size={17} strokeWidth={1.9} />
                </span>
            )}

            {!collapsed && (
                <>
                    <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold">
                            {label}
                        </span>
                        {description && (
                            <span
                                className={cn(
                                    "mt-0.5 block truncate text-[10px]",
                                    active
                                        ? "text-brand-100"
                                        : "text-slate-500 group-hover:text-slate-400",
                                )}
                            >
                                {description}
                            </span>
                        )}
                    </span>

                    <ChevronRight
                        size={14}
                        className={cn(
                            "shrink-0 transition",
                            active
                                ? "translate-x-0 text-brand-200"
                                : "-translate-x-1 text-slate-600 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                        )}
                    />
                </>
            )}
        </Link>
    );
}

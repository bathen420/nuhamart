import { Link, usePage } from "@inertiajs/react";
import {
    ChevronsLeft,
    ChevronsRight,
    CircleHelp,
    ExternalLink,
    Search,
    Store,
} from "lucide-react";
import AdminMenuItem from "./AdminMenuItem";
import { visibleNavigation } from "@/Components/Admin/AdminNavigation";
import cn from "@/lib/cn";

export default function AdminSidebar({
    collapsed = false,
    mobileOpen = false,
    onToggleCollapse,
    onCloseMobile,
    onOpenSearch,
}) {
    const page = usePage();
    const props = page.props ?? {};
    const businessSettings = props.businessSettings ?? {};
    const auth = props.auth ?? {};
    const sections = visibleNavigation(auth);

    const companyName =
        businessSettings.short_name ||
        businessSettings.company_name ||
        "NuhaMart";

    const logo =
        businessSettings.admin_brand_logo ||
        businessSettings.admin_logo ||
        businessSettings.logo;

    return (
        <>
            {mobileOpen && (
                <button
                    type="button"
                    aria-label="Close navigation"
                    onClick={onCloseMobile}
                    className="fixed inset-0 z-40 bg-ink-950/55 backdrop-blur-sm lg:hidden"
                />
            )}

            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex h-screen shrink-0 flex-col border-r border-white/10 bg-ink-950 text-white shadow-2xl transition-[width,transform] duration-200 lg:sticky lg:top-0 lg:z-30 lg:translate-x-0",
                    collapsed ? "w-[84px]" : "w-[280px]",
                    mobileOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0",
                )}
            >
                <div
                    className={cn(
                        "flex h-20 shrink-0 items-center border-b border-white/10",
                        collapsed
                            ? "justify-center px-3"
                            : "justify-between gap-3 px-5",
                    )}
                >
                    <Link
                        href={route("admin.dashboard")}
                        className={cn(
                            "flex min-w-0 items-center",
                            collapsed ? "justify-center" : "gap-3",
                        )}
                    >
                        {logo ? (
                            <img
                                src={logo}
                                alt={companyName}
                                className={cn(
                                    "shrink-0 object-contain",
                                    collapsed
                                        ? "h-10 w-10 rounded-xl bg-white p-1"
                                        : "h-11 max-w-44",
                                )}
                            />
                        ) : (
                            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 text-lg font-black text-white shadow-brand">
                                {companyName.charAt(0).toUpperCase()}
                            </span>
                        )}

                        {!collapsed && !logo && (
                            <span className="min-w-0">
                                <span className="block truncate text-lg font-black tracking-tight text-white">
                                    {companyName}
                                </span>
                                <span className="mt-0.5 block truncate text-[10px] font-bold uppercase tracking-[0.14em] text-brand-300">
                                    Enterprise
                                </span>
                            </span>
                        )}
                    </Link>

                    {!collapsed && (
                        <button
                            type="button"
                            onClick={onToggleCollapse}
                            className="hidden h-9 w-9 place-items-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white lg:grid"
                            aria-label="Collapse sidebar"
                        >
                            <ChevronsLeft size={18} />
                        </button>
                    )}
                </div>

                <div className="shrink-0 px-3 pt-4">
                    <button
                        type="button"
                        onClick={onOpenSearch}
                        className={cn(
                            "flex h-11 w-full items-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:border-brand-500/40 hover:bg-white/10 hover:text-white",
                            collapsed
                                ? "justify-center px-2"
                                : "gap-3 px-3",
                        )}
                        title={collapsed ? "Search or jump to" : undefined}
                    >
                        <Search size={17} />
                        {!collapsed && (
                            <>
                                <span className="flex-1 text-left text-sm font-semibold">
                                    Search or jump to
                                </span>
                                <kbd className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
                                    Ctrl K
                                </kbd>
                            </>
                        )}
                    </button>
                </div>

                <nav className="nm-scrollbar min-h-0 flex-1 overflow-y-auto px-3 pb-5 pt-5">
                    <div className="space-y-6">
                        {sections.map((section) => (
                            <section key={section.key}>
                                {!collapsed && (
                                    <p className="mb-2 px-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-600">
                                        {section.label}
                                    </p>
                                )}

                                <div className="space-y-1">
                                    {section.items.map((item) => (
                                        <AdminMenuItem
                                            key={item.routeName}
                                            href={route(item.routeName)}
                                            active={page.url.startsWith(
                                                item.urlPrefix,
                                            )}
                                            icon={item.icon}
                                            label={item.label}
                                            description={item.description}
                                            collapsed={collapsed}
                                            onNavigate={onCloseMobile}
                                        />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                </nav>

                <div className="shrink-0 border-t border-white/10 p-3">
                    <a
                        href="/"
                        target="_blank"
                        rel="noreferrer"
                        className={cn(
                            "flex min-h-11 items-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white",
                            collapsed
                                ? "justify-center px-2"
                                : "gap-3 px-3",
                        )}
                        title={collapsed ? "View Store" : undefined}
                    >
                        <Store size={18} />
                        {!collapsed && (
                            <>
                                <span className="flex-1 text-sm font-bold">
                                    View Store
                                </span>
                                <ExternalLink size={14} />
                            </>
                        )}
                    </a>

                    <button
                        type="button"
                        className={cn(
                            "mt-1 flex min-h-11 w-full items-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white",
                            collapsed
                                ? "justify-center px-2"
                                : "gap-3 px-3",
                        )}
                        title={collapsed ? "Help & Support" : undefined}
                    >
                        <CircleHelp size={18} />
                        {!collapsed && (
                            <span className="text-sm font-bold">
                                Help & Support
                            </span>
                        )}
                    </button>

                    {collapsed && (
                        <button
                            type="button"
                            onClick={onToggleCollapse}
                            className="mt-2 hidden h-10 w-full place-items-center rounded-xl border border-white/10 text-slate-400 transition hover:bg-white/10 hover:text-white lg:grid"
                            aria-label="Expand sidebar"
                        >
                            <ChevronsRight size={18} />
                        </button>
                    )}
                </div>
            </aside>
        </>
    );
}

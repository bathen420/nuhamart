import { Link, usePage } from "@inertiajs/react";
import {
    ChevronDown,
    ExternalLink,
    FilePlus2,
    LogOut,
    Menu,
    PackagePlus,
    Plus,
    Search,
    Settings,
    ShoppingCart,
    SlidersHorizontal,
    Store,
    UserPlus,
    UsersRound,
    X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import NotificationBell from "@/Components/Notifications/NotificationBell";
import { createAccessChecker } from "@/Components/Admin/AdminNavigation";
import cn from "@/lib/cn";

function initials(name = "User") {
    return name
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join("")
        .toUpperCase();
}

export default function Navbar({ onOpenMobile, onOpenSearch }) {
    const { auth = {} } = usePage().props;
    const user = auth?.user;

    const [profileOpen, setProfileOpen] = useState(false);
    const [quickCreateOpen, setQuickCreateOpen] = useState(false);

    const profileRef = useRef(null);
    const quickCreateRef = useRef(null);

    const can = useMemo(() => createAccessChecker(auth), [auth]);

    const quickActions = useMemo(
        () =>
            [
                {
                    label: "New POS Sale",
                    description: "Open the point-of-sale screen",
                    routeName: "admin.pos.create",
                    permission: "pos.create",
                    icon: ShoppingCart,
                    tone: "bg-brand-50 text-brand-700",
                },
                {
                    label: "Add Product",
                    description: "Create a new product or book",
                    routeName: "admin.products.create",
                    permission: "products.create",
                    icon: PackagePlus,
                    tone: "bg-sky-50 text-sky-700",
                },
                {
                    label: "Create Purchase",
                    description: "Record a supplier purchase",
                    routeName: "admin.purchases.create",
                    permission: "purchases.create",
                    icon: FilePlus2,
                    tone: "bg-amber-50 text-amber-700",
                },
                {
                    label: "Add Customer",
                    description: "Register a new customer",
                    routeName: "admin.customers.create",
                    permission: "customers.create",
                    icon: UserPlus,
                    tone: "bg-violet-50 text-violet-700",
                },
                {
                    label: "Create Order",
                    description: "Create an order manually",
                    routeName: "admin.orders.create",
                    permission: "orders.create",
                    icon: UsersRound,
                    tone: "bg-emerald-50 text-emerald-700",
                },
                {
                    label: "Stock Adjustment",
                    description: "Increase or decrease stock",
                    routeName: "admin.stock-adjustments.create",
                    permission: "stock-adjustments.create",
                    icon: SlidersHorizontal,
                    tone: "bg-rose-50 text-rose-700",
                },
            ].filter((item) => can(item.permission)),
        [can],
    );

    useEffect(() => {
        const closeDropdowns = (event) => {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setProfileOpen(false);
            }

            if (
                quickCreateRef.current &&
                !quickCreateRef.current.contains(event.target)
            ) {
                setQuickCreateOpen(false);
            }
        };

        const closeWithEscape = (event) => {
            if (event.key === "Escape") {
                setProfileOpen(false);
                setQuickCreateOpen(false);
            }
        };

        document.addEventListener("mousedown", closeDropdowns);
        document.addEventListener("keydown", closeWithEscape);

        return () => {
            document.removeEventListener("mousedown", closeDropdowns);
            document.removeEventListener("keydown", closeWithEscape);
        };
    }, []);

    const toggleQuickCreate = () => {
        setProfileOpen(false);
        setQuickCreateOpen((value) => !value);
    };

    const toggleProfile = () => {
        setQuickCreateOpen(false);
        setProfileOpen((value) => !value);
    };

    return (
        <header className="sticky top-0 z-40 flex h-20 shrink-0 items-center border-b border-ink-200 bg-white/95 px-4 backdrop-blur-xl sm:px-6">
            <div className="flex min-w-0 flex-1 items-center gap-3">
                <button
                    type="button"
                    onClick={onOpenMobile}
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-ink-200 text-ink-600 transition hover:bg-ink-50 lg:hidden"
                    aria-label="Open navigation"
                >
                    <Menu size={20} />
                </button>

                <button
                    type="button"
                    onClick={onOpenSearch}
                    className="hidden h-11 w-full max-w-xl items-center gap-3 rounded-xl border border-ink-200 bg-ink-50 px-4 text-left text-ink-400 transition hover:border-brand-300 hover:bg-white hover:text-ink-600 sm:flex"
                >
                    <Search size={17} />
                    <span className="flex-1 text-sm font-semibold">
                        Search pages, orders, products...
                    </span>
                    <kbd className="rounded-lg border border-ink-200 bg-white px-2 py-1 text-[10px] font-black text-ink-400 shadow-sm">
                        Ctrl K
                    </kbd>
                </button>
            </div>

            <div className="ml-4 flex items-center gap-2">
                <div
                    ref={quickCreateRef}
                    className="relative hidden md:block"
                >
                    <button
                        type="button"
                        onClick={toggleQuickCreate}
                        className={cn(
                            "inline-flex h-10 items-center gap-2 rounded-xl bg-brand-700 px-4 text-sm font-black text-white shadow-brand transition hover:bg-brand-800",
                            quickCreateOpen && "bg-brand-800",
                        )}
                        aria-haspopup="menu"
                        aria-expanded={quickCreateOpen}
                    >
                        {quickCreateOpen ? <X size={17} /> : <Plus size={17} />}
                        Quick Create
                        <ChevronDown
                            size={14}
                            className={cn(
                                "transition",
                                quickCreateOpen && "rotate-180",
                            )}
                        />
                    </button>

                    {quickCreateOpen && (
                        <div
                            role="menu"
                            className="absolute right-0 z-50 mt-3 w-[340px] overflow-hidden rounded-3xl border border-ink-200 bg-white p-2 shadow-floating"
                        >
                            <div className="border-b border-ink-100 px-3 py-3">
                                <p className="text-sm font-black text-ink-900">
                                    Quick Create
                                </p>
                                <p className="mt-0.5 text-xs text-ink-400">
                                    Start a common workflow
                                </p>
                            </div>

                            <div className="grid gap-1 py-2">
                                {quickActions.length > 0 ? (
                                    quickActions.map((action) => {
                                        const Icon = action.icon;

                                        return (
                                            <Link
                                                key={action.routeName}
                                                href={route(action.routeName)}
                                                onClick={() =>
                                                    setQuickCreateOpen(false)
                                                }
                                                role="menuitem"
                                                className="group flex items-center gap-3 rounded-2xl px-3 py-3 transition hover:bg-brand-50"
                                            >
                                                <span
                                                    className={cn(
                                                        "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
                                                        action.tone,
                                                    )}
                                                >
                                                    <Icon size={18} />
                                                </span>

                                                <span className="min-w-0 flex-1">
                                                    <span className="block text-sm font-black text-ink-800">
                                                        {action.label}
                                                    </span>
                                                    <span className="mt-0.5 block truncate text-[11px] text-ink-400">
                                                        {action.description}
                                                    </span>
                                                </span>

                                                <ChevronDown
                                                    size={14}
                                                    className="-rotate-90 text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-brand-600"
                                                />
                                            </Link>
                                        );
                                    })
                                ) : (
                                    <div className="px-5 py-10 text-center">
                                        <Plus
                                            className="mx-auto text-ink-300"
                                            size={27}
                                        />
                                        <p className="mt-3 text-sm font-black text-ink-600">
                                            No create actions available
                                        </p>
                                        <p className="mt-1 text-xs text-ink-400">
                                            Your role does not currently have
                                            create permissions.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <NotificationBell />

                <div className="relative" ref={profileRef}>
                    <button
                        type="button"
                        onClick={toggleProfile}
                        className={cn(
                            "flex h-11 items-center gap-3 rounded-xl border border-ink-200 bg-white px-2 text-left transition hover:border-brand-200 hover:bg-brand-50/30 sm:px-3",
                            profileOpen && "border-brand-300 bg-brand-50/40",
                        )}
                    >
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-black text-white shadow-sm">
                            {initials(user?.name)}
                        </span>

                        <span className="hidden min-w-0 sm:block">
                            <span className="block max-w-32 truncate text-sm font-black text-ink-800">
                                {user?.name || "User"}
                            </span>
                            <span className="block max-w-32 truncate text-[10px] text-ink-400">
                                {user?.email}
                            </span>
                        </span>

                        <ChevronDown
                            size={15}
                            className={cn(
                                "hidden text-ink-400 transition sm:block",
                                profileOpen && "rotate-180",
                            )}
                        />
                    </button>

                    {profileOpen && (
                        <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-ink-200 bg-white p-2 shadow-floating">
                            <div className="border-b border-ink-100 px-3 py-3">
                                <p className="truncate text-sm font-black text-ink-900">
                                    {user?.name}
                                </p>
                                <p className="mt-0.5 truncate text-xs text-ink-400">
                                    {user?.email}
                                </p>
                            </div>

                            <div className="py-2">
                                <a
                                    href="/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-ink-600 transition hover:bg-ink-50 hover:text-ink-900"
                                >
                                    <Store size={17} />
                                    View storefront
                                    <ExternalLink
                                        size={13}
                                        className="ml-auto"
                                    />
                                </a>

                                <Link
                                    href={route("admin.settings.edit")}
                                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-ink-600 transition hover:bg-ink-50 hover:text-ink-900"
                                >
                                    <Settings size={17} />
                                    Business settings
                                </Link>
                            </div>

                            <div className="border-t border-ink-100 pt-2">
                                <Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-black text-rose-600 transition hover:bg-rose-50"
                                >
                                    <LogOut size={17} />
                                    Sign out
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

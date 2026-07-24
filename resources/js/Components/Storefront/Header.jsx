import { Link } from "@inertiajs/react";
import { navigationItems } from "@/data/navigation";
import useCart from "@/hooks/useCart";
import CartDrawer from "@/Components/Storefront/CartDrawer";

import {
    ChevronDown,
    Heart,
    Menu,
    Phone,
    Search,
    ShoppingCart,
    User,
    X,
} from "lucide-react";
import { useState } from "react";


    export default function Header({
        auth = {},
        canLogin = true,
        canRegister = true,
        wishlistCount = 0,
    })  {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
    const [search, setSearch] = useState("");

    const { totalItems } = useCart();
    
    const handleSearch = (event) => {
        event.preventDefault();

        const searchTerm = search.trim();

        if (!searchTerm) {
            return;
        }

        console.log("Searching for:", searchTerm);
    };

    return (
        <>
            {/* Announcement bar */}
            <div className="bg-slate-950 text-white">
                <div className="mx-auto flex min-h-10 max-w-7xl items-center justify-between gap-4 px-4 py-2 text-xs sm:px-6 lg:px-8">
                    <p className="font-medium">
                        দেশব্যাপী দ্রুত ডেলিভারি — ৳১,৫০০-এর বেশি অর্ডারে ফ্রি
                        ডেলিভারি
                    </p>

                    <div className="hidden items-center gap-5 md:flex">
                        <a
                            href="tel:+8801700000000"
                            className="flex items-center gap-1.5 transition hover:text-indigo-300"
                        >
                            <Phone className="h-3.5 w-3.5" />

                            <span>+880 1700-000000</span>
                        </a>

                        <a
                            href="#track-order"
                            className="transition hover:text-indigo-300"
                        >
                            Track Order
                        </a>
                    </div>
                </div>
            </div>

            {/* Main header */}
            <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex min-h-20 items-center gap-3 lg:gap-5">
                        {/* Mobile menu button */}
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(true)}
                            aria-label="Open navigation menu"
                            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 lg:hidden"
                        >
                            <Menu className="h-5 w-5" />
                        </button>

                        {/* Logo */}
                        <Link
                            href={route("home")}
                            className="shrink-0 text-2xl font-black tracking-tight text-indigo-700 sm:text-3xl"
                        >
                            Nuha
                            <span className="text-rose-600">Mart</span>
                        </Link>

                        {/* Desktop search */}
                        <form
                            onSubmit={handleSearch}
                            className="hidden min-w-0 flex-1 md:block"
                        >
                            <div className="relative">
                                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                                <input
                                    type="search"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search products, categories and brands..."
                                    className="h-12 w-full rounded-2xl border border-slate-300 bg-slate-50 py-2 pl-12 pr-28 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                                />

                                <button
                                    type="submit"
                                    className="absolute right-1.5 top-1.5 h-9 rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
                                >
                                    Search
                                </button>
                            </div>
                        </form>

                        {/* Header actions */}
                        <nav className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
                            {auth?.user ? (
                                <Link
                                    href={route("admin.dashboard")}
                                    className="flex h-11 items-center gap-2 rounded-xl px-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 hover:text-indigo-700 sm:px-3"
                                >
                                    <User className="h-5 w-5" />

                                    <span className="hidden xl:inline">
                                        Dashboard
                                    </span>
                                </Link>
                            ) : (
                                canLogin && (
                                    <Link
                                        href={route("login")}
                                        className="flex h-11 items-center gap-2 rounded-xl px-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 hover:text-indigo-700 sm:px-3"
                                    >
                                        <User className="h-5 w-5" />

                                        <span className="hidden xl:inline">
                                            Login
                                        </span>
                                    </Link>
                                )
                            )}

                            <button
                                type="button"
                                aria-label="Open wishlist"
                                className="relative flex h-11 w-11 items-center justify-center rounded-xl text-slate-700 transition hover:bg-rose-50 hover:text-rose-600"
                            >
                                <Heart className="h-5 w-5" />

                                <span className="absolute right-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white">
                                    {wishlistCount}
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setCartDrawerOpen(true)}
                                aria-label={`Open shopping cart with ${totalItems} items`}
                                className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 transition hover:bg-indigo-100"
                            >
                                <ShoppingCart className="h-5 w-5" />

                                {totalItems > 0 && (
                                    <span className="absolute right-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
                                        {totalItems > 99 ? "99+" : totalItems}
                                    </span>
                                )}
                            </button>
                        </nav>
                    </div>

                    {/* Mobile search */}
                    <form
                        onSubmit={handleSearch}
                        className="pb-4 md:hidden"
                    >
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                            <input
                                type="search"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search products..."
                                className="h-11 w-full rounded-xl border border-slate-300 bg-slate-50 py-2 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                            />
                        </div>
                    </form>
                </div>

                {/* Desktop navigation */}
                <div className="hidden border-t border-slate-100 lg:block">
                    <div className="mx-auto flex max-w-7xl items-center gap-7 px-6 py-3">
                        <button
                            type="button"
                            className="flex items-center gap-2 text-sm font-bold text-indigo-700 transition hover:text-indigo-900"
                        >
                            <Menu className="h-4 w-4" />

                            <span>All Categories</span>

                            <ChevronDown className="h-4 w-4" />
                        </button>

                        <nav className="flex items-center gap-7">
                            {navigationItems.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className="text-sm font-semibold text-slate-700 transition hover:text-indigo-600"
                                >
                                    {item.label}
                                </a>
                            ))}
                        </nav>
                    </div>
                </div>
            </header>

            {/* Mobile navigation drawer */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[60] lg:hidden">
                    <button
                        type="button"
                        aria-label="Close navigation overlay"
                        onClick={() => setMobileMenuOpen(false)}
                        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
                    />

                    <aside className="absolute left-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-white shadow-2xl">
                        <div className="flex min-h-20 items-center justify-between border-b border-slate-200 px-5">
                            <Link
                                href={route("home")}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-2xl font-black text-indigo-700"
                            >
                                Nuha
                                <span className="text-rose-600">Mart</span>
                            </Link>

                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(false)}
                                aria-label="Close navigation menu"
                                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-5 py-6">
                            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                                Navigation
                            </p>

                            <nav className="space-y-1">
                                <a
                                    href="#categories"
                                    onClick={() =>
                                        setMobileMenuOpen(false)
                                    }
                                    className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50"
                                >
                                    <span>All Categories</span>

                                    <ChevronDown className="h-4 w-4" />
                                </a>

                                {navigationItems.map((item) => (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        onClick={() =>
                                            setMobileMenuOpen(false)
                                        }
                                        className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-indigo-700"
                                    >
                                        {item.label}
                                    </a>
                                ))}
                            </nav>

                            {!auth?.user && (
                                <div className="mt-8 border-t border-slate-200 pt-6">
                                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                                        My Account
                                    </p>

                                    <div className="grid gap-3">
                                        {canLogin && (
                                            <Link
                                                href={route("login")}
                                                onClick={() =>
                                                    setMobileMenuOpen(false)
                                                }
                                                className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                                            >
                                                <User className="h-4 w-4" />
                                                Login
                                            </Link>
                                        )}

                                        {canRegister && (
                                            <Link
                                                href={route("register")}
                                                onClick={() =>
                                                    setMobileMenuOpen(false)
                                                }
                                                className="rounded-xl bg-indigo-600 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-indigo-700"
                                            >
                                                Create Account
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-slate-200 p-5">
                            <a
                                href="tel:+8801700000000"
                                className="flex items-center gap-3 rounded-xl bg-slate-100 p-4 text-sm font-bold text-slate-700"
                            >
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                                    <Phone className="h-5 w-5" />
                                </span>

                                <span>
                                    <span className="block text-xs font-medium text-slate-500">
                                        Customer Support
                                    </span>

                                    <span className="mt-0.5 block">
                                        +880 1700-000000
                                    </span>
                                </span>
                            </a>
                        </div>
                    </aside>
                </div>
            )}

            <CartDrawer
                open={cartDrawerOpen}
                onClose={() => setCartDrawerOpen(false)}
            />

        </>
    );
}
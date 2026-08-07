import { Link, router, usePage } from "@inertiajs/react";
import {
    BookOpen,
    ChevronDown,
    CircleHelp,
    Globe2,
    Heart,
    Home,
    LogIn,
    LogOut,
    MapPin,
    Menu,
    Package,
    Search,
    ShoppingBag,
    ShoppingCart,
    Sparkles,
    User,
    UserPlus,
    UserRound,
    X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import SmartSearch from "@/Components/Storefront/SmartSearch";
import useCart from "@/hooks/useCart";
import useWishlist from "@/hooks/useWishlist";
import { useI18n } from "@/i18n";

const primaryNavigation = [
    { key: "books", query: "?product_type=physical" },
    { key: "ebooks", query: "?product_type=ebook" },
    { key: "stationery", query: "?category=stationery" },
    { key: "newArrivals", query: "?sort=newest" },
    { key: "bestSellers", query: "?sort=popular" },
    { key: "offers", query: "?sort=discount" },
];

const routeExists = (name) => {
    try {
        return typeof route === "function" && route().has(name);
    } catch {
        return false;
    }
};

const safeRoute = (name, fallback = "#", parameters = undefined) => {
    if (!routeExists(name)) {
        return fallback;
    }

    return route(name, parameters);
};

export default function StorefrontLayout({ children, categories = [] }) {
    const {
        auth = {},
        storefrontCategories = [],
        businessSettings = {},
    } = usePage().props;

    const { locale, t } = useI18n();
    const { cartItems = [] } = useCart();
    const wishlist = useWishlist(auth?.user ?? null);

    const [mobileOpen, setMobileOpen] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [accountOpen, setAccountOpen] = useState(false);

    const accountMenuRef = useRef(null);

    const cartCount = useMemo(
        () =>
            cartItems.reduce(
                (total, item) => total + (Number(item.quantity) || 1),
                0,
            ),
        [cartItems],
    );

    const menuCategories = categories.length
        ? categories
        : storefrontCategories;

    const brand = businessSettings.company_name || "Nuha Mart BD";

    const categoryColumns = [0, 1, 2].map((column) =>
        menuCategories
            .filter((_, index) => index % 3 === column)
            .slice(0, 6),
    );

    const user = auth?.user ?? null;
    const userName = user?.name || "Customer";
    const userInitial = userName.charAt(0).toUpperCase();

    const accountLinks = [
        {
            label: "Dashboard",
            icon: Home,
            routeName: "customer.dashboard",
            fallback: "/account",
        },
        {
            label: "My Orders",
            icon: Package,
            routeName: "customer.orders.index",
            fallback: "/account/orders",
        },
        {
            label: "Wishlist",
            icon: Heart,
            routeName: "customer.wishlist.index",
            fallback: "/account/wishlist",
        },
        {
            label: "Addresses",
            icon: MapPin,
            routeName: "customer.addresses.index",
            fallback: "/account/addresses",
        },
        {
            label: "Profile",
            icon: UserRound,
            routeName: "customer.profile.edit",
            fallback: "/account/profile",
        },
    ];

    useEffect(() => {
        const closeAccountMenu = (event) => {
            if (
                accountMenuRef.current &&
                !accountMenuRef.current.contains(event.target)
            ) {
                setAccountOpen(false);
            }
        };

        document.addEventListener("mousedown", closeAccountMenu);

        return () => {
            document.removeEventListener("mousedown", closeAccountMenu);
        };
    }, []);

    const logout = () => {
        setAccountOpen(false);
        setMobileOpen(false);

        if (routeExists("logout")) {
            router.post(route("logout"));
        }
    };

    return (
        <div className="min-h-screen bg-[#f6f8f7] pb-16 text-slate-900 lg:pb-0">
            <div className="bg-[#0f766e] text-white">
                <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-4 px-4 py-2 text-xs sm:text-sm">
                    <p className="flex min-w-0 items-center gap-2 font-semibold">
                        <Sparkles size={15} className="shrink-0 text-amber-300" />
                        <span className="truncate">{t("announcement")}</span>
                    </p>

                    <div className="hidden items-center gap-5 md:flex">
                        <Link
                            href={safeRoute("orders.track", "/track-order")}
                            className="transition hover:text-amber-200"
                        >
                            {t("trackOrder")}
                        </Link>

                        <Link
                            href="/help"
                            className="flex items-center gap-1 transition hover:text-amber-200"
                        >
                            <CircleHelp size={15} />
                            {t("helpCenter")}
                        </Link>

                        <Link
                            href={safeRoute(
                                "language.switch",
                                "#",
                                locale === "bn" ? "en" : "bn",
                            )}
                            className="flex items-center gap-1 rounded-full border border-white/25 bg-white/10 px-3 py-1 font-bold backdrop-blur"
                        >
                            <Globe2 size={14} />
                            {locale === "bn" ? "English" : "বাংলা"}
                        </Link>
                    </div>
                </div>
            </div>

            <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-[0_8px_30px_rgba(15,118,110,0.06)] backdrop-blur-xl">
                <div className="mx-auto flex max-w-[1480px] items-center gap-3 px-4 py-3 lg:gap-7 lg:py-4">
                    <button
                        type="button"
                        onClick={() => setMobileOpen((open) => !open)}
                        className="rounded-xl border border-slate-200 p-2.5 text-slate-700 lg:hidden"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>

                    <Link
                        href={safeRoute("home", "/")}
                        className="flex min-w-fit items-center gap-2.5"
                    >
                        {businessSettings.logo ? (
                            <img
                                src={businessSettings.logo}
                                alt={brand}
                                className="h-11 w-auto max-w-44 object-contain sm:h-12"
                            />
                        ) : (
                            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#0f766e] to-[#115e59] text-white shadow-lg shadow-teal-900/15 sm:h-12 sm:w-12">
                                <BookOpen size={25} />
                            </span>
                        )}

                        <span className="hidden leading-none sm:block">
                            <span className="block text-xl font-black tracking-tight text-slate-900 lg:text-2xl">
                                {brand}
                            </span>

                            <span className="mt-1 block text-[9px] font-bold tracking-[0.08em] text-[#0f766e] lg:text-[10px]">
                                {businessSettings.company_tagline || "Everything You Need, All in One Place"}
                            </span>
                        </span>
                    </Link>

                    <div className="hidden min-w-0 flex-1 lg:block">
                        <SmartSearch
                            categories={menuCategories}
                            placeholder={t("searchSmart")}
                        />
                        <div className="mt-1.5 px-2 text-[11px] text-slate-400">
                            {t("searchHint")}
                        </div>
                    </div>

                    <div className="ml-auto flex items-center gap-1.5 sm:gap-3">
                        <Link
                            href={
                                user
                                    ? safeRoute(
                                          "customer.wishlist.index",
                                          "/account/wishlist",
                                      )
                                    : safeRoute("wishlist.index", "/wishlist")
                            }
                            className="relative hidden rounded-xl p-2.5 text-slate-700 transition hover:bg-teal-50 hover:text-[#0f766e] sm:block"
                            aria-label={`${t("wishlist")} (${wishlist.count})`}
                        >
                            <Heart size={23} />
                            {wishlist.count > 0 && (
                                <span className="absolute right-0 top-0 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white">
                                    {wishlist.count > 99
                                        ? "99+"
                                        : wishlist.count}
                                </span>
                            )}
                        </Link>

                        <Link
                            href={safeRoute("cart.index", "/cart")}
                            className="relative rounded-xl p-2.5 text-slate-700 transition hover:bg-teal-50 hover:text-[#0f766e]"
                            aria-label={t("cart")}
                        >
                            <ShoppingCart size={24} />
                            {cartCount > 0 && (
                                <span className="absolute right-0 top-0 grid h-5 min-w-5 place-items-center rounded-full bg-[#f59e0b] px-1 text-[10px] font-black text-white">
                                    {cartCount > 99 ? "99+" : cartCount}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div ref={accountMenuRef} className="relative hidden md:block">
                                <button
                                    type="button"
                                    onClick={() => setAccountOpen((open) => !open)}
                                    aria-expanded={accountOpen}
                                    className="flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2.5 text-left text-white transition hover:bg-[#0f766e]"
                                >
                                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/15 text-sm font-black">
                                        {userInitial}
                                    </span>

                                    <span className="hidden max-w-32 leading-tight lg:block">
                                        <span className="block truncate text-[10px] font-semibold text-slate-300">
                                            Hello, {userName}
                                        </span>
                                        <span className="block text-sm font-black">My Account</span>
                                    </span>

                                    <ChevronDown
                                        size={16}
                                        className={`transition ${accountOpen ? "rotate-180" : ""}`}
                                    />
                                </button>

                                {accountOpen && (
                                    <div className="absolute right-0 top-[calc(100%+10px)] z-[70] w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                                        <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
                                            <p className="truncate text-sm font-black text-slate-900">{userName}</p>
                                            <p className="truncate text-xs text-slate-500">{user.email}</p>
                                        </div>

                                        <div className="p-2">
                                            {accountLinks.map((item) => {
                                                const Icon = item.icon;
                                                return (
                                                    <Link
                                                        key={item.label}
                                                        href={safeRoute(item.routeName, item.fallback)}
                                                        onClick={() => setAccountOpen(false)}
                                                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-teal-50 hover:text-[#0f766e]"
                                                    >
                                                        <Icon size={17} />
                                                        {item.label}
                                                    </Link>
                                                );
                                            })}
                                        </div>

                                        <div className="border-t border-slate-100 p-2">
                                            <button
                                                type="button"
                                                onClick={logout}
                                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-black text-rose-600 transition hover:bg-rose-50"
                                            >
                                                <LogOut size={17} />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="hidden items-center gap-2 md:flex">
                                <Link
                                    href={safeRoute("customer.login", "/customer/login")}
                                    className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-[#0f766e] hover:text-[#0f766e]"
                                >
                                    <LogIn size={18} />
                                    Login
                                </Link>

                                {routeExists("register") && (
                                    <Link
                                        href={safeRoute("customer.register", "/customer/register")}
                                        className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0f766e]"
                                    >
                                        <UserPlus size={18} />
                                        Register
                                    </Link>
                                )}
                            </div>
                        )}

                        <Link
                            href={safeRoute(
                                "language.switch",
                                "#",
                                locale === "bn" ? "en" : "bn",
                            )}
                            className="rounded-xl border border-slate-200 px-2.5 py-2 text-xs font-black md:hidden"
                        >
                            {locale === "bn" ? "EN" : "বাং"}
                        </Link>
                    </div>
                </div>

                <div className="mx-4 mb-3 lg:hidden">
                    <SmartSearch
                        categories={menuCategories}
                        compact
                        mobileFullscreen
                        placeholder={t("searchMobile")}
                    />
                </div>

                <nav className={`${mobileOpen ? "block" : "hidden"} border-t border-slate-100 lg:block`}>
                    <div className="mx-auto flex max-w-[1480px] flex-col px-4 lg:flex-row lg:items-center lg:gap-7">
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setCategoryOpen((open) => !open)}
                                className="flex w-full items-center justify-between gap-8 rounded-xl bg-[#0f766e] px-5 py-3 font-bold text-white lg:w-60 lg:rounded-b-none"
                            >
                                <span className="flex items-center gap-2">
                                    <Menu size={18} />
                                    {t("browseCategories")}
                                </span>
                                <ChevronDown
                                    size={17}
                                    className={`transition ${categoryOpen ? "rotate-180" : ""}`}
                                />
                            </button>

                            {categoryOpen && (
                                <div className="left-0 top-full z-50 w-full overflow-hidden rounded-b-2xl border border-slate-200 bg-white shadow-2xl lg:absolute lg:w-[760px]">
                                    <div className="grid gap-1 p-3 sm:grid-cols-3">
                                        {categoryColumns.map((column, columnIndex) => (
                                            <div key={columnIndex}>
                                                {column.map((category) => (
                                                    <Link
                                                        key={category.id}
                                                        href={`${safeRoute("storefront.catalog", "/catalog")}?category=${category.slug}`}
                                                        className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition hover:bg-teal-50 hover:text-[#0f766e]"
                                                        onClick={() => {
                                                            setMobileOpen(false);
                                                            setCategoryOpen(false);
                                                        }}
                                                    >
                                                        <span className="truncate">{category.name}</span>
                                                        <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">
                                                            {category.products_count ?? 0}
                                                        </span>
                                                    </Link>
                                                ))}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-5 py-3">
                                        <span className="text-xs font-semibold text-slate-500">
                                            Browse books, e-books, stationery and more.
                                        </span>
                                        <Link
                                            href={safeRoute("storefront.catalog", "/catalog")}
                                            className="text-sm font-black text-[#0f766e]"
                                            onClick={() => setCategoryOpen(false)}
                                        >
                                            View all categories →
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-6">
                            <Link
                                href={safeRoute("home", "/")}
                                className="border-b border-slate-100 py-3 text-sm font-bold transition hover:text-[#0f766e] lg:border-0"
                                onClick={() => setMobileOpen(false)}
                            >
                                {t("home")}
                            </Link>

                            {primaryNavigation.map((item) => (
                                <Link
                                    key={item.key}
                                    href={`${safeRoute("storefront.catalog", "/catalog")}${item.query}`}
                                    className={`border-b border-slate-100 py-3 text-sm font-bold transition hover:text-[#0f766e] lg:border-0 ${item.key === "offers" ? "text-[#e11d48]" : ""}`}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {t(item.key)}
                                </Link>
                            ))}

                            <Link
                                href="/contact"
                                className="py-3 text-sm font-bold transition hover:text-[#0f766e]"
                                onClick={() => setMobileOpen(false)}
                            >
                                {t("contact")}
                            </Link>
                        </div>

                        <div className="my-2 flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2 text-xs font-bold text-amber-800 lg:ml-auto">
                            <ShoppingBag size={16} />
                            {t("codAvailable")}
                        </div>

                        <div className="border-t border-slate-100 py-4 md:hidden">
                            {user ? (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 rounded-2xl bg-slate-900 p-4 text-white">
                                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/15 text-base font-black">
                                            {userInitial}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="truncate font-black">{userName}</p>
                                            <p className="truncate text-xs text-slate-300">{user.email}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        {accountLinks.slice(0, 4).map((item) => {
                                            const Icon = item.icon;
                                            return (
                                                <Link
                                                    key={item.label}
                                                    href={safeRoute(item.routeName, item.fallback)}
                                                    onClick={() => setMobileOpen(false)}
                                                    className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-3 text-sm font-bold text-slate-700"
                                                >
                                                    <Icon size={17} />
                                                    {item.label}
                                                </Link>
                                            );
                                        })}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={logout}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm font-black text-rose-600"
                                    >
                                        <LogOut size={18} />
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-2">
                                    <Link
                                        href={safeRoute("customer.login", "/customer/login")}
                                        onClick={() => setMobileOpen(false)}
                                        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700"
                                    >
                                        <LogIn size={18} />
                                        Login
                                    </Link>

                                    {routeExists("register") && (
                                        <Link
                                            href={safeRoute("customer.register", "/customer/register")}
                                            onClick={() => setMobileOpen(false)}
                                            className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white"
                                        >
                                            <UserPlus size={18} />
                                            Register
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </nav>
            </header>

            <main>{children}</main>

            <footer className="mt-16 bg-[#092b2a] text-slate-300">
                <div className="mx-auto grid max-w-[1480px] gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-5">
                    <div className="sm:col-span-2">
                        <div className="flex items-center gap-3">
                            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0f766e] text-white">
                                <BookOpen />
                            </span>
                            <h3 className="text-2xl font-black text-white">
                                {brand}
                            </h3>
                        </div>

                        <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">
                            {businessSettings.footer_description ||
                                businessSettings.company_tagline ||
                                t("taglineModern")}
                        </p>

                        <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold">
                            {["COD", "bKash", "Nagad", "Secure Checkout"].map((item) => (
                                <span key={item} className="rounded-full bg-white/10 px-3 py-1.5">
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-black text-white">{t("shopBy")}</h4>
                        <Link
                            href={`${safeRoute("storefront.catalog", "/catalog")}?product_type=physical`}
                            className="mt-4 block text-sm transition hover:text-amber-300"
                        >
                            {t("books")}
                        </Link>
                        <Link
                            href={`${safeRoute("storefront.catalog", "/catalog")}?product_type=ebook`}
                            className="mt-3 block text-sm transition hover:text-amber-300"
                        >
                            {t("ebooks")}
                        </Link>
                        <Link
                            href={`${safeRoute("storefront.catalog", "/catalog")}?category=stationery`}
                            className="mt-3 block text-sm transition hover:text-amber-300"
                        >
                            {t("stationery")}
                        </Link>
                        <Link
                            href={`${safeRoute("storefront.catalog", "/catalog")}?sort=discount`}
                            className="mt-3 block text-sm transition hover:text-amber-300"
                        >
                            {t("offers")}
                        </Link>
                    </div>

                    <div>
                        <h4 className="font-black text-white">{t("customerCare")}</h4>
                        <Link
                            href={safeRoute("orders.track", "/track-order")}
                            className="mt-4 block text-sm transition hover:text-amber-300"
                        >
                            {t("trackOrder")}
                        </Link>
                        <Link
                            href="/help"
                            className="mt-3 block text-sm transition hover:text-amber-300"
                        >
                            {t("helpCenter")}
                        </Link>
                        <span className="mt-3 block text-sm">{t("returnPolicy")}</span>
                        <span className="mt-3 block text-sm">{t("privacyPolicy")}</span>
                    </div>

                    <div>
                        <h4 className="font-black text-white">{t("contactUs")}</h4>
                        {businessSettings.support_email && (
                            <p className="mt-4 text-sm">
                                {businessSettings.support_email}
                            </p>
                        )}
                        <p className="mt-3 text-sm">{t("delivery")}</p>
                        <p className="mt-3 text-sm">{t("supportHours")}</p>
                    </div>
                </div>

                <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-slate-400">
                    © {new Date().getFullYear()} {brand}. {t("rightsReserved")}
                </div>
            </footer>

            <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-slate-200 bg-white px-1 py-1.5 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] lg:hidden">
                <Link
                    href={safeRoute("home", "/")}
                    className="flex flex-col items-center gap-1 py-1 text-[10px] font-bold text-[#0f766e]"
                >
                    <Home size={20} />
                    {t("home")}
                </Link>
                <button
                    type="button"
                    onClick={() => {
                        setMobileOpen(true);
                        setCategoryOpen(true);
                    }}
                    className="flex flex-col items-center gap-1 py-1 text-[10px] font-bold text-slate-600"
                >
                    <Menu size={20} />
                    {t("categoriesShort")}
                </button>
                <Link
                    href={safeRoute("storefront.catalog", "/catalog")}
                    className="flex flex-col items-center gap-1 py-1 text-[10px] font-bold text-slate-600"
                >
                    <Search size={20} />
                    {t("searchButton")}
                </Link>
                <Link
                    href={
                        user
                            ? safeRoute(
                                  "customer.wishlist.index",
                                  "/account/wishlist",
                              )
                            : safeRoute("wishlist.index", "/wishlist")
                    }
                    className="relative flex flex-col items-center gap-1 py-1 text-[10px] font-bold text-slate-600"
                >
                    <Heart size={20} />
                    {t("wishlistShort")}
                    {wishlist.count > 0 && (
                        <span className="absolute right-3 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] text-white">
                            {wishlist.count > 99 ? "99+" : wishlist.count}
                        </span>
                    )}
                </Link>
                <Link
                    href={safeRoute("cart.index", "/cart")}
                    className="relative flex flex-col items-center gap-1 py-1 text-[10px] font-bold text-slate-600"
                >
                    <ShoppingCart size={20} />
                    {t("cart")}
                    {cartCount > 0 && (
                        <span className="absolute right-3 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-[#f59e0b] px-1 text-[9px] text-white">
                            {cartCount}
                        </span>
                    )}
                </Link>
            </nav>
        </div>
    );
}

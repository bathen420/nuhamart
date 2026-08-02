import { Link, usePage } from "@inertiajs/react";
import {
    BookOpen,
    ChevronDown,
    CircleHelp,
    Globe2,
    Heart,
    Home,
    Menu,
    Search,
    ShoppingBag,
    ShoppingCart,
    Sparkles,
    User,
    X,
} from "lucide-react";
import { useMemo, useState } from "react";
import SmartSearch from "@/Components/Storefront/SmartSearch";
import useCart from "@/hooks/useCart";
import { useI18n } from "@/i18n";

const primaryNavigation = [
    { key: "books", query: "?product_type=physical" },
    { key: "ebooks", query: "?product_type=ebook" },
    { key: "stationery", query: "?category=stationery" },
    { key: "newArrivals", query: "?sort=newest" },
    { key: "bestSellers", query: "?sort=popular" },
    { key: "offers", query: "?sort=discount" },
];

export default function StorefrontLayout({ children, categories = [] }) {
    const { auth = {}, storefrontCategories = [], businessSettings = {} } = usePage().props;
    const { locale, t } = useI18n();
    const { cartItems = [] } = useCart();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(false);

    const cartCount = useMemo(
        () => cartItems.reduce((total, item) => total + (Number(item.quantity) || 1), 0),
        [cartItems],
    );

    const menuCategories = categories.length ? categories : storefrontCategories;
    const brand = businessSettings.company_name || "Nuha Mart BD";
    const categoryColumns = [0, 1, 2].map((column) => menuCategories.filter((_, index) => index % 3 === column).slice(0, 6));

    return (
        <div className="min-h-screen bg-[#f6f8f7] pb-16 text-slate-900 lg:pb-0">
            <div className="bg-[#0f766e] text-white">
                <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-4 px-4 py-2 text-xs sm:text-sm">
                    <p className="flex min-w-0 items-center gap-2 font-semibold">
                        <Sparkles size={15} className="shrink-0 text-amber-300" />
                        <span className="truncate">{t("announcement")}</span>
                    </p>
                    <div className="hidden items-center gap-5 md:flex">
                        <Link href={route("orders.track")} className="transition hover:text-amber-200">{t("trackOrder")}</Link>
                        <Link href="/help" className="flex items-center gap-1 transition hover:text-amber-200"><CircleHelp size={15} /> {t("helpCenter")}</Link>
                        <Link href={route("language.switch", locale === "bn" ? "en" : "bn")} className="flex items-center gap-1 rounded-full border border-white/25 bg-white/10 px-3 py-1 font-bold backdrop-blur">
                            <Globe2 size={14} /> {locale === "bn" ? "English" : "বাংলা"}
                        </Link>
                    </div>
                </div>
            </div>

            <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-[0_8px_30px_rgba(15,118,110,0.06)] backdrop-blur-xl">
                <div className="mx-auto flex max-w-[1480px] items-center gap-3 px-4 py-3 lg:gap-7 lg:py-4">
                    <button type="button" onClick={() => setMobileOpen((open) => !open)} className="rounded-xl border border-slate-200 p-2.5 text-slate-700 lg:hidden" aria-label="Toggle menu">
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>

                    <Link href={route("home")} className="flex min-w-fit items-center gap-2.5">
                        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#0f766e] to-[#115e59] text-white shadow-lg shadow-teal-900/15 sm:h-12 sm:w-12"><BookOpen size={25} /></span>
                        <span className="hidden leading-none sm:block">
                            <span className="block text-xl font-black tracking-tight text-slate-900 lg:text-2xl">Nuha Mart <span className="text-[#f59e0b]">BD</span></span>
                            <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f766e]">Books • E-books • Lifestyle</span>
                        </span>
                    </Link>

                    <div className="hidden min-w-0 flex-1 lg:block">
                        <SmartSearch categories={menuCategories} placeholder={t("searchSmart")} />
                        <div className="mt-1.5 px-2 text-[11px] text-slate-400">{t("searchHint")}</div>
                    </div>

                    <div className="ml-auto flex items-center gap-1.5 sm:gap-3">
                        <Link href="/wishlist" className="hidden rounded-xl p-2.5 text-slate-700 transition hover:bg-teal-50 hover:text-[#0f766e] sm:block" aria-label={t("wishlist")}><Heart size={23} /></Link>
                        <Link href={route("cart.index")} className="relative rounded-xl p-2.5 text-slate-700 transition hover:bg-teal-50 hover:text-[#0f766e]" aria-label={t("cart")}>
                            <ShoppingCart size={24} />
                            {cartCount > 0 && <span className="absolute right-0 top-0 grid h-5 min-w-5 place-items-center rounded-full bg-[#f59e0b] px-1 text-[10px] font-black text-white">{cartCount > 99 ? "99+" : cartCount}</span>}
                        </Link>
                        {auth.user ? (
                            <Link href={route("customer.dashboard")} className="hidden items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0f766e] md:flex"><User size={18} /> {t("dashboard")}</Link>
                        ) : (
                            <Link href={route("login")} className="hidden items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-[#0f766e] hover:text-[#0f766e] md:flex"><User size={18} /> {t("loginShort")}</Link>
                        )}
                        <Link href={route("language.switch", locale === "bn" ? "en" : "bn")} className="rounded-xl border border-slate-200 px-2.5 py-2 text-xs font-black md:hidden">{locale === "bn" ? "EN" : "বাং"}</Link>
                    </div>
                </div>

                <div className="mx-4 mb-3 lg:hidden"><SmartSearch categories={menuCategories} compact mobileFullscreen placeholder={t("searchMobile")} /></div>

                <nav className={`${mobileOpen ? "block" : "hidden"} border-t border-slate-100 lg:block`}>
                    <div className="mx-auto flex max-w-[1480px] flex-col px-4 lg:flex-row lg:items-center lg:gap-7">
                        <div className="relative">
                            <button type="button" onClick={() => setCategoryOpen((open) => !open)} className="flex w-full items-center justify-between gap-8 rounded-xl bg-[#0f766e] px-5 py-3 font-bold text-white lg:w-60 lg:rounded-b-none">
                                <span className="flex items-center gap-2"><Menu size={18} /> {t("browseCategories")}</span>
                                <ChevronDown size={17} className={`transition ${categoryOpen ? "rotate-180" : ""}`} />
                            </button>
                            {categoryOpen && (
                                <div className="left-0 top-full z-50 w-full overflow-hidden rounded-b-2xl border border-slate-200 bg-white shadow-2xl lg:absolute lg:w-[760px]">
                                    <div className="grid gap-1 p-3 sm:grid-cols-3">
                                        {categoryColumns.map((column, columnIndex) => (
                                            <div key={columnIndex}>
                                                {column.map((category) => (
                                                    <Link key={category.id} href={`${route("storefront.catalog")}?category=${category.slug}`} className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition hover:bg-teal-50 hover:text-[#0f766e]" onClick={() => { setMobileOpen(false); setCategoryOpen(false); }}>
                                                        <span className="truncate">{category.name}</span>
                                                        <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">{category.products_count ?? 0}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-5 py-3">
                                        <span className="text-xs font-semibold text-slate-500">Browse books, e-books, stationery and more.</span>
                                        <Link href={route("storefront.catalog")} className="text-sm font-black text-[#0f766e]" onClick={() => setCategoryOpen(false)}>View all categories →</Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-6">
                            <Link href={route("home")} className="border-b border-slate-100 py-3 text-sm font-bold transition hover:text-[#0f766e] lg:border-0">{t("home")}</Link>
                            {primaryNavigation.map((item) => (
                                <Link key={item.key} href={`${route("storefront.catalog")}${item.query}`} className={`border-b border-slate-100 py-3 text-sm font-bold transition hover:text-[#0f766e] lg:border-0 ${item.key === "offers" ? "text-[#e11d48]" : ""}`}>{t(item.key)}</Link>
                            ))}
                            <Link href="/contact" className="py-3 text-sm font-bold transition hover:text-[#0f766e]">{t("contact")}</Link>
                        </div>
                        <div className="my-2 flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2 text-xs font-bold text-amber-800 lg:ml-auto"><ShoppingBag size={16} /> {t("codAvailable")}</div>
                    </div>
                </nav>
            </header>

            <main>{children}</main>

            <footer className="mt-16 bg-[#092b2a] text-slate-300">
                <div className="mx-auto grid max-w-[1480px] gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-5">
                    <div className="sm:col-span-2">
                        <div className="flex items-center gap-3">
                            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0f766e] text-white"><BookOpen /></span>
                            <h3 className="text-2xl font-black text-white">Nuha Mart <span className="text-[#f59e0b]">BD</span></h3>
                        </div>
                        <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">{t("taglineModern")}</p>
                        <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold">
                            {['COD', 'bKash', 'Nagad', 'Secure Checkout'].map((item) => <span key={item} className="rounded-full bg-white/10 px-3 py-1.5">{item}</span>)}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-black text-white">{t("shopBy")}</h4>
                        <Link href={`${route("storefront.catalog")}?product_type=physical`} className="mt-4 block text-sm transition hover:text-amber-300">{t("books")}</Link>
                        <Link href={`${route("storefront.catalog")}?product_type=ebook`} className="mt-3 block text-sm transition hover:text-amber-300">{t("ebooks")}</Link>
                        <Link href={`${route("storefront.catalog")}?category=stationery`} className="mt-3 block text-sm transition hover:text-amber-300">{t("stationery")}</Link>
                        <Link href={`${route("storefront.catalog")}?sort=discount`} className="mt-3 block text-sm transition hover:text-amber-300">{t("offers")}</Link>
                    </div>
                    <div>
                        <h4 className="font-black text-white">{t("customerCare")}</h4>
                        <Link href={route("orders.track")} className="mt-4 block text-sm transition hover:text-amber-300">{t("trackOrder")}</Link>
                        <Link href="/help" className="mt-3 block text-sm transition hover:text-amber-300">{t("helpCenter")}</Link>
                        <span className="mt-3 block text-sm">{t("returnPolicy")}</span>
                        <span className="mt-3 block text-sm">{t("privacyPolicy")}</span>
                    </div>
                    <div>
                        <h4 className="font-black text-white">{t("contactUs")}</h4>
                        <p className="mt-4 text-sm">support@nuhamartbd.com</p>
                        <p className="mt-3 text-sm">{t("delivery")}</p>
                        <p className="mt-3 text-sm">{t("supportHours")}</p>
                    </div>
                </div>
                <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-slate-400">© {new Date().getFullYear()} {brand}. {t("rightsReserved")}</div>
            </footer>

            <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-slate-200 bg-white px-1 py-1.5 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] lg:hidden">
                <Link href={route("home")} className="flex flex-col items-center gap-1 py-1 text-[10px] font-bold text-[#0f766e]"><Home size={20} /> {t("home")}</Link>
                <button type="button" onClick={() => { setMobileOpen(true); setCategoryOpen(true); }} className="flex flex-col items-center gap-1 py-1 text-[10px] font-bold text-slate-600"><Menu size={20} /> {t("categoriesShort")}</button>
                <Link href={route("storefront.catalog")} className="flex flex-col items-center gap-1 py-1 text-[10px] font-bold text-slate-600"><Search size={20} /> {t("searchButton")}</Link>
                <Link href="/wishlist" className="flex flex-col items-center gap-1 py-1 text-[10px] font-bold text-slate-600"><Heart size={20} /> {t("wishlistShort")}</Link>
                <Link href={route("cart.index")} className="relative flex flex-col items-center gap-1 py-1 text-[10px] font-bold text-slate-600"><ShoppingCart size={20} /> {t("cart")}{cartCount > 0 && <span className="absolute right-3 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-[#f59e0b] px-1 text-[9px] text-white">{cartCount}</span>}</Link>
            </nav>
        </div>
    );
}

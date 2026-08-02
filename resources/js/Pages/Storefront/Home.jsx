import { Head, Link } from "@inertiajs/react";
import {
    ArrowRight,
    BadgeCheck,
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Headphones,
    PackageCheck,
    ShieldCheck,
    Sparkles,
    Truck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import StorefrontLayout from "@/Layouts/StorefrontLayout";
import ProductGrid from "@/Components/Storefront/ProductGrid";
import QuickViewModal from "@/Components/Storefront/QuickViewModal";
import { useI18n } from "@/i18n";

const categoryIcons = ["📚", "📖", "✏️", "🎒", "🎧", "🧸", "🖥️", "🎁", "🏆", "🔥", "🆕", "⭐"];
const promotionThemes = {
    mint: "from-emerald-50 via-teal-50 to-cyan-100",
    purple: "from-violet-50 via-purple-50 to-fuchsia-100",
    orange: "from-orange-50 via-amber-50 to-yellow-100",
    blue: "from-sky-50 via-blue-50 to-indigo-100",
};

function Countdown({ target }) {
    const [remaining, setRemaining] = useState({ days: 2, hours: 15, minutes: 45, seconds: 30 });

    useEffect(() => {
        const end = target || Date.now() + 236730000;
        const update = () => {
            const difference = Math.max(0, end - Date.now());
            setRemaining({
                days: Math.floor(difference / 86400000),
                hours: Math.floor(difference / 3600000) % 24,
                minutes: Math.floor(difference / 60000) % 60,
                seconds: Math.floor(difference / 1000) % 60,
            });
        };
        update();
        const timer = setInterval(update, 1000);
        return () => clearInterval(timer);
    }, [target]);

    return (
        <div className="flex items-center gap-1.5">
            {Object.entries(remaining).map(([label, value]) => (
                <div key={label} className="min-w-11 rounded-xl bg-slate-900 px-2 py-1.5 text-center text-white shadow-sm">
                    <div className="text-sm font-black">{String(value).padStart(2, "0")}</div>
                    <div className="text-[8px] uppercase tracking-wider text-slate-400">{label.slice(0, 3)}</div>
                </div>
            ))}
        </div>
    );
}

function SectionHeader({ eyebrow, title, subtitle, href, flash = false }) {
    const { t } = useI18n();
    return (
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4 sm:mb-7">
            <div>
                {eyebrow && <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#0f766e]">{eyebrow}</p>}
                <div className="flex flex-wrap items-center gap-4">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 sm:text-2xl lg:text-3xl">{title}</h2>
                        {subtitle && <p className="mt-1 text-xs leading-6 text-slate-500 sm:text-sm">{subtitle}</p>}
                    </div>
                    {flash && <Countdown />}
                </div>
            </div>
            <Link href={href || route("storefront.catalog")} className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-[#0f766e] hover:text-[#0f766e]">
                {t("viewAll")} <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </Link>
        </div>
    );
}

function ProductSection({ eyebrow, title, subtitle, items = [], href, flash = false, onQuickView }) {
    if (!items.length) return null;
    return (
        <section className="mx-auto max-w-[1480px] px-4 py-5 sm:py-8">
            <div className="rounded-[28px] border border-slate-200/80 bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.05)] sm:p-7">
                <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} href={href} flash={flash} />
                <ProductGrid products={items} showProgress={flash} onQuickView={onQuickView} />
            </div>
        </section>
    );
}

export default function Home({
    heroBanners = [],
    promotions = [],
    featured = [],
    newArrivals = [],
    bestSellers = [],
    ebooks = [],
    flashSale = [],
    categories = [],
    authors = [],
    publishers = [],
}) {
    const { t } = useI18n();
    const [slide, setSlide] = useState(0);
    const [quickView, setQuickView] = useState(null);

    const banners = heroBanners.length
        ? heroBanners
        : [{
            badge: t("heroBadge"),
            title: t("heroTitle"),
            highlight: t("heroHighlight"),
            subtitle: t("heroSubtitle"),
            primary_button_text: t("shopNow"),
            primary_button_url: "/shop",
            secondary_button_text: t("exploreCategories"),
            secondary_button_url: "/shop",
            background_from: "#ecfdf5",
            background_to: "#fef3c7",
            text_color: "#0f172a",
        }];

    useEffect(() => {
        if (banners.length < 2) return undefined;
        const timer = setInterval(() => setSlide((current) => (current + 1) % banners.length), 6500);
        return () => clearInterval(timer);
    }, [banners.length]);

    const activeBanner = banners[slide] || banners[0];
    const topCategories = useMemo(() => categories.slice(0, 12), [categories]);

    return (
        <StorefrontLayout categories={categories}>
            <Head title="Nuha Mart BD — Modern Books & Lifestyle Store" />

            <section className="mx-auto max-w-[1480px] px-4 pt-5 lg:pt-7">
                <div className="grid gap-4 lg:grid-cols-[1fr_330px]">
                    <div
                        className="relative min-h-[390px] overflow-hidden rounded-[30px] border border-white/70 shadow-[0_24px_70px_rgba(15,118,110,0.12)] sm:min-h-[450px]"
                        style={{
                            background: `linear-gradient(125deg, ${activeBanner.background_from || "#ecfdf5"}, ${activeBanner.background_to || "#fef3c7"})`,
                            color: activeBanner.text_color || "#0f172a",
                        }}
                    >
                        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/30 blur-2xl" />
                        <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-[#0f766e]/10 blur-2xl" />
                        <div className="relative z-10 grid min-h-[390px] items-center gap-8 px-7 py-10 sm:min-h-[450px] sm:px-12 lg:grid-cols-[1.1fr_.9fr] lg:px-16">
                            <div>
                                {activeBanner.badge && (
                                    <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#0f766e] shadow-sm backdrop-blur">
                                        <Sparkles size={15} className="text-[#f59e0b]" /> {activeBanner.badge}
                                    </span>
                                )}
                                <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                                    {activeBanner.title}<br />
                                    <span className="bg-gradient-to-r from-[#0f766e] to-[#f59e0b] bg-clip-text text-transparent">{activeBanner.highlight}</span>
                                </h1>
                                <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base lg:text-lg">{activeBanner.subtitle}</p>
                                <div className="mt-7 flex flex-wrap gap-3">
                                    {activeBanner.primary_button_text && (
                                        <Link href={activeBanner.primary_button_url || "/shop"} className="inline-flex items-center gap-2 rounded-xl bg-[#0f766e] px-6 py-3.5 font-black text-white shadow-lg shadow-teal-900/15 transition hover:-translate-y-0.5 hover:bg-[#115e59]">
                                            {activeBanner.primary_button_text} <ArrowRight size={18} />
                                        </Link>
                                    )}
                                    {activeBanner.secondary_button_text && (
                                        <Link href={activeBanner.secondary_button_url || "/shop"} className="rounded-xl border border-slate-900/10 bg-white/70 px-6 py-3.5 font-black text-slate-800 backdrop-blur transition hover:bg-white">
                                            {activeBanner.secondary_button_text}
                                        </Link>
                                    )}
                                </div>
                                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-bold text-slate-600">
                                    <span className="flex items-center gap-2"><Truck size={18} className="text-[#0f766e]" /> {t("fastDelivery")}</span>
                                    <span className="flex items-center gap-2"><BadgeCheck size={18} className="text-[#0f766e]" /> {t("originalProducts")}</span>
                                    <span className="flex items-center gap-2"><ShieldCheck size={18} className="text-[#0f766e]" /> {t("securePayment")}</span>
                                </div>
                            </div>
                            <div className="relative hidden h-full items-center justify-center lg:flex">
                                {activeBanner.image ? (
                                    <img src={`/storage/${activeBanner.image}`} alt={activeBanner.title} fetchPriority="high" className="max-h-[380px] w-full object-contain" />
                                ) : (
                                    <div className="relative h-80 w-full max-w-lg">
                                        <div className="absolute left-8 top-20 h-48 w-36 -rotate-12 rounded-2xl bg-gradient-to-br from-amber-200 to-[#f59e0b] shadow-2xl" />
                                        <div className="absolute left-32 top-8 h-60 w-44 -rotate-2 rounded-2xl bg-gradient-to-br from-white to-teal-100 shadow-2xl"><BookOpen className="mx-auto mt-20 h-20 w-20 text-[#0f766e]" /></div>
                                        <div className="absolute right-4 top-24 h-44 w-44 rounded-full bg-[#0f766e] shadow-2xl"><Headphones className="mx-auto mt-12 h-24 w-24 text-amber-300" /></div>
                                        <div className="absolute bottom-2 right-20 rounded-2xl bg-white px-5 py-4 text-center text-sm font-black shadow-xl">{t("saveUpTo")}<br /><span className="text-3xl text-[#f59e0b]">50%</span></div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {banners.length > 1 && (
                            <>
                                <button onClick={() => setSlide((slide - 1 + banners.length) % banners.length)} className="absolute left-3 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-slate-800 shadow-lg backdrop-blur transition hover:bg-white" aria-label="Previous banner"><ChevronLeft /></button>
                                <button onClick={() => setSlide((slide + 1) % banners.length)} className="absolute right-3 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-slate-800 shadow-lg backdrop-blur transition hover:bg-white" aria-label="Next banner"><ChevronRight /></button>
                                <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                                    {banners.map((banner, index) => (
                                        <button key={banner.id || index} onClick={() => setSlide(index)} className={`h-2 rounded-full transition-all ${index === slide ? "w-8 bg-[#0f766e]" : "w-2 bg-white/80"}`} aria-label={`Banner ${index + 1}`} />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                        {(promotions.length ? promotions.slice(0, 2) : [
                            { title: t("ebookPromoTitle"), subtitle: t("ebookPromoSubtitle"), button_text: t("exploreEbooks"), button_url: `${route("storefront.catalog")}?product_type=ebook`, theme: "mint" },
                            { title: t("stationeryPromoTitle"), subtitle: t("stationeryPromoSubtitle"), button_text: t("shopStationery"), button_url: `${route("storefront.catalog")}?category=stationery`, theme: "orange" },
                        ]).map((promotion, index) => (
                            <div key={promotion.id || index} className={`relative min-h-[210px] overflow-hidden rounded-[28px] bg-gradient-to-br ${promotionThemes[promotion.theme] || promotionThemes.mint} p-7 shadow-sm`}>
                                <div className="relative z-10 max-w-[230px]">
                                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0f766e]">{index === 0 ? t("digitalCollection") : t("everydayEssentials")}</p>
                                    <h3 className="mt-3 text-2xl font-black leading-tight text-slate-900">{promotion.title}</h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">{promotion.subtitle}</p>
                                    {promotion.button_text && (
                                        <Link href={promotion.button_url || "/shop"} className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#0f766e] transition hover:gap-3">
                                            {promotion.button_text} <ArrowRight size={16} />
                                        </Link>
                                    )}
                                </div>
                                {promotion.image ? <img src={`/storage/${promotion.image}`} loading="lazy" alt="" className="absolute bottom-0 right-0 h-full w-2/5 object-contain" /> : <div className="absolute -bottom-12 -right-8 h-52 w-52 rounded-full bg-white/50" />}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-[1480px] px-4 py-7">
                <div className="rounded-[28px] border border-slate-200/80 bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.04)] sm:p-6">
                    <SectionHeader eyebrow={t("browseExplore")} title={t("popularCategoriesTitle")} subtitle={t("popularCategoriesSubtitle")} />
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12">
                        {topCategories.map((category, index) => (
                            <Link key={category.id} href={`${route("storefront.catalog")}?category=${category.slug}`} className="group rounded-2xl border border-transparent p-2 text-center transition hover:-translate-y-1 hover:border-teal-100 hover:bg-teal-50">
                                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-50 text-3xl shadow-inner transition group-hover:bg-white group-hover:shadow-md sm:h-16 sm:w-16">{categoryIcons[index % categoryIcons.length]}</div>
                                <div className="mt-2 line-clamp-1 text-xs font-bold text-slate-700 group-hover:text-[#0f766e]">{category.name}</div>
                                <div className="mt-1 text-[10px] text-slate-400">{category.products_count || 0} {t("items")}</div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <ProductSection eyebrow={t("limitedTime")} title={t("flashSale")} subtitle={t("flashSaleSubtitle")} items={flashSale} href={`${route("storefront.catalog")}?sort=discount`} flash onQuickView={setQuickView} />
            <ProductSection eyebrow={t("curatedForYou")} title={t("featured")} subtitle={t("featuredSub")} items={featured} onQuickView={setQuickView} />
            <ProductSection eyebrow={t("readerFavourites")} title={t("bestSellers")} subtitle={t("bestSub")} items={bestSellers} onQuickView={setQuickView} />
            <ProductSection eyebrow={t("freshOnShelves")} title={t("newArrivals")} subtitle={t("newSub")} items={newArrivals} href={`${route("storefront.catalog")}?sort=newest`} onQuickView={setQuickView} />
            <ProductSection eyebrow={t("readAnywhere")} title={t("ebookLibrary")} subtitle={t("ebookSub")} items={ebooks} href={`${route("storefront.catalog")}?product_type=ebook`} onQuickView={setQuickView} />

            <section className="mx-auto grid max-w-[1480px] gap-6 px-4 py-8 lg:grid-cols-2">
                <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-7">
                    <SectionHeader eyebrow={t("meetTheCreators")} title={t("popularAuthors")} href={route("storefront.catalog")} />
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {authors.slice(0, 9).map((author, index) => (
                            <Link key={author.id} href={route("storefront.author", author.slug)} className="group flex items-center gap-3 rounded-2xl border border-slate-100 p-3 transition hover:border-teal-200 hover:bg-teal-50">
                                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-teal-100 to-amber-100 text-sm font-black text-[#0f766e]">{author.name?.slice(0, 1)}</span>
                                <span className="min-w-0"><span className="block truncate text-sm font-bold text-slate-800 group-hover:text-[#0f766e]">{author.name}</span><span className="mt-0.5 block text-[10px] text-slate-400">{author.products_count} {t("booksCount")}</span></span>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-7">
                    <SectionHeader eyebrow={t("trustedPublishers")} title={t("popularPublishers")} href={route("storefront.catalog")} />
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {publishers.slice(0, 9).map((publisher) => (
                            <Link key={publisher.id} href={route("storefront.publisher", publisher.slug)} className="group rounded-2xl border border-slate-100 p-4 text-center transition hover:border-amber-200 hover:bg-amber-50">
                                <div className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-sm font-black text-slate-600 group-hover:bg-white">{publisher.name?.slice(0, 1)}</div>
                                <div className="mt-2 truncate text-sm font-bold text-slate-800 group-hover:text-[#0f766e]">{publisher.name}</div>
                                <div className="mt-1 text-[10px] text-slate-400">{publisher.products_count || 0} {t("productsCount")}</div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-[1480px] px-4 py-6">
                <div className="grid gap-4 rounded-[28px] bg-gradient-to-r from-[#0f766e] to-[#115e59] p-6 text-white shadow-xl shadow-teal-900/10 sm:grid-cols-2 lg:grid-cols-4 lg:p-8">
                    {[
                        [Truck, t("fastDelivery"), t("deliveryNationwide")],
                        [ShieldCheck, t("securePayment"), t("safeCheckout")],
                        [PackageCheck, t("originalProducts"), t("qualityGuaranteed")],
                        [BadgeCheck, t("friendlySupport"), t("supportEveryday")],
                    ].map(([Icon, title, subtitle]) => (
                        <div key={title} className="flex items-start gap-3 rounded-2xl bg-white/8 p-3">
                            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/15 text-amber-300"><Icon size={23} /></span>
                            <div><b className="block">{title}</b><p className="mt-1 text-xs leading-5 text-teal-50/80">{subtitle}</p></div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-[1480px] px-4 py-7">
                <div className="overflow-hidden rounded-[30px] bg-slate-900 px-6 py-10 text-white sm:px-10 lg:flex lg:items-center lg:justify-between lg:px-14">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">{t("newsletterEyebrow")}</p>
                        <h2 className="mt-3 text-2xl font-black sm:text-3xl">{t("newsletterTitle")}</h2>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">{t("newsletterSubtitle")}</p>
                    </div>
                    <form className="mt-6 flex max-w-xl flex-1 overflow-hidden rounded-2xl bg-white p-1.5 lg:ml-10 lg:mt-0">
                        <input type="email" className="min-w-0 flex-1 border-0 px-4 text-sm text-slate-900 focus:ring-0" placeholder={t("emailPlaceholder")} />
                        <button type="button" className="rounded-xl bg-[#f59e0b] px-5 py-3 text-sm font-black text-white transition hover:bg-amber-600">{t("subscribe")}</button>
                    </form>
                </div>
            </section>

            <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
        </StorefrontLayout>
    );
}

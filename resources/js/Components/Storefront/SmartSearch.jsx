import { router } from "@inertiajs/react";
import {
    ArrowDown,
    BookOpen,
    Building2,
    Clock3,
    History,
    LoaderCircle,
    Search,
    Tags,
    TrendingUp,
    UserRound,
    X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/i18n";

const typeMeta = {
    product: { labelKey: "products", icon: BookOpen },
    author: { labelKey: "authors", icon: UserRound },
    publisher: { labelKey: "publishers", icon: Building2 },
    category: { labelKey: "categoriesShort", icon: Tags },
};

const recentSearchKey = "nuha-mart-recent-searches";
const popularSearches = ["Humayun Ahmed", "Programming", "Islamic Books", "Class 8 Math", "Stationery"];

function readRecentSearches() {
    try {
        return JSON.parse(window.localStorage.getItem(recentSearchKey) || "[]").filter(Boolean).slice(0, 6);
    } catch {
        return [];
    }
}

export default function SmartSearch({
    categories = [],
    compact = false,
    mobileFullscreen = false,
    placeholder = "Search books, authors, publishers or ISBN...",
}) {
    const { t } = useI18n();
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("");
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [recentSearches, setRecentSearches] = useState([]);
    const wrapperRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        setRecentSearches(readRecentSearches());
    }, []);

    useEffect(() => {
        const close = (event) => {
            if (!wrapperRef.current?.contains(event.target)) {
                setOpen(false);
                setActiveIndex(-1);
            }
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);

    useEffect(() => {
        if (!open || !mobileFullscreen) return undefined;
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previous;
        };
    }, [open, mobileFullscreen]);

    useEffect(() => {
        const term = query.trim();
        setActiveIndex(-1);

        if (term.length < 2) {
            setResults(null);
            setLoading(false);
            return undefined;
        }

        const controller = new AbortController();
        const timer = window.setTimeout(async () => {
            setLoading(true);
            try {
                const response = await fetch(`${route("storefront.search.suggestions")}?q=${encodeURIComponent(term)}`, {
                    headers: { Accept: "application/json" },
                    signal: controller.signal,
                });
                if (!response.ok) throw new Error("Search suggestions unavailable");
                const data = await response.json();
                setResults(data.results ?? null);
                setOpen(true);
            } catch (error) {
                if (error.name !== "AbortError") setResults(null);
            } finally {
                setLoading(false);
            }
        }, 180);

        return () => {
            window.clearTimeout(timer);
            controller.abort();
        };
    }, [query]);

    const groups = useMemo(
        () => Object.entries(results ?? {}).filter(([, items]) => items?.length),
        [results],
    );

    const flatResults = useMemo(
        () => groups.flatMap(([type, items]) => items.map((item) => ({ ...item, type }))),
        [groups],
    );

    const remember = (term) => {
        const cleaned = term.trim();
        if (!cleaned) return;
        const next = [cleaned, ...recentSearches.filter((item) => item.toLowerCase() !== cleaned.toLowerCase())].slice(0, 6);
        setRecentSearches(next);
        window.localStorage.setItem(recentSearchKey, JSON.stringify(next));
    };

    const searchFor = (term) => {
        const cleaned = term.trim();
        if (!cleaned) return;
        remember(cleaned);
        setOpen(false);
        setActiveIndex(-1);
        router.get(route("storefront.catalog"), { search: cleaned, ...(category ? { category } : {}) });
    };

    const submit = (event) => {
        event?.preventDefault?.();
        searchFor(query);
    };

    const go = (item) => {
        remember(query || item.name || "");
        setOpen(false);
        setActiveIndex(-1);
        router.visit(item.url);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Escape") {
            setOpen(false);
            setActiveIndex(-1);
            inputRef.current?.blur();
            return;
        }

        if (!flatResults.length) return;

        if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
            setActiveIndex((index) => (index + 1) % flatResults.length);
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
            setActiveIndex((index) => (index <= 0 ? flatResults.length - 1 : index - 1));
        } else if (event.key === "Enter" && activeIndex >= 0) {
            event.preventDefault();
            go(flatResults[activeIndex]);
        }
    };

    const hasDiscovery = !query.trim() && (recentSearches.length || popularSearches.length);
    const panelClass = mobileFullscreen
        ? "fixed inset-0 z-[100] overflow-y-auto bg-white p-4 sm:absolute sm:inset-auto sm:left-0 sm:right-0 sm:top-full sm:mt-2 sm:max-h-[70vh] sm:rounded-2xl sm:border sm:border-slate-200 sm:p-2 sm:shadow-2xl sm:shadow-slate-900/15"
        : "absolute left-0 right-0 top-full z-[80] mt-2 max-h-[70vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/15";

    return (
        <div ref={wrapperRef} className="relative w-full">
            <form
                onSubmit={submit}
                className={`flex overflow-hidden border-2 bg-slate-50 transition focus-within:border-[#0f766e] focus-within:bg-white focus-within:shadow-lg focus-within:shadow-teal-900/5 ${compact ? "rounded-xl" : "rounded-2xl"}`}
                role="search"
            >
                <div className="flex items-center pl-4 text-slate-400"><Search size={compact ? 19 : 20} /></div>
                <input
                    ref={inputRef}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onFocus={() => setOpen(true)}
                    onKeyDown={handleKeyDown}
                    className={`min-w-0 flex-1 border-0 bg-transparent px-3 text-sm placeholder:text-slate-400 focus:ring-0 ${compact ? "py-3" : "py-3.5"}`}
                    placeholder={placeholder}
                    autoComplete="off"
                    aria-label={t("searchStore")}
                    aria-expanded={open}
                    aria-controls="smart-search-results"
                    aria-activedescendant={activeIndex >= 0 ? `smart-search-option-${activeIndex}` : undefined}
                />
                {query && (
                    <button type="button" onClick={() => { setQuery(""); setResults(null); setActiveIndex(-1); inputRef.current?.focus(); }} className="px-2 text-slate-400 hover:text-slate-700" aria-label={t("clearSearch")}><X size={17} /></button>
                )}
                {!compact && (
                    <select value={category} onChange={(event) => setCategory(event.target.value)} className="hidden max-w-48 border-y-0 border-r-0 border-l border-slate-200 bg-white text-sm xl:block" aria-label={t("filterCategory")}>
                        <option value="">{t("allCategories")}</option>
                        {categories.slice(0, 20).map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}
                    </select>
                )}
                <button className="min-w-12 bg-[#0f766e] px-4 font-bold text-white transition hover:bg-[#115e59] sm:px-6" aria-label={t("searchButton")}>
                    {loading ? <LoaderCircle className="mx-auto animate-spin" size={19} /> : compact ? <Search className="mx-auto" size={19} /> : t("searchButton")}
                </button>
            </form>

            {open && (
                <div id="smart-search-results" className={panelClass} role="listbox">
                    {mobileFullscreen && (
                        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3 sm:hidden">
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0f766e]">Nuha Mart BD</p>
                                <h2 className="mt-1 text-lg font-black text-slate-900">{t("searchEverything")}</h2>
                            </div>
                            <button type="button" onClick={() => setOpen(false)} className="rounded-xl border border-slate-200 p-2.5 text-slate-600" aria-label={t("closeSearch")}><X size={20} /></button>
                        </div>
                    )}

                    {hasDiscovery ? (
                        <div className="space-y-4 p-2 sm:p-1">
                            {recentSearches.length > 0 && (
                                <section>
                                    <div className="flex items-center justify-between px-2 py-1">
                                        <span className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-slate-400"><History size={14} /> {t("recentSearches")}</span>
                                        <button type="button" onClick={() => { setRecentSearches([]); window.localStorage.removeItem(recentSearchKey); }} className="text-xs font-bold text-rose-600">{t("clearAll")}</button>
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {recentSearches.map((term) => (
                                            <button key={term} type="button" onClick={() => { setQuery(term); searchFor(term); }} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 hover:text-[#0f766e]"><Clock3 size={13} /> {term}</button>
                                        ))}
                                    </div>
                                </section>
                            )}
                            <section>
                                <div className="flex items-center gap-2 px-2 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-slate-400"><TrendingUp size={14} /> {t("popularSearches")}</div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {popularSearches.map((term) => (
                                        <button key={term} type="button" onClick={() => { setQuery(term); searchFor(term); }} className="rounded-full bg-teal-50 px-3 py-2 text-xs font-black text-[#0f766e] transition hover:bg-[#0f766e] hover:text-white">{term}</button>
                                    ))}
                                </div>
                            </section>
                            <p className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-3 text-xs font-semibold text-slate-500"><ArrowDown size={15} /> {t("searchKeyboardHint")}</p>
                        </div>
                    ) : loading && !groups.length ? (
                        <div className="flex items-center justify-center gap-2 px-4 py-8 text-sm text-slate-500"><LoaderCircle className="animate-spin" size={18} /> {t("searching")}</div>
                    ) : groups.length ? (
                        <>
                            {groups.map(([type, items]) => {
                                const MetaIcon = typeMeta[type]?.icon ?? Search;
                                const startIndex = groups.slice(0, groups.findIndex(([groupType]) => groupType === type)).reduce((sum, [, groupItems]) => sum + groupItems.length, 0);
                                return (
                                    <section key={type} className="border-b border-slate-100 py-2 last:border-0">
                                        <div className="flex items-center gap-2 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-slate-400"><MetaIcon size={14} /> {t(typeMeta[type]?.labelKey ?? type)}</div>
                                        {items.map((item, index) => {
                                            const optionIndex = startIndex + index;
                                            const active = optionIndex === activeIndex;
                                            return (
                                                <button
                                                    id={`smart-search-option-${optionIndex}`}
                                                    key={`${type}-${item.id}`}
                                                    type="button"
                                                    role="option"
                                                    aria-selected={active}
                                                    onMouseEnter={() => setActiveIndex(optionIndex)}
                                                    onClick={() => go(item)}
                                                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${active ? "bg-teal-50 ring-1 ring-teal-200" : "hover:bg-teal-50"}`}
                                                >
                                                    {item.image ? <img src={item.image} alt="" loading="lazy" className="h-12 w-10 rounded-lg object-cover" /> : <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-[#0f766e]"><MetaIcon size={18} /></span>}
                                                    <span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold text-slate-800">{item.name}</span>{item.subtitle && <span className="mt-0.5 block truncate text-xs text-slate-500">{item.subtitle}</span>}</span>
                                                    {item.price != null && <span className="text-sm font-black text-[#0f766e]">৳{Number(item.price).toLocaleString()}</span>}
                                                </button>
                                            );
                                        })}
                                    </section>
                                );
                            })}
                            <button type="button" onClick={submit} className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-black text-white transition hover:bg-[#0f766e]">{t("viewAllResults")} “{query.trim()}”</button>
                        </>
                    ) : query.trim().length >= 2 ? (
                        <div className="px-4 py-8 text-center text-sm text-slate-500">{t("noSearchResults")}</div>
                    ) : null}
                </div>
            )}
        </div>
    );
}

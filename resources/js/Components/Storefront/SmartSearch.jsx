import { router } from "@inertiajs/react";
import { BookOpen, Building2, LoaderCircle, Search, Tags, UserRound, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const typeMeta = {
    product: { label: "Products", icon: BookOpen },
    author: { label: "Authors", icon: UserRound },
    publisher: { label: "Publishers", icon: Building2 },
    category: { label: "Categories", icon: Tags },
};

export default function SmartSearch({ categories = [], compact = false, placeholder = "Search books, authors, publishers or ISBN..." }) {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("");
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const close = (event) => {
            if (!wrapperRef.current?.contains(event.target)) setOpen(false);
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);

    useEffect(() => {
        const term = query.trim();
        if (term.length < 2) {
            setResults(null);
            setLoading(false);
            return;
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
        }, 220);

        return () => {
            window.clearTimeout(timer);
            controller.abort();
        };
    }, [query]);

    const groups = useMemo(() => Object.entries(results ?? {}).filter(([, items]) => items?.length), [results]);

    const submit = (event) => {
        event.preventDefault();
        const term = query.trim();
        const params = {};
        if (term) params.search = term;
        if (category) params.category = category;
        setOpen(false);
        router.get(route("storefront.catalog"), params);
    };

    const go = (url) => {
        setOpen(false);
        router.visit(url);
    };

    return (
        <div ref={wrapperRef} className="relative w-full">
            <form onSubmit={submit} className={`flex overflow-hidden border-2 bg-slate-50 transition focus-within:border-[#0f766e] focus-within:bg-white focus-within:shadow-lg focus-within:shadow-teal-900/5 ${compact ? "rounded-xl" : "rounded-2xl"}`}>
                <div className="flex items-center pl-4 text-slate-400"><Search size={compact ? 19 : 20} /></div>
                <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onFocus={() => query.trim().length >= 2 && setOpen(true)}
                    className={`min-w-0 flex-1 border-0 bg-transparent px-3 text-sm placeholder:text-slate-400 focus:ring-0 ${compact ? "py-3" : "py-3.5"}`}
                    placeholder={placeholder}
                    autoComplete="off"
                    aria-label="Search store"
                />
                {query && (
                    <button type="button" onClick={() => { setQuery(""); setResults(null); }} className="px-2 text-slate-400 hover:text-slate-700" aria-label="Clear search"><X size={17} /></button>
                )}
                {!compact && (
                    <select value={category} onChange={(event) => setCategory(event.target.value)} className="hidden max-w-48 border-y-0 border-r-0 border-l border-slate-200 bg-white text-sm xl:block">
                        <option value="">All categories</option>
                        {categories.slice(0, 20).map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}
                    </select>
                )}
                <button className="min-w-12 bg-[#0f766e] px-4 font-bold text-white transition hover:bg-[#115e59] sm:px-6">
                    {loading ? <LoaderCircle className="mx-auto animate-spin" size={19} /> : compact ? <Search className="mx-auto" size={19} /> : "Search"}
                </button>
            </form>

            {open && query.trim().length >= 2 && (
                <div className="absolute left-0 right-0 top-full z-[80] mt-2 max-h-[70vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/15">
                    {loading && !groups.length ? (
                        <div className="flex items-center justify-center gap-2 px-4 py-8 text-sm text-slate-500"><LoaderCircle className="animate-spin" size={18} /> Searching…</div>
                    ) : groups.length ? (
                        <>
                            {groups.map(([type, items]) => {
                                const MetaIcon = typeMeta[type]?.icon ?? Search;
                                return (
                                    <section key={type} className="border-b border-slate-100 py-2 last:border-0">
                                        <div className="flex items-center gap-2 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-slate-400"><MetaIcon size={14} /> {typeMeta[type]?.label ?? type}</div>
                                        {items.map((item) => (
                                            <button key={`${type}-${item.id}`} type="button" onClick={() => go(item.url)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-teal-50">
                                                {item.image ? <img src={item.image} alt="" className="h-12 w-10 rounded-lg object-cover" /> : <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-[#0f766e]"><MetaIcon size={18} /></span>}
                                                <span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold text-slate-800">{item.name}</span>{item.subtitle && <span className="mt-0.5 block truncate text-xs text-slate-500">{item.subtitle}</span>}</span>
                                                {item.price != null && <span className="text-sm font-black text-[#0f766e]">৳{Number(item.price).toLocaleString()}</span>}
                                            </button>
                                        ))}
                                    </section>
                                );
                            })}
                            <button type="button" onClick={submit} className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-black text-white transition hover:bg-[#0f766e]">View all results for “{query.trim()}”</button>
                        </>
                    ) : (
                        <div className="px-4 py-8 text-center text-sm text-slate-500">No matching products, authors, publishers or categories found.</div>
                    )}
                </div>
            )}
        </div>
    );
}

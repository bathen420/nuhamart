import { router, usePage } from "@inertiajs/react";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { searchableNavigation } from "@/Components/Admin/AdminNavigation";
import cn from "@/lib/cn";

export default function CommandPalette({ open, onClose }) {
    const { auth = {} } = usePage().props;
    const [query, setQuery] = useState("");
    const inputRef = useRef(null);
    const items = useMemo(() => searchableNavigation(auth), [auth]);

    const results = useMemo(() => {
        const term = query.trim().toLowerCase();

        if (!term) return items.slice(0, 10);

        return items
            .filter((item) =>
                `${item.label} ${item.description} ${item.section} ${item.keywords}`
                    .toLowerCase()
                    .includes(term),
            )
            .slice(0, 12);
    }, [items, query]);

    useEffect(() => {
        if (!open) return;

        setQuery("");
        const timer = window.setTimeout(() => inputRef.current?.focus(), 30);

        const listener = (event) => {
            if (event.key === "Escape") onClose();
        };

        document.addEventListener("keydown", listener);
        return () => {
            window.clearTimeout(timer);
            document.removeEventListener("keydown", listener);
        };
    }, [open, onClose]);

    const visit = (item) => {
        onClose();
        router.visit(route(item.routeName));
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-start justify-center bg-ink-950/55 px-4 pt-[10vh] backdrop-blur-sm">
            <button
                type="button"
                aria-label="Close command palette"
                className="absolute inset-0"
                onClick={onClose}
            />

            <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/70 bg-white shadow-floating">
                <div className="flex items-center gap-3 border-b border-ink-100 px-5">
                    <Search size={20} className="text-ink-400" />
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search pages, products, orders and settings..."
                        className="h-16 min-w-0 flex-1 border-0 bg-transparent px-0 text-base text-ink-900 outline-none placeholder:text-ink-400 focus:ring-0"
                    />
                    <button
                        type="button"
                        onClick={onClose}
                        className="grid h-9 w-9 place-items-center rounded-xl text-ink-400 transition hover:bg-ink-100 hover:text-ink-900"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="nm-scrollbar max-h-[58vh] overflow-y-auto p-2">
                    {results.length ? (
                        results.map((item) => {
                            const Icon = item.icon;

                            return (
                                <button
                                    type="button"
                                    key={item.routeName}
                                    onClick={() => visit(item)}
                                    className="group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-brand-50"
                                >
                                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink-100 text-ink-500 transition group-hover:bg-white group-hover:text-brand-700 group-hover:shadow-sm">
                                        <Icon size={18} />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate text-sm font-black text-ink-900">
                                            {item.label}
                                        </span>
                                        <span className="mt-0.5 block truncate text-xs text-ink-500">
                                            {item.section} · {item.description}
                                        </span>
                                    </span>
                                    <kbd className="rounded-lg border border-ink-200 bg-white px-2 py-1 text-[10px] font-bold text-ink-400 opacity-0 transition group-hover:opacity-100">
                                        Enter
                                    </kbd>
                                </button>
                            );
                        })
                    ) : (
                        <div className="px-6 py-14 text-center">
                            <Search className="mx-auto text-ink-300" size={30} />
                            <p className="mt-4 text-sm font-black text-ink-700">
                                No matching destination
                            </p>
                            <p className="mt-1 text-xs text-ink-400">
                                Try another page or module name.
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between border-t border-ink-100 bg-ink-50 px-5 py-3 text-[11px] font-semibold text-ink-400">
                    <span>Navigate the NuhaMart workspace</span>
                    <span>ESC to close</span>
                </div>
            </div>
        </div>
    );
}

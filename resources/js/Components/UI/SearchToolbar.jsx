import { Search, RotateCcw, SlidersHorizontal } from "lucide-react";

export default function SearchToolbar({
    search = "",
    onSearchChange,
    searchPlaceholder = "Search...",
    status = "",
    onStatusChange,
    statusOptions = [
        { value: "", label: "All Status" },
        { value: "1", label: "Active" },
        { value: "0", label: "Inactive" },
    ],
    onReset,
    children = null,
    showStatus = true,
    className = "",
}) {
    const handleSubmit = (event) => {
        event.preventDefault();
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}
        >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="relative min-w-0 flex-1">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                        type="search"
                        value={search}
                        onChange={(event) =>
                            onSearchChange?.(event.target.value)
                        }
                        placeholder={searchPlaceholder}
                        className="h-11 w-full rounded-xl border border-slate-300 bg-slate-50 pl-12 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    />
                </div>

                {showStatus && (
                    <div className="relative w-full lg:w-52">
                        <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <select
                            value={status}
                            onChange={(event) =>
                                onStatusChange?.(event.target.value)
                            }
                            className="h-11 w-full appearance-none rounded-xl border border-slate-300 bg-slate-50 pl-11 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                        >
                            {statusOptions.map((option) => (
                                <option
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                            ▼
                        </div>
                    </div>
                )}

                {children}

                {onReset && (
                    <button
                        type="button"
                        onClick={onReset}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus:ring-4 focus:ring-rose-100"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Reset
                    </button>
                )}
            </div>
        </form>
    );
}
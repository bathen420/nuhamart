const iconPaths = {
    products: (
        <>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 16.5V7.5a2.25 2.25 0 0 0-1.125-1.949l-6.75-3.9a2.25 2.25 0 0 0-2.25 0l-6.75 3.9A2.25 2.25 0 0 0 3 7.5v9a2.25 2.25 0 0 0 1.125 1.949l6.75 3.9a2.25 2.25 0 0 0 2.25 0l6.75-3.9A2.25 2.25 0 0 0 21 16.5Z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m3.27 6.96 8.73 5.04 8.73-5.04M12 22.08V12"
            />
        </>
    ),

    categories: (
        <>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6.75A2.25 2.25 0 0 1 4.5 4.5h5.25l2.25 2.25h7.5a2.25 2.25 0 0 1 2.25 2.25v8.25a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75Z"
            />
        </>
    ),

    brands: (
        <>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.568 3.057A2.25 2.25 0 0 1 11.159 2.4h6.441a2.25 2.25 0 0 1 2.25 2.25v6.441a2.25 2.25 0 0 1-.659 1.591l-7.409 7.409a2.25 2.25 0 0 1-3.182 0l-5.091-5.091a2.25 2.25 0 0 1 0-3.182l6.059-6.059Z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6.75h.008v.008h-.008V6.75Z"
            />
        </>
    ),

    suppliers: (
        <>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 18.75a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM18.75 18.75a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2.25l2.25 11.25h10.5l2.25-7.5H6.75"
            />
        </>
    ),

    customers: (
        <>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0"
            />
        </>
    ),

    orders: (
        <>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386a1.5 1.5 0 0 1 1.451 1.113l.383 1.437m0 0L7.5 13.5h9.75l2.25-7.95H5.47ZM7.5 18.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM17.25 18.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z"
            />
        </>
    ),

    purchases: (
        <>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 15.75v3A2.25 2.25 0 0 0 6.75 21h10.5a2.25 2.25 0 0 0 2.25-2.25v-3"
            />
        </>
    ),

    warning: (
        <>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9.303 3.376c.866 1.5-.217 3.374-1.948 3.374H4.645c-1.731 0-2.814-1.874-1.948-3.374l7.355-12.74c.866-1.5 3.03-1.5 3.896 0l7.355 12.74ZM12 16.5h.008v.008H12V16.5Z"
            />
        </>
    ),
};

export default function StatCard({
    title,
    value,
    icon = "products",
    description = "Current total",
    accent = "blue",
}) {
    const accents = {
        blue: {
            icon: "bg-blue-50 text-blue-600",
            line: "bg-blue-500",
        },
        emerald: {
            icon: "bg-emerald-50 text-emerald-600",
            line: "bg-emerald-500",
        },
        violet: {
            icon: "bg-violet-50 text-violet-600",
            line: "bg-violet-500",
        },
        cyan: {
            icon: "bg-cyan-50 text-cyan-600",
            line: "bg-cyan-500",
        },
        pink: {
            icon: "bg-pink-50 text-pink-600",
            line: "bg-pink-500",
        },
        orange: {
            icon: "bg-orange-50 text-orange-600",
            line: "bg-orange-500",
        },
        indigo: {
            icon: "bg-indigo-50 text-indigo-600",
            line: "bg-indigo-500",
        },
        amber: {
            icon: "bg-amber-50 text-amber-600",
            line: "bg-amber-500",
        },
        red: {
            icon: "bg-red-50 text-red-600",
            line: "bg-red-500",
        },
    };

    const theme = accents[accent] ?? accents.blue;
    const selectedIcon = iconPaths[icon] ?? iconPaths.products;

    return (
        <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div
                className={`absolute inset-x-0 top-0 h-1 ${theme.line}`}
            />

            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-500">
                        {title}
                    </p>

                    <h3 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
                        {value}
                    </h3>

                    <p className="mt-2 text-xs text-gray-400">
                        {description}
                    </p>
                </div>

                <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition duration-300 group-hover:scale-110 ${theme.icon}`}
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-6 w-6"
                        aria-hidden="true"
                    >
                        {selectedIcon}
                    </svg>
                </div>
            </div>
        </div>
    );
}
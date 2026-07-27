import {
    Banknote,
    Boxes,
    CreditCard,
    PackageSearch,
    ShoppingBag,
    TrendingUp,
    Truck,
    Users,
} from "lucide-react";

const icons = {
    sales: TrendingUp,
    purchase: ShoppingBag,
    products: Boxes,
    customers: Users,
    suppliers: Truck,
    due: CreditCard,
    orders: Banknote,
    stock: PackageSearch,
};

export default function AnalyticsCard({
    title,
    value,
    description,
    icon = "sales",
    tone = "blue",
}) {
    const Icon = icons[icon] ?? TrendingUp;

    const tones = {
        blue: "bg-blue-50 text-blue-600 ring-blue-100",
        emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
        violet: "bg-violet-50 text-violet-600 ring-violet-100",
        amber: "bg-amber-50 text-amber-600 ring-amber-100",
        rose: "bg-rose-50 text-rose-600 ring-rose-100",
        cyan: "bg-cyan-50 text-cyan-600 ring-cyan-100",
    };

    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-500">{title}</p>
                    <p className="mt-3 truncate text-2xl font-black tracking-tight text-slate-900">
                        {value}
                    </p>
                    <p className="mt-2 text-xs leading-5 text-slate-400">
                        {description}
                    </p>
                </div>

                <div className={`rounded-xl p-3 ring-1 ${tones[tone] ?? tones.blue}`}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </article>
    );
}

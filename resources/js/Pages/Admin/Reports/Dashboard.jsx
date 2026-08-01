import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import { BarChart3, ReceiptText, RotateCcw, WalletCards } from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

function money(value) {
    const number = Number(value ?? 0);
    return new Intl.NumberFormat("en-BD", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number.isFinite(number) ? number : 0);
}

function SummaryCard({ title, value, note, icon: Icon, tone }) {
    const tones = {
        blue: "bg-blue-50 text-blue-700",
        red: "bg-red-50 text-red-700",
        green: "bg-green-50 text-green-700",
        violet: "bg-violet-50 text-violet-700",
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
                    <p className="mt-1 text-xs text-gray-500">{note}</p>
                </div>
                <div className={`rounded-xl p-3 ${tones[tone] ?? tones.blue}`}>
                    <Icon size={22} />
                </div>
            </div>
        </div>
    );
}

export default function Dashboard({ summary = {}, filters = {} }) {
    const { businessSettings = {} } = usePage().props;
    const currency = businessSettings.currency_symbol ?? "৳";
    const [dateFrom, setDateFrom] = useState(filters.date_from ?? "");
    const [dateTo, setDateTo] = useState(filters.date_to ?? "");

    const applyFilter = (event) => {
        event.preventDefault();
        router.get(
            route("admin.reports.index"),
            { date_from: dateFrom, date_to: dateTo },
            { preserveState: true, replace: true }
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Reports Dashboard</h2>
                    <p className="mt-1 text-sm text-gray-500">Business performance summary for the selected period.</p>
                </div>
            }
        >
            <Head title="Reports Dashboard" />

            <section className="mx-auto max-w-screen-2xl space-y-6">
                <form onSubmit={applyFilter} className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-end">
                    <label className="flex-1">
                        <span className="mb-1 block text-sm font-medium text-gray-700">Date From</span>
                        <input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} className="w-full rounded-lg border-gray-300" />
                    </label>
                    <label className="flex-1">
                        <span className="mb-1 block text-sm font-medium text-gray-700">Date To</span>
                        <input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} className="w-full rounded-lg border-gray-300" />
                    </label>
                    <button type="submit" className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700">Apply</button>
                </form>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <SummaryCard title="Gross Sales" value={`${currency}${money(summary.gross_sales)}`} note={`${summary.sales_count ?? 0} sales`} icon={ReceiptText} tone="blue" />
                    <SummaryCard title="Sales Returns" value={`${currency}${money(summary.sales_returns)}`} note={`${summary.return_count ?? 0} returns`} icon={RotateCcw} tone="red" />
                    <SummaryCard title="Net Sales" value={`${currency}${money(summary.net_sales)}`} note="Gross sales minus returns" icon={WalletCards} tone="green" />
                    <SummaryCard title="Report Period" value={`${filters.date_from ?? ""}`} note={`to ${filters.date_to ?? ""}`} icon={BarChart3} tone="violet" />
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900">Sales Report</h3>
                        <p className="mt-2 text-sm leading-6 text-gray-600">Filter sales by date, customer, payment method and payment status. Review gross sales, returned value and net sales, then print or export CSV.</p>
                        <Link href={route("admin.reports.sales", { date_from: filters.date_from, date_to: filters.date_to })} className="mt-5 inline-flex rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700">Open Sales Report</Link>
                    </div>

                    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-800">More reports coming next</h3>
                        <p className="mt-2 text-sm leading-6 text-gray-600">Purchase, stock, customer, supplier and profit reports can be added in the next version without changing this report foundation.</p>
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    );
}

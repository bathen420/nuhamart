import { Link } from "@inertiajs/react";

const money = (value) =>
    new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "BDT",
        maximumFractionDigits: 2,
    }).format(Number(value || 0));

export default function RecentSales({ sales = [] }) {
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div>
                    <h2 className="font-bold text-slate-900">Recent Sales</h2>
                    <p className="text-sm text-slate-500">Latest POS transactions</p>
                </div>
                <Link href={route("admin.sales.index")} className="text-sm font-bold text-blue-600">
                    View all
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="px-5 py-3">Invoice</th>
                            <th className="px-5 py-3">Customer</th>
                            <th className="px-5 py-3 text-right">Total</th>
                            <th className="px-5 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {sales.map((sale) => (
                            <tr key={sale.id}>
                                <td className="px-5 py-3">
                                    <Link
                                        href={route("admin.sales.show", sale.id)}
                                        className="font-bold text-blue-600"
                                    >
                                        {sale.sale_number}
                                    </Link>
                                    <p className="mt-1 text-xs text-slate-400">{sale.created_at}</p>
                                </td>
                                <td className="px-5 py-3 text-slate-700">{sale.customer}</td>
                                <td className="px-5 py-3 text-right font-bold text-slate-900">
                                    {money(sale.total)}
                                </td>
                                <td className="px-5 py-3">
                                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${
                                        sale.payment_status === "paid"
                                            ? "bg-emerald-100 text-emerald-700"
                                            : sale.payment_status === "partial"
                                              ? "bg-amber-100 text-amber-700"
                                              : "bg-rose-100 text-rose-700"
                                    }`}>
                                        {sale.payment_status}
                                    </span>
                                </td>
                            </tr>
                        ))}

                        {sales.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-5 py-10 text-center text-slate-500">
                                    No sales found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

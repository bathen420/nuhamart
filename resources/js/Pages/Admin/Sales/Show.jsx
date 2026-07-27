import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const money = (value) =>
    new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: 'BDT',
        maximumFractionDigits: 2,
    }).format(Number(value || 0));

export default function Show({ sale }) {
    return (
        <AdminLayout>
            <Head title={`Invoice ${sale.sale_number}`} />

            <div className="mx-auto max-w-4xl p-4 sm:p-6">
                <div className="mb-4 flex justify-end print:hidden">
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
                    >
                        Print Invoice
                    </button>
                </div>

                <article className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200 print:shadow-none print:ring-0">
                    <header className="flex items-start justify-between border-b pb-6">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900">NuhaMart</h1>
                            <p className="mt-1 text-gray-500">Sales Invoice</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-gray-900">{sale.sale_number}</p>
                            <p className="text-sm text-gray-500">
                                {new Date(sale.created_at).toLocaleString()}
                            </p>
                        </div>
                    </header>

                    <section className="grid gap-4 py-6 sm:grid-cols-2">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                Customer
                            </p>
                            <p className="font-semibold text-gray-900">
                                {sale.customer?.name || 'Walk-in customer'}
                            </p>
                            {sale.customer?.phone && (
                                <p className="text-sm text-gray-500">{sale.customer.phone}</p>
                            )}
                        </div>
                        <div className="sm:text-right">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                Served by
                            </p>
                            <p className="font-semibold text-gray-900">
                                {sale.user?.name || 'Administrator'}
                            </p>
                        </div>
                    </section>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-y bg-gray-50 text-left text-sm text-gray-600">
                                    <th className="px-3 py-3">Product</th>
                                    <th className="px-3 py-3 text-center">Qty</th>
                                    <th className="px-3 py-3 text-right">Price</th>
                                    <th className="px-3 py-3 text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sale.items.map((item) => (
                                    <tr key={item.id} className="border-b">
                                        <td className="px-3 py-3 font-medium text-gray-900">
                                            {item.product?.name || `Product #${item.product_id}`}
                                        </td>
                                        <td className="px-3 py-3 text-center">{item.quantity}</td>
                                        <td className="px-3 py-3 text-right">{money(item.price)}</td>
                                        <td className="px-3 py-3 text-right font-semibold">
                                            {money(item.subtotal)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <section className="ml-auto mt-6 max-w-sm space-y-2">
                        {[
                            ['Subtotal', sale.subtotal],
                            ['Discount', -Number(sale.discount)],
                            ['Tax', sale.tax],
                            ['Shipping', sale.shipping],
                        ].map(([label, value]) => (
                            <div key={label} className="flex justify-between text-gray-600">
                                <span>{label}</span>
                                <span>{money(value)}</span>
                            </div>
                        ))}
                        <div className="flex justify-between border-t pt-3 text-xl font-black">
                            <span>Total</span>
                            <span>{money(sale.total)}</span>
                        </div>
                        <div className="flex justify-between text-emerald-700">
                            <span>Paid</span>
                            <span>{money(sale.paid_amount)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-red-600">
                            <span>Due</span>
                            <span>{money(sale.due_amount)}</span>
                        </div>
                    </section>

                    <footer className="mt-10 border-t pt-5 text-center text-sm text-gray-500">
                        Thank you for shopping with NuhaMart.
                    </footer>
                </article>
            </div>
        </AdminLayout>
    );
}

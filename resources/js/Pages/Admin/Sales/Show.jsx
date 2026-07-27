import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const money = (value) =>
    new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'BDT',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number(value || 0));

const formatDate = (date) => {
    if (!date) {
        return '';
    }

    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date));
};

export default function Show({ auth, sale }) {
    const saleItems = Array.isArray(sale?.items) ? sale.items : [];

    const handlePrint = () => {
        window.print();
    };

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            Sales Invoice
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Invoice #{sale?.sale_number}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2 print:hidden">
                        <Link
                            href={route('admin.pos.create')}
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            New Sale
                        </Link>

                        {typeof route === 'function' &&
                            route().has('admin.sales.index') && (
                                <Link
                                    href={route('admin.sales.index')}
                                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                    Sales History
                                </Link>
                            )}

                        <button
                            type="button"
                            onClick={handlePrint}
                            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                        >
                            Print Invoice
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`Invoice ${sale?.sale_number || ''}`} />

            <div className="invoice-page min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8 print:min-h-0 print:bg-white print:p-0">
                <div className="mx-auto max-w-5xl">
                    <div className="mb-5 flex justify-end gap-2 print:hidden">
                        <Link
                            href={route('admin.pos.create')}
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                        >
                            New Sale
                        </Link>

                        <button
                            type="button"
                            onClick={handlePrint}
                            className="rounded-lg bg-indigo-600 px-5 py-2 font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                        >
                            Print Invoice
                        </button>
                    </div>

                    <article
                        id="print-invoice"
                        className="overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-10 print:overflow-visible print:rounded-none print:p-0 print:shadow-none print:ring-0"
                    >
                        <header className="flex flex-col gap-5 border-b border-slate-200 pb-7 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                                    NuhaMart
                                </h1>

                                <p className="mt-2 text-base text-slate-500">
                                    Inventory & POS System
                                </p>

                                <p className="mt-1 text-sm text-slate-400">
                                    Sales Invoice
                                </p>
                            </div>

                            <div className="sm:text-right">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Invoice Number
                                </p>

                                <p className="mt-1 text-lg font-bold text-slate-900">
                                    {sale?.sale_number || 'N/A'}
                                </p>

                                <p className="mt-2 text-sm text-slate-500">
                                    {formatDate(sale?.created_at)}
                                </p>

                                <span
                                    className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                                        sale?.payment_status === 'paid'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : sale?.payment_status === 'partial'
                                              ? 'bg-amber-100 text-amber-700'
                                              : 'bg-rose-100 text-rose-700'
                                    }`}
                                >
                                    {sale?.payment_status || 'unpaid'}
                                </span>
                            </div>
                        </header>

                        <section className="grid gap-6 border-b border-slate-200 py-7 sm:grid-cols-2">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Customer
                                </p>

                                <p className="mt-2 text-lg font-bold text-slate-900">
                                    {sale?.customer?.name || 'Walk-in Customer'}
                                </p>

                                {sale?.customer?.phone && (
                                    <p className="mt-1 text-sm text-slate-500">
                                        Phone: {sale.customer.phone}
                                    </p>
                                )}

                                {sale?.customer?.email && (
                                    <p className="mt-1 text-sm text-slate-500">
                                        Email: {sale.customer.email}
                                    </p>
                                )}
                            </div>

                            <div className="sm:text-right">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Served By
                                </p>

                                <p className="mt-2 text-lg font-bold text-slate-900">
                                    {sale?.user?.name || 'Administrator'}
                                </p>

                                <p className="mt-1 text-sm capitalize text-slate-500">
                                    Payment:{' '}
                                    {(sale?.payment_method || 'cash').replaceAll(
                                        '_',
                                        ' ',
                                    )}
                                </p>

                                <p className="mt-1 text-sm capitalize text-slate-500">
                                    Sale status:{' '}
                                    {sale?.sale_status || 'completed'}
                                </p>
                            </div>
                        </section>

                        <section className="py-7">
                            <div className="overflow-x-auto print:overflow-visible">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-y border-slate-200 bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                            <th className="px-4 py-4">
                                                Product
                                            </th>

                                            <th className="px-4 py-4 text-center">
                                                Qty
                                            </th>

                                            <th className="px-4 py-4 text-right">
                                                Price
                                            </th>

                                            <th className="px-4 py-4 text-right">
                                                Subtotal
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-100">
                                        {saleItems.map((item) => (
                                            <tr key={item.id}>
                                                <td className="px-4 py-4">
                                                    <p className="font-semibold text-slate-900">
                                                        {item?.product?.name ||
                                                            `Product #${item.product_id}`}
                                                    </p>

                                                    {(item?.product?.sku ||
                                                        item?.product
                                                            ?.barcode) && (
                                                        <p className="mt-1 text-xs text-slate-400">
                                                            SKU:{' '}
                                                            {item.product.sku ||
                                                                item.product
                                                                    .barcode}
                                                        </p>
                                                    )}
                                                </td>

                                                <td className="px-4 py-4 text-center font-medium text-slate-700">
                                                    {item.quantity}
                                                </td>

                                                <td className="px-4 py-4 text-right text-slate-700">
                                                    {money(item.price)}
                                                </td>

                                                <td className="px-4 py-4 text-right font-bold text-slate-900">
                                                    {money(item.subtotal)}
                                                </td>
                                            </tr>
                                        ))}

                                        {saleItems.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan="4"
                                                    className="px-4 py-10 text-center text-slate-500"
                                                >
                                                    No sale items found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section className="grid gap-8 border-t border-slate-200 pt-7 md:grid-cols-[1fr_360px]">
                            <div>
                                {sale?.note && (
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Note
                                        </p>

                                        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                                            {sale.note}
                                        </p>
                                    </div>
                                )}

                                <div className="mt-8 hidden print:block">
                                    <p className="text-sm text-slate-500">
                                        Thank you for shopping with NuhaMart.
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-5 print:bg-white print:p-0">
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center justify-between text-slate-600">
                                        <span>Subtotal</span>
                                        <span>{money(sale?.subtotal)}</span>
                                    </div>

                                    <div className="flex items-center justify-between text-slate-600">
                                        <span>Discount</span>
                                        <span className="text-rose-600">
                                            -{money(sale?.discount)}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-slate-600">
                                        <span>Tax</span>
                                        <span>{money(sale?.tax)}</span>
                                    </div>

                                    <div className="flex items-center justify-between text-slate-600">
                                        <span>Shipping</span>
                                        <span>{money(sale?.shipping)}</span>
                                    </div>
                                </div>

                                <div className="my-4 border-t border-dashed border-slate-300" />

                                <div className="flex items-center justify-between text-xl font-black text-slate-900">
                                    <span>Total</span>
                                    <span>{money(sale?.total)}</span>
                                </div>

                                <div className="mt-4 flex items-center justify-between font-semibold text-emerald-700">
                                    <span>Paid</span>
                                    <span>{money(sale?.paid_amount)}</span>
                                </div>

                                <div className="mt-2 flex items-center justify-between font-bold text-rose-600">
                                    <span>Due</span>
                                    <span>{money(sale?.due_amount)}</span>
                                </div>
                            </div>
                        </section>

                        <footer className="mt-10 border-t border-slate-200 pt-6 text-center">
                            <p className="font-semibold text-slate-700">
                                Thank you for shopping with NuhaMart.
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                This invoice was generated electronically.
                            </p>
                        </footer>
                    </article>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
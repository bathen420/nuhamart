import { Head, Link } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";

function money(value, symbol) {
    const amount = Number(value ?? 0);
    return `${symbol}${new Intl.NumberFormat("en-BD", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number.isFinite(amount) ? amount : 0)}`;
}

function dateTime(value) {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return new Intl.DateTimeFormat("en-BD", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}

function waitForPrintAssets() {
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    const images = Array.from(document.images);
    const imagesReady = Promise.all(
        images.map((image) => {
            if (image.complete) return Promise.resolve();
            return new Promise((resolve) => {
                image.addEventListener("load", resolve, { once: true });
                image.addEventListener("error", resolve, { once: true });
            });
        }),
    );
    return Promise.all([fontsReady, imagesReady]);
}

export default function A4({ sale = {}, invoiceSettings = {}, generatedAt }) {
    const [printing, setPrinting] = useState(false);
    const symbol = invoiceSettings.currency_symbol || "৳";
    const items = Array.isArray(sale.items) ? sale.items : [];
    const companyName = invoiceSettings.company_name || "NuhaMart";

    const customerLines = useMemo(
        () => [
            sale.customer?.phone,
            sale.customer?.email,
            sale.customer?.address,
        ].filter(Boolean),
        [sale.customer],
    );

    const printInvoice = async () => {
        setPrinting(true);
        await waitForPrintAssets();
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        window.print();
        setPrinting(false);
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("autoprint") === "1") {
            const timer = window.setTimeout(printInvoice, 350);
            return () => window.clearTimeout(timer);
        }
    }, []);

    return (
        <>
            <Head title={`Invoice ${sale.sale_number ?? ""}`} />

            <style>{`
                @page { size: A4 portrait; margin: 10mm; }
                @media print {
                    html, body { background: #fff !important; }
                    .screen-only { display: none !important; }
                    .invoice-sheet { box-shadow: none !important; border: 0 !important; margin: 0 !important; width: 100% !important; }
                    thead { display: table-header-group; }
                    tr, td, th { break-inside: avoid; }
                }
            `}</style>

            <main className="min-h-screen bg-slate-100 px-4 py-6 text-slate-900 print:bg-white print:p-0">
                <div className="screen-only mx-auto mb-4 flex max-w-5xl flex-wrap justify-end gap-2">
                    <Link href={route("admin.sales.show", sale.id)} className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700">
                        Back to Sale
                    </Link>
                    <Link href={route("admin.invoices.thermal", sale.id, { size: 80 })} className="rounded-lg bg-slate-700 px-4 py-2 font-semibold text-white">
                        80mm Receipt
                    </Link>
                    <Link href={route("admin.invoices.thermal", sale.id, { size: 58 })} className="rounded-lg bg-slate-700 px-4 py-2 font-semibold text-white">
                        58mm Receipt
                    </Link>
                    <a href={route("admin.invoices.pdf", sale.id)} className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white">
                        Download PDF
                    </a>
                    <button type="button" onClick={printInvoice} disabled={printing} className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white disabled:opacity-60">
                        {printing ? "Preparing…" : "Print / Save PDF"}
                    </button>
                </div>

                <article className="invoice-sheet mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
                    <header className="flex items-start justify-between gap-8 border-b-2 border-blue-600 pb-7">
                        <div className="flex items-start gap-4">
                            {invoiceSettings.logo && <img src={invoiceSettings.logo} alt={companyName} className="h-16 w-16 rounded-xl object-contain" />}
                            <div>
                                <h1 className="text-3xl font-black text-blue-700">{companyName}</h1>
                                <p className="mt-1 text-sm text-slate-500">{invoiceSettings.company_tagline || "Inventory & POS System"}</p>
                                <div className="mt-2 max-w-xl text-xs leading-5 text-slate-500">
                                    {[invoiceSettings.address, invoiceSettings.phone, invoiceSettings.email, invoiceSettings.website].filter(Boolean).map((line) => <div key={line}>{line}</div>)}
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">Sales Invoice</p>
                            <h2 className="mt-2 text-xl font-black">{sale.sale_number || `#${sale.id}`}</h2>
                            <p className="mt-1 text-sm text-slate-500">{dateTime(sale.created_at)}</p>
                            <span className="mt-3 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase text-emerald-700">{sale.payment_status || "Due"}</span>
                        </div>
                    </header>

                    <section className="grid grid-cols-2 gap-8 border-b border-slate-200 py-6">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Bill To</p>
                            <p className="mt-2 text-lg font-bold">{sale.customer?.name || "Walk-in Customer"}</p>
                            {customerLines.map((line) => <p key={line} className="mt-1 text-sm text-slate-500">{line}</p>)}
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Transaction</p>
                            <p className="mt-2 text-sm"><strong>Served by:</strong> {sale.user?.name || "Administrator"}</p>
                            <p className="mt-1 text-sm capitalize"><strong>Payment:</strong> {(sale.payment_method || "cash").replaceAll("_", " ")}</p>
                            <p className="mt-1 text-sm capitalize"><strong>Status:</strong> {sale.sale_status || "completed"}</p>
                        </div>
                    </section>

                    <section className="py-6">
                        <table className="w-full border-collapse text-sm">
                            <thead>
                                <tr className="bg-blue-700 text-white">
                                    <th className="px-4 py-3 text-left">#</th>
                                    <th className="px-4 py-3 text-left">Product</th>
                                    <th className="px-4 py-3 text-center">Qty</th>
                                    <th className="px-4 py-3 text-right">Price</th>
                                    <th className="px-4 py-3 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => (
                                    <tr key={item.id ?? index} className="border-b border-slate-200">
                                        <td className="px-4 py-3">{index + 1}</td>
                                        <td className="px-4 py-3 font-semibold">{item.product?.name || `Product #${item.product_id}`}<div className="text-xs font-normal text-slate-400">{item.product?.sku || item.product?.barcode || ""}</div></td>
                                        <td className="px-4 py-3 text-center">{item.quantity}</td>
                                        <td className="px-4 py-3 text-right">{money(item.price, symbol)}</td>
                                        <td className="px-4 py-3 text-right font-bold">{money(item.subtotal, symbol)}</td>
                                    </tr>
                                ))}
                                {items.length === 0 && <tr><td colSpan={5} className="py-10 text-center text-slate-500">No sale items found.</td></tr>}
                            </tbody>
                        </table>
                    </section>

                    <section className="grid grid-cols-[1fr_340px] gap-8 border-t border-slate-200 pt-6">
                        <div>
                            {sale.note && <><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Note</p><p className="mt-2 whitespace-pre-line text-sm text-slate-600">{sale.note}</p></>}
                            {Number(sale.returned_total ?? 0) > 0 && <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">Original: {money(sale.original_total, symbol)} · Returned: {money(sale.returned_total, symbol)} · Net: {money(sale.net_total, symbol)}</div>}
                        </div>
                        <div className="space-y-3 rounded-xl bg-slate-50 p-5">
                            <Row label="Subtotal" value={money(sale.subtotal, symbol)} />
                            <Row label="Discount" value={`-${money(sale.discount, symbol)}`} />
                            <Row label="Tax" value={money(sale.tax, symbol)} />
                            <Row label="Shipping" value={money(sale.shipping, symbol)} />
                            <div className="border-t border-dashed border-slate-300 pt-3"><Row label="Total" value={money(sale.total, symbol)} strong /></div>
                            <Row label="Paid" value={money(sale.paid_amount, symbol)} />
                            <Row label="Due" value={money(sale.due_amount, symbol)} strong />
                        </div>
                    </section>

                    <footer className="mt-10 border-t border-slate-200 pt-5 text-center text-sm text-slate-500">
                        <p className="font-semibold text-slate-700">{invoiceSettings.invoice_footer || `Thank you for shopping with ${companyName}.`}</p>
                        <p className="mt-1 text-xs">Electronically generated on {dateTime(generatedAt)}.</p>
                    </footer>
                </article>
            </main>
        </>
    );
}

function Row({ label, value, strong = false }) {
    return <div className={`flex justify-between gap-4 ${strong ? "text-lg font-black" : "text-sm"}`}><span>{label}</span><span>{value}</span></div>;
}

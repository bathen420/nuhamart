import { Head, Link } from "@inertiajs/react";
import { useEffect, useState } from "react";

const money = (value, symbol) => `${symbol}${Number(value ?? 0).toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const when = (value) => value ? new Date(value).toLocaleString("en-BD") : "—";

async function readyToPrint() {
    await (document.fonts?.ready ?? Promise.resolve());
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

export default function Thermal({ sale = {}, invoiceSettings = {}, paperSize = 80 }) {
    const [printing, setPrinting] = useState(false);
    const width = paperSize === 58 ? "58mm" : "80mm";
    const symbol = invoiceSettings.currency_symbol || "৳";
    const items = Array.isArray(sale.items) ? sale.items : [];

    const printReceipt = async () => {
        setPrinting(true);
        await readyToPrint();
        window.print();
        setPrinting(false);
    };

    useEffect(() => {
        if (new URLSearchParams(window.location.search).get("autoprint") === "1") {
            const timer = setTimeout(printReceipt, 300);
            return () => clearTimeout(timer);
        }
    }, []);

    return (
        <>
            <Head title={`${paperSize}mm Receipt ${sale.sale_number ?? ""}`} />
            <style>{`
                @page { size: ${width} auto; margin: 2mm; }
                @media print {
                    html, body { width: ${width}; margin: 0 !important; padding: 0 !important; background: #fff !important; }
                    .screen-only { display: none !important; }
                    .receipt { width: ${width} !important; max-width: ${width} !important; margin: 0 !important; box-shadow: none !important; }
                }
            `}</style>
            <main className="min-h-screen bg-slate-100 py-6 font-mono text-black print:bg-white print:p-0">
                <div className="screen-only mx-auto mb-4 flex max-w-xl flex-wrap justify-center gap-2 px-4">
                    <Link href={route("admin.sales.show", sale.id)} className="rounded bg-slate-700 px-4 py-2 font-sans text-white">Back</Link>
                    <Link href={route("admin.invoices.a4", sale.id)} className="rounded bg-blue-700 px-4 py-2 font-sans text-white">A4 Invoice</Link>
                    <Link href={route("admin.invoices.thermal", sale.id, { size: paperSize === 58 ? 80 : 58 })} className="rounded bg-indigo-700 px-4 py-2 font-sans text-white">Switch to {paperSize === 58 ? "80mm" : "58mm"}</Link>
                    <button onClick={printReceipt} disabled={printing} className="rounded bg-emerald-600 px-4 py-2 font-sans text-white">{printing ? "Preparing…" : "Print Receipt"}</button>
                </div>

                <article id="print-invoice" className="print-document receipt mx-auto bg-white p-2 text-[11px] leading-4 shadow" style={{ width }}>
                    <header className="text-center">
                        {invoiceSettings.logo && <img src={invoiceSettings.logo} alt="Logo" className="mx-auto mb-1 h-10 max-w-[36mm] object-contain" />}
                        <h1 className="text-base font-black">{invoiceSettings.company_name || "NuhaMart"}</h1>
                        <p>{invoiceSettings.company_tagline || "Inventory & POS System"}</p>
                        {invoiceSettings.address && <p>{invoiceSettings.address}</p>}
                        {[invoiceSettings.phone, invoiceSettings.email].filter(Boolean).map((line) => <p key={line}>{line}</p>)}
                    </header>

                    <div className="my-2 border-t border-dashed border-black" />
                    <p><b>Invoice:</b> {sale.sale_number || sale.id}</p>
                    <p><b>Date:</b> {when(sale.created_at)}</p>
                    <p><b>Customer:</b> {sale.customer?.name || "Walk-in Customer"}</p>
                    {sale.customer?.phone && <p><b>Phone:</b> {sale.customer.phone}</p>}
                    <p><b>Cashier:</b> {sale.user?.name || "Administrator"}</p>
                    <p><b>Payment:</b> {sale.payment_method || "Cash"}</p>
                    <div className="my-2 border-t border-dashed border-black" />

                    <table className="w-full table-fixed">
                        <thead><tr><th className="w-[47%] text-left">Item</th><th className="w-[12%] text-center">Qty</th><th className="w-[20%] text-right">Price</th><th className="w-[21%] text-right">Amount</th></tr></thead>
                        <tbody>{items.map((item, index) => <tr key={item.id ?? index} className="align-top"><td className="break-words pr-1">{item.product?.name || `Product ${item.product_id}`}</td><td className="text-center">{item.quantity}</td><td className="text-right">{Number(item.price ?? 0).toFixed(2)}</td><td className="text-right">{Number(item.subtotal ?? 0).toFixed(2)}</td></tr>)}</tbody>
                    </table>

                    <div className="my-2 border-t border-dashed border-black" />
                    <Line label="Subtotal" value={money(sale.subtotal, symbol)} />
                    <Line label="Discount" value={`-${money(sale.discount, symbol)}`} />
                    <Line label="Tax" value={money(sale.tax, symbol)} />
                    <Line label="Shipping" value={money(sale.shipping, symbol)} />
                    <Line label="TOTAL" value={money(sale.total, symbol)} bold />
                    <Line label="Paid" value={money(sale.paid_amount, symbol)} />
                    <Line label="Due" value={money(sale.due_amount, symbol)} bold />
                    {Number(sale.returned_total ?? 0) > 0 && <><div className="my-2 border-t border-dashed border-black" /><Line label="Returned" value={money(sale.returned_total, symbol)} /><Line label="Net Sale" value={money(sale.net_total, symbol)} bold /></>}

                    <div className="my-2 border-t border-dashed border-black" />
                    <footer className="text-center"><p className="font-bold">{invoiceSettings.invoice_footer || "Thank you for your purchase."}</p><p className="mt-1">Powered by NuhaMart</p></footer>
                </article>
            </main>
        </>
    );
}

function Line({ label, value, bold = false }) {
    return <div className={`flex justify-between gap-2 ${bold ? "text-[12px] font-black" : ""}`}><span>{label}</span><span>{value}</span></div>;
}

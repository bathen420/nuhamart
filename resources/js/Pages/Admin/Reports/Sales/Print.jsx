import { Head, usePage } from "@inertiajs/react";
import { LoaderCircle, Printer, X } from "lucide-react";
import { useEffect, useState } from "react";

function money(value) {
    const number = Number(value ?? 0);

    return new Intl.NumberFormat("en-BD", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number.isFinite(number) ? number : 0);
}

function dateTime(value) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
    });
}

function waitForNextPaint() {
    return new Promise((resolve) => {
        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(resolve);
        });
    });
}

async function waitForImages() {
    const images = Array.from(document.images);

    await Promise.all(
        images.map(async (image) => {
            if (!image.complete) {
                await new Promise((resolve) => {
                    image.addEventListener("load", resolve, { once: true });
                    image.addEventListener("error", resolve, { once: true });
                });
            }

            if (typeof image.decode === "function") {
                try {
                    await image.decode();
                } catch {
                    // A broken or cross-origin image must not block printing.
                }
            }
        })
    );
}

export default function Print({
    sales = [],
    summary = {},
    filters = {},
    generatedAt,
    generatedBy,
}) {
    const { businessSettings = {} } = usePage().props;
    const [printReady, setPrintReady] = useState(false);

    const companyName = businessSettings.company_name ?? "Nuha Mart BD";
    const currency = businessSettings.currency_symbol ?? "৳";
    const rows = Array.isArray(sales) ? sales : [];

    useEffect(() => {
        let cancelled = false;
        let printTimer;

        const preparePrint = async () => {
            try {
                if (document.fonts?.ready) {
                    await document.fonts.ready;
                }

                await waitForImages();
                await waitForNextPaint();

                // Chrome may need one additional paint cycle after Inertia mounts.
                await new Promise((resolve) => window.setTimeout(resolve, 450));
                await waitForNextPaint();

                if (cancelled) return;

                setPrintReady(true);

                printTimer = window.setTimeout(() => {
                    if (!cancelled) {
                        window.print();
                    }
                }, 300);
            } catch {
                if (!cancelled) {
                    setPrintReady(true);
                }
            }
        };

        preparePrint();

        return () => {
            cancelled = true;
            window.clearTimeout(printTimer);
        };
    }, []);

    const printReport = async () => {
        if (document.fonts?.ready) {
            await document.fonts.ready;
        }

        await waitForImages();
        await waitForNextPaint();
        window.print();
    };

    return (
        <>
            <Head title="Print Sales Report" />

            <style>{`
                @page {
                    size: A4 landscape;
                    margin: 10mm;
                }

                html,
                body,
                #app {
                    min-height: 100%;
                }

                @media print {
                    html,
                    body,
                    #app {
                        width: auto !important;
                        min-width: 0 !important;
                        height: auto !important;
                        min-height: 0 !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        overflow: visible !important;
                        background: #ffffff !important;
                    }

                    body {
                        print-color-adjust: exact !important;
                        -webkit-print-color-adjust: exact !important;
                    }

                    .no-print {
                        display: none !important;
                    }

                    .print-root {
                        display: block !important;
                        width: auto !important;
                        min-height: 0 !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        overflow: visible !important;
                        background: #ffffff !important;
                    }

                    .print-sheet {
                        display: block !important;
                        position: static !important;
                        width: 277mm !important;
                        max-width: 277mm !important;
                        min-height: 0 !important;
                        margin: 0 auto !important;
                        padding: 0 !important;
                        overflow: visible !important;
                        border: 0 !important;
                        border-radius: 0 !important;
                        box-shadow: none !important;
                        background: #ffffff !important;
                    }

                    .print-sheet,
                    .print-sheet * {
                        visibility: visible !important;
                    }

                    thead {
                        display: table-header-group !important;
                    }

                    tfoot {
                        display: table-footer-group !important;
                    }

                    table {
                        width: 100% !important;
                        border-collapse: collapse !important;
                    }

                    tr,
                    td,
                    th,
                    .print-summary {
                        break-inside: avoid !important;
                        page-break-inside: avoid !important;
                    }

                    img {
                        max-width: 100% !important;
                    }
                }
            `}</style>

            <div className="print-root min-h-screen bg-slate-100 px-4 py-6 text-slate-900">
                <div className="no-print mx-auto mb-4 flex max-w-[297mm] items-center justify-end gap-2">
                    {!printReady && (
                        <span className="mr-auto inline-flex items-center gap-2 text-sm font-medium text-slate-600">
                            <LoaderCircle className="animate-spin" size={17} />
                            Preparing report for printing...
                        </span>
                    )}

                    <button
                        type="button"
                        onClick={printReport}
                        disabled={!printReady}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Printer size={18} /> Print / Save PDF
                    </button>

                    <button
                        type="button"
                        onClick={() => window.close()}
                        className="inline-flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-2 font-semibold text-white hover:bg-slate-800"
                    >
                        <X size={18} /> Close
                    </button>
                </div>

                <article className="print-sheet mx-auto w-full max-w-[297mm] rounded-xl border border-slate-200 bg-white p-8 shadow-lg">
                    <header className="flex items-start justify-between gap-8 border-b-2 border-blue-700 pb-5">
                        <div className="flex items-start gap-4">
                            {businessSettings.logo && (
                                <img
                                    src={businessSettings.logo}
                                    alt={companyName}
                                    className="h-16 w-16 object-contain"
                                />
                            )}

                            <div>
                                <h1 className="text-3xl font-black text-blue-700">
                                    {companyName}
                                </h1>
                                <p className="mt-1 text-sm font-medium text-slate-600">
                                    {businessSettings.company_tagline ??
                                        "Inventory & POS System"}
                                </p>
                                <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
                                    {[
                                        businessSettings.address,
                                        businessSettings.phone,
                                        businessSettings.email,
                                    ]
                                        .filter(Boolean)
                                        .join(" · ")}
                                </p>
                            </div>
                        </div>

                        <div className="text-right">
                            <h2 className="text-2xl font-bold text-slate-900">
                                Sales Report
                            </h2>
                            <p className="mt-2 text-sm text-slate-600">
                                {filters.date_from} to {filters.date_to}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                                Generated: {generatedAt}
                            </p>
                            <p className="text-xs text-slate-500">
                                Prepared by: {generatedBy}
                            </p>
                        </div>
                    </header>

                    <section className="mt-5 grid grid-cols-5 gap-3">
                        <PrintSummary
                            label="Gross Sales"
                            value={`${currency}${money(summary.gross_sales)}`}
                        />
                        <PrintSummary
                            label="Sales Returns"
                            value={`${currency}${money(summary.sales_returns)}`}
                        />
                        <PrintSummary
                            label="Net Sales"
                            value={`${currency}${money(summary.net_sales)}`}
                        />
                        <PrintSummary
                            label="Sales Count"
                            value={summary.sales_count ?? 0}
                        />
                        <PrintSummary
                            label="Average Net Sale"
                            value={`${currency}${money(summary.average_sale)}`}
                        />
                    </section>

                    <table className="mt-5 w-full border-collapse text-xs">
                        <thead>
                            <tr className="bg-blue-700 text-white">
                                <th className="border border-blue-600 px-2 py-2 text-left">
                                    Sale No.
                                </th>
                                <th className="border border-blue-600 px-2 py-2 text-left">
                                    Date
                                </th>
                                <th className="border border-blue-600 px-2 py-2 text-left">
                                    Customer
                                </th>
                                <th className="border border-blue-600 px-2 py-2 text-left">
                                    Payment
                                </th>
                                <th className="border border-blue-600 px-2 py-2 text-right">
                                    Gross
                                </th>
                                <th className="border border-blue-600 px-2 py-2 text-right">
                                    Returned
                                </th>
                                <th className="border border-blue-600 px-2 py-2 text-right">
                                    Net
                                </th>
                                <th className="border border-blue-600 px-2 py-2 text-left">
                                    Status
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {rows.length > 0 ? (
                                rows.map((sale, index) => (
                                    <tr
                                        key={sale.id}
                                        className={
                                            index % 2 === 0
                                                ? "bg-white"
                                                : "bg-slate-50"
                                        }
                                    >
                                        <td className="border border-slate-300 px-2 py-2 font-semibold">
                                            {sale.sale_number}
                                        </td>
                                        <td className="border border-slate-300 px-2 py-2">
                                            {dateTime(sale.created_at)}
                                        </td>
                                        <td className="border border-slate-300 px-2 py-2">
                                            {sale.customer?.name ??
                                                "Walk-in Customer"}
                                        </td>
                                        <td className="border border-slate-300 px-2 py-2">
                                            {sale.payment_method} /{" "}
                                            {sale.payment_status}
                                        </td>
                                        <td className="border border-slate-300 px-2 py-2 text-right font-semibold">
                                            {currency}
                                            {money(sale.gross_total)}
                                        </td>
                                        <td className="border border-slate-300 px-2 py-2 text-right font-semibold text-red-700">
                                            {currency}
                                            {money(sale.returned_total)}
                                        </td>
                                        <td className="border border-slate-300 px-2 py-2 text-right font-bold text-green-800">
                                            {currency}
                                            {money(sale.net_total)}
                                        </td>
                                        <td className="border border-slate-300 px-2 py-2">
                                            {sale.return_status_label}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="border border-slate-300 px-3 py-10 text-center text-slate-500"
                                    >
                                        No sales found for the selected filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>

                        <tfoot>
                            <tr className="bg-blue-50 font-bold">
                                <td
                                    colSpan={4}
                                    className="border border-slate-300 px-2 py-2 text-right"
                                >
                                    Grand Total
                                </td>
                                <td className="border border-slate-300 px-2 py-2 text-right">
                                    {currency}
                                    {money(summary.gross_sales)}
                                </td>
                                <td className="border border-slate-300 px-2 py-2 text-right text-red-700">
                                    {currency}
                                    {money(summary.sales_returns)}
                                </td>
                                <td className="border border-slate-300 px-2 py-2 text-right text-green-800">
                                    {currency}
                                    {money(summary.net_sales)}
                                </td>
                                <td className="border border-slate-300 px-2 py-2" />
                            </tr>
                        </tfoot>
                    </table>

                    <footer className="mt-6 flex items-end justify-between border-t border-slate-300 pt-4 text-xs text-slate-500">
                        <p>
                            {businessSettings.invoice_footer ??
                                `Generated by ${companyName}.`}
                        </p>
                        <p>Gross − Returns = Net Sales</p>
                    </footer>
                </article>
            </div>
        </>
    );
}

function PrintSummary({ label, value }) {
    return (
        <div className="print-summary rounded-lg border border-slate-300 bg-slate-50 px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                {label}
            </p>
            <p className="mt-1 text-base font-bold text-slate-900">{value}</p>
        </div>
    );
}

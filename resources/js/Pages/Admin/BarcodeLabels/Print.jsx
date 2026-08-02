import { Head, Link, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import BarcodeSvg from "@/Components/Barcode/BarcodeSvg";

export default function Print({ labels = [], preset = {}, options = {} }) {
    const { businessSettings = {} } = usePage().props;
    const [ready, setReady] = useState(false);
    const companyName = businessSettings.company_name ?? "NuhaMart";
    const width = Number(preset.width_mm ?? 50);
    const height = Number(preset.height_mm ?? 25);
    const columns = Number(preset.columns ?? 4);

    useEffect(() => {
        const timer = window.setTimeout(() => setReady(true), 250);
        return () => window.clearTimeout(timer);
    }, []);

    const printNow = () => {
        window.requestAnimationFrame(() => window.setTimeout(() => window.print(), 100));
    };

    return (
        <>
            <Head title="Print Barcode Labels" />
            <style>{`
                body { background: #eef2f7; }
                .label-sheet { display:grid; grid-template-columns:repeat(${columns}, ${width}mm); gap:2mm; align-content:start; justify-content:center; }
                .barcode-label { width:${width}mm; height:${height}mm; box-sizing:border-box; overflow:hidden; break-inside:avoid; page-break-inside:avoid; }
                @media print {
                    @page { size:A4 portrait; margin:7mm; }
                    html, body { background:#fff !important; width:auto !important; height:auto !important; overflow:visible !important; }
                    body * { visibility:visible !important; }
                    .screen-toolbar { display:none !important; }
                    #print-invoice { position:static !important; width:auto !important; margin:0 !important; padding:0 !important; }
                    .label-sheet { gap:2mm !important; }
                    .barcode-label { border:0.2mm solid #d1d5db !important; }
                }
            `}</style>

            <div className="screen-toolbar sticky top-0 z-20 flex items-center justify-between border-b bg-white px-5 py-3 shadow-sm">
                <div><h1 className="font-bold text-gray-900">Barcode Labels</h1><p className="text-sm text-gray-500">{labels.length} labels · {preset.label ?? `${width} × ${height} mm`}</p></div>
                <div className="flex gap-2"><Link href={route("admin.barcode-labels.index")} className="rounded-lg border px-4 py-2">Back</Link><button disabled={!ready || labels.length === 0} onClick={printNow} className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white disabled:opacity-50">{ready ? "Print Labels" : "Preparing…"}</button></div>
            </div>

            <main id="print-invoice" className="print-document mx-auto min-h-screen bg-white p-[7mm]">
                {labels.length > 0 ? <div className="label-sheet">
                    {labels.map((label, index) => <article key={`${label.id}-${index}`} className="barcode-label flex flex-col items-center justify-center border border-gray-300 bg-white px-[1.5mm] py-[1mm] text-center text-black">
                        {options.show_company && <div className="max-w-full truncate text-[7px] font-bold uppercase leading-tight">{companyName}</div>}
                        {options.show_name && <div className="mt-[0.5mm] max-w-full truncate text-[8px] font-semibold leading-tight">{label.name}</div>}
                        <BarcodeSvg value={label.barcode} type={label.barcode_type} height={42} showText className="mt-[0.6mm] h-[11mm] w-full" />
                        <div className="flex w-full items-center justify-between gap-1 text-[7px] leading-none">
                            {options.show_sku ? <span className="max-w-[65%] truncate font-mono">{label.sku}</span> : <span />}
                            {options.show_price && <span className="whitespace-nowrap font-bold">৳{Number(label.price ?? 0).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</span>}
                        </div>
                    </article>)}
                </div> : <div className="py-20 text-center text-gray-500">No labels selected.</div>}
            </main>
        </>
    );
}

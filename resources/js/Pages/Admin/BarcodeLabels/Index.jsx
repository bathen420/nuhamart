import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { useMemo, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import BarcodeSvg from "@/Components/Barcode/BarcodeSvg";

export default function Index({ items = {}, filters = {}, categories = [], brands = [], presets = {} }) {
    const { flash = {} } = usePage().props;
    const rows = Array.isArray(items?.data) ? items.data : [];
    const [selected, setSelected] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [preset, setPreset] = useState("50x25");
    const [custom, setCustom] = useState({ width_mm: 50, height_mm: 25, columns: 4 });
    const [options, setOptions] = useState({ show_name: true, show_price: true, show_sku: true, show_company: true });
    const source = filters?.source ?? "products";
    const filterForm = useForm({
        search: filters?.search ?? "",
        source,
        category_id: filters?.category_id ?? "",
        brand_id: filters?.brand_id ?? "",
        per_page: filters?.per_page ?? 25,
    });

    const allSelected = rows.length > 0 && rows.every((row) => selected.includes(row.id));
    const selectedRows = useMemo(() => rows.filter((row) => selected.includes(row.id)), [rows, selected]);

    const submitFilters = (event) => {
        event.preventDefault();
        router.get(route("admin.barcode-labels.index"), filterForm.data, { preserveState: true, replace: true });
    };

    const toggleAll = () => setSelected(allSelected ? selected.filter((id) => !rows.some((row) => row.id === id)) : [...new Set([...selected, ...rows.map((row) => row.id)])]);
    const toggle = (id) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

    const generate = (type) => {
        if (!selected.length) return window.alert("Select at least one item.");
        router.post(route("admin.barcode-labels.generate"), { source, ids: selected, barcode_type: type, only_missing: false }, { preserveScroll: true });
    };

    const printLabels = () => {
        if (!selected.length) return window.alert("Select at least one item.");
        const params = new URLSearchParams();
        params.set("source", source);
        params.set("preset", preset);
        if (preset === "custom") {
            params.set("width_mm", custom.width_mm);
            params.set("height_mm", custom.height_mm);
            params.set("columns", custom.columns);
        }
        selected.forEach((id) => {
            params.append("ids[]", id);
            params.set(`quantities[${id}]`, quantities[id] ?? 1);
        });
        Object.entries(options).forEach(([key, value]) => params.set(key, value ? "1" : "0"));
        window.open(`${route("admin.barcode-labels.print")}?${params.toString()}`, "_blank", "noopener,noreferrer");
    };

    return (
        <AuthenticatedLayout header={<div><h2 className="text-xl font-semibold text-gray-800">Barcode & Label Printing</h2><p className="mt-1 text-sm text-gray-500">Generate and print product or variant labels.</p></div>}>
            <Head title="Barcode & Labels" />
            <div className="space-y-5">
                {(flash.success || flash.error) && <div className={`rounded-lg border px-4 py-3 text-sm ${flash.success ? "border-green-200 bg-green-50 text-green-800" : "border-red-200 bg-red-50 text-red-800"}`}>{flash.success ?? flash.error}</div>}

                <form onSubmit={submitFilters} className="grid gap-3 rounded-xl border bg-white p-4 shadow-sm md:grid-cols-6">
                    <input className="rounded-lg border-gray-300 md:col-span-2" value={filterForm.data.search} onChange={(e) => filterForm.setData("search", e.target.value)} placeholder="Search name, SKU or barcode" />
                    <select className="rounded-lg border-gray-300" value={filterForm.data.source} onChange={(e) => filterForm.setData("source", e.target.value)}><option value="products">Products</option><option value="variants">Variants</option></select>
                    <select className="rounded-lg border-gray-300" value={filterForm.data.category_id} onChange={(e) => filterForm.setData("category_id", e.target.value)}><option value="">All Categories</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
                    <select className="rounded-lg border-gray-300" value={filterForm.data.brand_id} onChange={(e) => filterForm.setData("brand_id", e.target.value)}><option value="">All Brands</option>{brands.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
                    <button className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white">Filter</button>
                </form>

                <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
                    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50"><tr><th className="px-4 py-3"><input type="checkbox" checked={allSelected} onChange={toggleAll} /></th><th className="px-4 py-3 text-left">Item</th><th className="px-4 py-3 text-left">SKU</th><th className="px-4 py-3 text-left">Barcode</th><th className="px-4 py-3 text-right">Price</th><th className="px-4 py-3 text-center">Qty</th></tr></thead>
                                <tbody className="divide-y divide-gray-100">
                                    {rows.map((row) => {
                                        const name = source === "variants" ? `${row.product?.name ?? "Product"} - ${row.name ?? row.sku}` : row.name;
                                        const price = source === "variants" ? row.selling_price : (row.discount_price ?? row.price);
                                        const barcode = row.barcode || row.sku;
                                        const type = source === "products" ? (row.barcode_type ?? (/^\d{13}$/.test(barcode ?? "") ? "ean13" : "code128")) : (/^\d{13}$/.test(barcode ?? "") ? "ean13" : "code128");
                                        return <tr key={row.id} className={selected.includes(row.id) ? "bg-blue-50" : ""}>
                                            <td className="px-4 py-3"><input type="checkbox" checked={selected.includes(row.id)} onChange={() => toggle(row.id)} /></td>
                                            <td className="px-4 py-3 font-medium text-gray-900">{name}</td>
                                            <td className="px-4 py-3 font-mono text-sm">{row.sku}</td>
                                            <td className="px-4 py-2"><div className="w-44"><BarcodeSvg value={barcode} type={type} height={30} className="h-10 w-full" /></div></td>
                                            <td className="px-4 py-3 text-right">৳{Number(price ?? 0).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</td>
                                            <td className="px-4 py-3 text-center"><input type="number" min="1" max="500" className="w-20 rounded border-gray-300 text-center" value={quantities[row.id] ?? 1} onChange={(e) => setQuantities((current) => ({ ...current, [row.id]: Math.max(1, Number(e.target.value) || 1) }))} /></td>
                                        </tr>;
                                    })}
                                    {!rows.length && <tr><td colSpan="6" className="px-4 py-12 text-center text-gray-500">No items found.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                        {Array.isArray(items?.links) && items.links.length > 3 && <div className="flex flex-wrap gap-1 border-t p-4">{items.links.map((link, i) => link.url ? <Link key={i} href={link.url} preserveState className={`rounded border px-3 py-2 text-sm ${link.active ? "bg-blue-600 text-white" : "bg-white"}`} dangerouslySetInnerHTML={{ __html: link.label }} /> : <span key={i} className="rounded border bg-gray-100 px-3 py-2 text-sm text-gray-400" dangerouslySetInnerHTML={{ __html: link.label }} />)}</div>}
                    </div>

                    <aside className="space-y-4 rounded-xl border bg-white p-5 shadow-sm">
                        <div><h3 className="font-semibold text-gray-900">Selected items</h3><p className="text-sm text-gray-500">{selectedRows.length} selected on this page</p></div>
                        <div className="grid grid-cols-2 gap-2"><button onClick={() => generate("code128")} className="rounded-lg bg-gray-800 px-3 py-2 text-sm font-semibold text-white">Generate Code 128</button><button onClick={() => generate("ean13")} className="rounded-lg bg-purple-600 px-3 py-2 text-sm font-semibold text-white">Generate EAN-13</button></div>
                        <label className="block text-sm font-medium">Label preset<select value={preset} onChange={(e) => setPreset(e.target.value)} className="mt-1 w-full rounded-lg border-gray-300">{Object.entries(presets).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select></label>
                        {preset === "custom" && <div className="grid grid-cols-3 gap-2">
                            <label className="text-xs text-gray-600">Width mm<input type="number" min="20" max="210" value={custom.width_mm} onChange={(e) => setCustom((v) => ({ ...v, width_mm: e.target.value }))} className="mt-1 w-full rounded border-gray-300" /></label>
                            <label className="text-xs text-gray-600">Height mm<input type="number" min="15" max="297" value={custom.height_mm} onChange={(e) => setCustom((v) => ({ ...v, height_mm: e.target.value }))} className="mt-1 w-full rounded border-gray-300" /></label>
                            <label className="text-xs text-gray-600">Columns<input type="number" min="1" max="8" value={custom.columns} onChange={(e) => setCustom((v) => ({ ...v, columns: e.target.value }))} className="mt-1 w-full rounded border-gray-300" /></label>
                        </div>}
                        <div className="space-y-2">{Object.entries({ show_name: "Product name", show_price: "Selling price", show_sku: "SKU", show_company: "Company name" }).map(([key, label]) => <label key={key} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={options[key]} onChange={(e) => setOptions((current) => ({ ...current, [key]: e.target.checked }))} />{label}</label>)}</div>
                        <button onClick={printLabels} className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700">Print {selected.reduce((sum, id) => sum + Number(quantities[id] ?? 1), 0)} Label(s)</button>
                    </aside>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

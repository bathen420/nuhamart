import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const emptyItem = () => ({
    product_id: "",
    quantity: 1,
    price: 0,
    subtotal: 0,
});

const toNumber = (value) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
};

export default function Create({ auth, suppliers = [], products = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        purchase_number: `PUR-${Date.now()}`,
        supplier_id: "",
        subtotal: 0,
        discount: 0,
        shipping: 0,
        total: 0,
        note: "",
        items: [emptyItem()],
    });

    const calculateTotals = (items, discount = data.discount, shipping = data.shipping) => {
        const subtotal = items.reduce(
            (sum, item) => sum + toNumber(item.subtotal),
            0,
        );
        const total = Math.max(
            0,
            subtotal - toNumber(discount) + toNumber(shipping),
        );

        return { subtotal, total };
    };

    const updateItem = (index, field, value) => {
        const items = data.items.map((item, itemIndex) => {
            if (itemIndex !== index) return item;

            const updated = { ...item, [field]: value };

            if (field === "product_id") {
                const product = products.find(
                    (entry) => String(entry.id) === String(value),
                );
                updated.price = product ? toNumber(product.price) : 0;
            }

            updated.quantity = Math.max(1, toNumber(updated.quantity));
            updated.price = Math.max(0, toNumber(updated.price));
            updated.subtotal = updated.quantity * updated.price;

            return updated;
        });

        const totals = calculateTotals(items);
        setData((current) => ({ ...current, items, ...totals }));
    };

    const addRow = () => {
        setData("items", [...data.items, emptyItem()]);
    };

    const removeRow = (index) => {
        const items = data.items.filter((_, itemIndex) => itemIndex !== index);
        const safeItems = items.length > 0 ? items : [emptyItem()];
        const totals = calculateTotals(safeItems);
        setData((current) => ({ ...current, items: safeItems, ...totals }));
    };

    const updateAdjustment = (field, value) => {
        const totals = calculateTotals(
            data.items,
            field === "discount" ? value : data.discount,
            field === "shipping" ? value : data.shipping,
        );
        setData((current) => ({ ...current, [field]: value, ...totals }));
    };

    const submit = (event) => {
        event.preventDefault();
        post(route("admin.purchases.store"), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={<h2 className="text-xl font-semibold">New Purchase</h2>}
        >
            <Head title="New Purchase" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Create Purchase</h1>
                                    <p className="mt-1 text-sm text-gray-500">Add supplier purchase and increase product stock.</p>
                                </div>
                                <Link
                                    href={route("admin.purchases.index")}
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                >
                                    Back to Purchases
                                </Link>
                            </div>

                            {errors.error && (
                                <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                                    {errors.error}
                                </div>
                            )}

                            <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">Purchase Number</label>
                                    <input
                                        type="text"
                                        value={data.purchase_number}
                                        readOnly
                                        className="w-full rounded-lg border-gray-300 bg-gray-100"
                                    />
                                    {errors.purchase_number && <p className="mt-1 text-sm text-red-600">{errors.purchase_number}</p>}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">Supplier</label>
                                    <select
                                        value={data.supplier_id}
                                        onChange={(event) => setData("supplier_id", event.target.value)}
                                        className="w-full rounded-lg border-gray-300"
                                    >
                                        <option value="">Select Supplier</option>
                                        {suppliers.map((supplier) => (
                                            <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                                        ))}
                                    </select>
                                    {errors.supplier_id && <p className="mt-1 text-sm text-red-600">{errors.supplier_id}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">Products</h2>
                                <button type="button" onClick={addRow} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">+ Add Product</button>
                            </div>

                            {errors.items && <p className="mb-3 text-sm text-red-600">{errors.items}</p>}

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-3 py-3 text-left text-xs font-semibold uppercase text-gray-500">Product</th>
                                            <th className="px-3 py-3 text-left text-xs font-semibold uppercase text-gray-500">Qty</th>
                                            <th className="px-3 py-3 text-left text-xs font-semibold uppercase text-gray-500">Buy Price</th>
                                            <th className="px-3 py-3 text-left text-xs font-semibold uppercase text-gray-500">Subtotal</th>
                                            <th className="px-3 py-3 text-center text-xs font-semibold uppercase text-gray-500">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {data.items.map((item, index) => (
                                            <tr key={index}>
                                                <td className="min-w-64 px-3 py-3">
                                                    <select value={item.product_id} onChange={(event) => updateItem(index, "product_id", event.target.value)} className="w-full rounded-lg border-gray-300">
                                                        <option value="">Select Product</option>
                                                        {products.map((product) => (
                                                            <option key={product.id} value={product.id}>{product.name} ({product.sku || "No SKU"})</option>
                                                        ))}
                                                    </select>
                                                    {errors[`items.${index}.product_id`] && <p className="mt-1 text-xs text-red-600">{errors[`items.${index}.product_id`]}</p>}
                                                </td>
                                                <td className="w-32 px-3 py-3">
                                                    <input type="number" min="1" value={item.quantity} onChange={(event) => updateItem(index, "quantity", event.target.value)} className="w-full rounded-lg border-gray-300" />
                                                </td>
                                                <td className="w-44 px-3 py-3">
                                                    <input type="number" min="0" step="0.01" value={item.price} onChange={(event) => updateItem(index, "price", event.target.value)} className="w-full rounded-lg border-gray-300" />
                                                </td>
                                                <td className="w-44 px-3 py-3 font-semibold text-gray-900">৳ {toNumber(item.subtotal).toFixed(2)}</td>
                                                <td className="w-28 px-3 py-3 text-center">
                                                    <button type="button" onClick={() => removeRow(index)} className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100">Remove</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="grid gap-6 lg:grid-cols-2">
                            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                                <label className="mb-2 block text-sm font-semibold text-gray-700">Note</label>
                                <textarea rows="6" value={data.note} onChange={(event) => setData("note", event.target.value)} className="w-full rounded-lg border-gray-300" placeholder="Optional purchase note" />
                            </div>

                            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between"><span className="text-gray-600">Subtotal</span><strong>৳ {toNumber(data.subtotal).toFixed(2)}</strong></div>
                                    <div>
                                        <label className="mb-1 block text-sm font-semibold text-gray-700">Discount</label>
                                        <input type="number" min="0" step="0.01" value={data.discount} onChange={(event) => updateAdjustment("discount", event.target.value)} className="w-full rounded-lg border-gray-300" />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-semibold text-gray-700">Shipping</label>
                                        <input type="number" min="0" step="0.01" value={data.shipping} onChange={(event) => updateAdjustment("shipping", event.target.value)} className="w-full rounded-lg border-gray-300" />
                                    </div>
                                    <div className="flex items-center justify-between border-t pt-4 text-lg"><span className="font-semibold">Grand Total</span><strong>৳ {toNumber(data.total).toFixed(2)}</strong></div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Link href={route("admin.purchases.index")} className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50">Cancel</Link>
                            <button type="submit" disabled={processing} className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                                {processing ? "Saving..." : "Save Purchase"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

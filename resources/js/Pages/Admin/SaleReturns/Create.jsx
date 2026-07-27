import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useMemo } from "react";

export default function Create({ auth, sale, suggestedReturnDate }) {
    const { data, setData, post, processing, errors } = useForm({
        return_date: suggestedReturnDate,
        refund_method: "cash",
        reason: "",
        items: sale.items.map((item) => ({
            sale_item_id: item.id,
            quantity: 0,
        })),
    });

    const updateQuantity = (index, value) => {
        const items = [...data.items];
        const max = Number(sale.items[index].returnable_quantity || 0);
        items[index].quantity = Math.min(
            Math.max(0, Number(value || 0)),
            max
        );
        setData("items", items);
    };

    const total = useMemo(
        () =>
            data.items.reduce(
                (sum, row, index) =>
                    sum +
                    Number(row.quantity || 0) *
                        Number(sale.items[index].price || 0),
                0
            ),
        [data.items, sale.items]
    );

    const submit = (event) => {
        event.preventDefault();
        post(route("admin.sales.returns.store", sale.id));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Return ${sale.sale_number}`} />

            <div className="py-8">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Sales Return
                            </h1>
                            <p className="text-gray-500">
                                Invoice: {sale.sale_number}
                            </p>
                        </div>
                        <Link
                            href={route("admin.sales.show", sale.id)}
                            className="rounded-lg bg-gray-600 px-4 py-2 font-semibold text-white"
                        >
                            Back
                        </Link>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        {errors.items && (
                            <div className="rounded-lg bg-red-50 p-4 text-red-700">
                                {errors.items}
                            </div>
                        )}

                        <div className="grid gap-6 rounded-xl bg-white p-6 shadow md:grid-cols-3">
                            <label>
                                <span className="mb-2 block font-semibold">Return Date</span>
                                <input
                                    type="date"
                                    value={data.return_date}
                                    onChange={(e) => setData("return_date", e.target.value)}
                                    className="w-full rounded-lg border-gray-300"
                                />
                                {errors.return_date && (
                                    <span className="text-sm text-red-600">{errors.return_date}</span>
                                )}
                            </label>

                            <label>
                                <span className="mb-2 block font-semibold">Refund Method</span>
                                <select
                                    value={data.refund_method}
                                    onChange={(e) => setData("refund_method", e.target.value)}
                                    className="w-full rounded-lg border-gray-300"
                                >
                                    <option value="cash">Cash</option>
                                    <option value="card">Card</option>
                                    <option value="mobile_banking">Mobile Banking</option>
                                    <option value="bank_transfer">Bank Transfer</option>
                                    <option value="customer_due">Adjust Customer Due</option>
                                </select>
                            </label>

                            <div className="rounded-lg bg-blue-50 p-4">
                                <p className="text-sm text-blue-700">Return Total</p>
                                <p className="text-2xl font-black text-blue-900">
                                    BDT {total.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-xl bg-white shadow">
                            <table className="w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Product</th>
                                        <th className="px-4 py-3 text-center">Sold</th>
                                        <th className="px-4 py-3 text-center">Already Returned</th>
                                        <th className="px-4 py-3 text-right">Price</th>
                                        <th className="px-4 py-3 text-center">Return Qty</th>
                                        <th className="px-4 py-3 text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sale.items.map((item, index) => (
                                        <tr key={item.id} className="border-t">
                                            <td className="px-4 py-4 font-semibold">
                                                {item.product?.name || "Deleted product"}
                                            </td>
                                            <td className="px-4 py-4 text-center">{item.quantity}</td>
                                            <td className="px-4 py-4 text-center">{item.returned_quantity}</td>
                                            <td className="px-4 py-4 text-right">
                                                BDT {Number(item.price).toLocaleString("en-GB")}
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max={item.returnable_quantity}
                                                    value={data.items[index].quantity}
                                                    onChange={(e) => updateQuantity(index, e.target.value)}
                                                    className="w-24 rounded-lg border-gray-300 text-center"
                                                    disabled={item.returnable_quantity <= 0}
                                                />
                                                <div className="mt-1 text-xs text-gray-500">
                                                    Max: {item.returnable_quantity}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-right font-bold">
                                                BDT {(
                                                    Number(data.items[index].quantity || 0) *
                                                    Number(item.price || 0)
                                                ).toLocaleString("en-GB", {
                                                    minimumFractionDigits: 2,
                                                })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="rounded-xl bg-white p-6 shadow">
                            <label>
                                <span className="mb-2 block font-semibold">Return Reason</span>
                                <textarea
                                    rows="3"
                                    value={data.reason}
                                    onChange={(e) => setData("reason", e.target.value)}
                                    className="w-full rounded-lg border-gray-300"
                                    placeholder="Optional reason..."
                                />
                            </label>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing || total <= 0}
                                className="rounded-lg bg-red-600 px-6 py-3 font-bold text-white disabled:opacity-50"
                            >
                                {processing ? "Processing..." : "Complete Sales Return"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

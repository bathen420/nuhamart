import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Show({ auth, saleReturn }) {
    const money = (value) =>
        Number(value || 0).toLocaleString("en-GB", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={saleReturn.return_number} />

            <div className="py-8">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">{saleReturn.return_number}</h1>
                            <p className="text-gray-500">
                                Sale: {saleReturn.sale?.sale_number}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Link
                                href={route("admin.sale-returns.index")}
                                className="rounded-lg bg-gray-600 px-4 py-2 font-semibold text-white"
                            >
                                Back
                            </Link>
                            <button
                                onClick={() => window.print()}
                                className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white"
                            >
                                Print
                            </button>
                        </div>
                    </div>

                    <section id="print-invoice" className="rounded-xl bg-white p-8 shadow">
                        <div className="flex justify-between border-b-2 border-red-600 pb-5">
                            <div>
                                <h2 className="text-3xl font-black text-red-600">{companyName}</h2>
                                <p className="text-sm text-gray-500">Sales Return Invoice</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">{saleReturn.return_number}</p>
                                <p className="text-sm text-gray-500">{saleReturn.return_date}</p>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            <Info label="Original Invoice" value={saleReturn.sale?.sale_number} />
                            <Info label="Customer" value={saleReturn.customer?.name || "Walk-in Customer"} />
                            <Info label="Refund Method" value={saleReturn.refund_method} />
                            <Info label="Created By" value={saleReturn.user?.name || "—"} />
                        </div>

                        <table className="mt-6 w-full border-collapse">
                            <thead className="bg-red-600 text-white">
                                <tr>
                                    <th className="border p-3 text-left">#</th>
                                    <th className="border p-3 text-left">Product</th>
                                    <th className="border p-3 text-center">Qty</th>
                                    <th className="border p-3 text-right">Price</th>
                                    <th className="border p-3 text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {saleReturn.items.map((item, index) => (
                                    <tr key={item.id}>
                                        <td className="border p-3">{index + 1}</td>
                                        <td className="border p-3">{item.product?.name}</td>
                                        <td className="border p-3 text-center">{item.quantity}</td>
                                        <td className="border p-3 text-right">{currencySymbol}{money(item.price)}</td>
                                        <td className="border p-3 text-right font-bold">
                                            {currencySymbol}{money(item.subtotal)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="mt-6 ml-auto max-w-sm space-y-2">
                            <Info label="Return Total" value={`BDT ${money(saleReturn.subtotal)}`} />
                            <Info label="Refund Amount" value={`BDT ${money(saleReturn.refund_amount)}`} />
                        </div>

                        <div className="mt-6 rounded-lg border p-4">
                            <p className="font-bold">Reason</p>
                            <p className="mt-2 text-gray-600">
                                {saleReturn.reason || "No reason provided."}
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function Info({ label, value }) {
    return (
        <div className="flex justify-between border-b py-2">
            <span className="font-semibold text-gray-600">{label}</span>
            <span className="font-bold text-gray-900">{value}</span>
        </div>
    );
}

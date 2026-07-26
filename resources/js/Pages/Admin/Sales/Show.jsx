import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Show({ auth, sale }) {
    const money = (value) => Number(value ?? 0).toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return (
        <AuthenticatedLayout user={auth?.user} header={<h2 className="text-xl font-semibold text-gray-800">Sale Invoice</h2>}>
            <Head title={`Sale ${sale.sale_number}`} />
            <div className="mx-auto max-w-5xl space-y-5">
                <div className="flex justify-between"><Link href={route("admin.sales.index")} className="rounded border bg-white px-4 py-2">Back to Sales</Link><button onClick={() => window.print()} className="rounded bg-blue-600 px-4 py-2 text-white">Print</button></div>
                <div className="rounded-xl bg-white p-6 shadow">
                    <div className="mb-6 grid gap-4 sm:grid-cols-2"><div><p className="text-sm text-gray-500">Sale Number</p><p className="font-semibold">{sale.sale_number}</p></div><div><p className="text-sm text-gray-500">Customer</p><p className="font-semibold">{sale.customer?.name ?? "Walk-in Customer"}</p></div></div>
                    <div className="overflow-x-auto"><table className="min-w-full divide-y"><thead><tr><th className="py-3 text-left">Product</th><th className="py-3 text-right">Qty</th><th className="py-3 text-right">Price</th><th className="py-3 text-right">Subtotal</th></tr></thead><tbody className="divide-y">{(sale.items ?? []).map((item) => <tr key={item.id}><td className="py-3">{item.product?.name ?? "Product"}</td><td className="py-3 text-right">{item.quantity}</td><td className="py-3 text-right">৳{money(item.price)}</td><td className="py-3 text-right">৳{money(item.subtotal)}</td></tr>)}</tbody></table></div>
                    <div className="mt-6 ml-auto max-w-sm border-t pt-4"><div className="flex justify-between text-lg font-bold"><span>Total</span><span>৳{money(sale.total)}</span></div></div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

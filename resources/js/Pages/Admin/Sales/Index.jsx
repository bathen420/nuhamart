import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Index({ auth, sales, filters = {} }) {
    const [search, setSearch] = useState(filters.search ?? "");
    const submit = (event) => {
        event.preventDefault();
        router.get(route("admin.sales.index"), { search }, { preserveState: true, replace: true });
    };
    const money = (value) => Number(value ?? 0).toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <AuthenticatedLayout user={auth?.user} header={<h2 className="text-xl font-semibold text-gray-800">Sales</h2>}>
            <Head title="Sales" />
            <div className="mx-auto max-w-7xl space-y-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <form onSubmit={submit} className="flex w-full max-w-xl gap-2">
                        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search sale number or customer" className="w-full rounded-lg border-gray-300" />
                        <button className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white">Search</button>
                    </form>
                    <Link href={route("admin.pos.create")} className="rounded-lg bg-green-600 px-5 py-2 text-center font-semibold text-white">New Sale / POS</Link>
                </div>
                <div className="overflow-hidden rounded-xl bg-white shadow">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50"><tr><th className="px-5 py-3 text-left">Sale No.</th><th className="px-5 py-3 text-left">Customer</th><th className="px-5 py-3 text-left">Total</th><th className="px-5 py-3 text-left">Date</th><th className="px-5 py-3 text-right">Action</th></tr></thead>
                            <tbody className="divide-y divide-gray-100">
                                {(sales?.data ?? []).map((sale) => (
                                    <tr key={sale.id}><td className="px-5 py-4 font-medium">{sale.sale_number}</td><td className="px-5 py-4">{sale.customer?.name ?? "Walk-in Customer"}</td><td className="px-5 py-4">৳{money(sale.total)}</td><td className="px-5 py-4">{sale.created_at ? new Date(sale.created_at).toLocaleDateString("en-GB") : "—"}</td><td className="px-5 py-4 text-right"><Link href={route("admin.sales.show", sale.id)} className="rounded bg-blue-600 px-3 py-2 text-sm text-white">View</Link></td></tr>
                                ))}
                                {(sales?.data ?? []).length === 0 && <tr><td colSpan="5" className="px-5 py-12 text-center text-gray-500">No sales found.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                    {sales?.links?.length > 3 && <div className="flex flex-wrap gap-1 border-t p-4">{sales.links.map((link, index) => link.url ? <Link key={index} href={link.url} preserveState className={`rounded border px-3 py-2 text-sm ${link.active ? "bg-blue-600 text-white" : "bg-white"}`} dangerouslySetInnerHTML={{ __html: link.label }} /> : <span key={index} className="rounded border bg-gray-100 px-3 py-2 text-sm text-gray-400" dangerouslySetInnerHTML={{ __html: link.label }} />)}</div>}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

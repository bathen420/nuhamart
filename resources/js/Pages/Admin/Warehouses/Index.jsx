import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Pagination from "@/Components/Pagination";

export default function Index({ warehouses, filters = {} }) {
    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status ?? "");

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(route("admin.warehouses.index"), { search, status }, { preserveState: true, replace: true });
        }, 350);
        return () => clearTimeout(timeout);
    }, [search, status]);

    const deleteWarehouse = (warehouse) => {
        if (confirm(`Delete warehouse "${warehouse.name}"?`)) {
            router.delete(route("admin.warehouses.destroy", warehouse.id));
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Warehouses</h2>}>
            <Head title="Warehouses" />
            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
                            <input className="w-full rounded-md border-gray-300 sm:max-w-sm" placeholder="Search name, code, phone..." value={search} onChange={(e) => setSearch(e.target.value)} />
                            <select className="rounded-md border-gray-300" value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="">All statuses</option>
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                        </div>
                        <Link href={route("admin.warehouses.create")} className="rounded bg-blue-600 px-4 py-2 text-center text-white hover:bg-blue-700">+ Add Warehouse</Link>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left">Warehouse</th>
                                        <th className="px-6 py-3 text-left">Contact</th>
                                        <th className="px-6 py-3 text-left">Status</th>
                                        <th className="px-6 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {warehouses.data.length ? warehouses.data.map((warehouse) => (
                                        <tr key={warehouse.id}>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-900">{warehouse.name}</div>
                                                <div className="text-sm text-gray-500">{warehouse.code}</div>
                                                {warehouse.is_default && <span className="mt-1 inline-block rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">Default</span>}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                <div>{warehouse.contact_person || "—"}</div>
                                                <div>{warehouse.phone || warehouse.email || "—"}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`rounded px-3 py-1 text-sm ${warehouse.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{warehouse.status ? "Active" : "Inactive"}</span>
                                            </td>
                                            <td className="space-x-2 px-6 py-4 text-right">
                                                <Link href={route("admin.warehouses.edit", warehouse.id)} className="rounded bg-amber-500 px-3 py-1 text-white">Edit</Link>
                                                <button onClick={() => deleteWarehouse(warehouse)} disabled={warehouse.is_default} className="rounded bg-red-600 px-3 py-1 text-white disabled:cursor-not-allowed disabled:opacity-40">Delete</button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-500">No warehouses found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <Pagination links={warehouses.links} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

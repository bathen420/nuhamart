import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Mail,
    Pencil,
    Phone,
    Plus,
    RotateCcw,
    Search,
    Trash2,
    UserCheck,
    Users,
    UserX,
    Wallet,
} from "lucide-react";

function formatCurrency(value) {
    return new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
        minimumFractionDigits: 2,
    }).format(Number(value ?? 0));
}

function SummaryCard({ title, value, description, icon: Icon, className }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <h3 className="mt-2 text-2xl font-bold text-gray-900">{value}</h3>
                    <p className="mt-1 text-xs text-gray-500">{description}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${className}`}>
                    <Icon size={23} />
                </div>
            </div>
        </div>
    );
}

export default function Index({ customers, filters = {}, summary = {} }) {
    const [search, setSearch] = useState(filters.search ?? "");
    const [status, setStatus] = useState(filters.status ?? "");
    const [perPage, setPerPage] = useState(String(filters.per_page ?? 15));
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        setSearch(filters.search ?? "");
        setStatus(filters.status ?? "");
        setPerPage(String(filters.per_page ?? 15));
    }, [filters]);

    const loadCustomers = (overrides = {}) => {
        router.get(
            route("admin.customers.index"),
            {
                search: search.trim() || undefined,
                status: status === "" ? undefined : status,
                per_page: perPage,
                ...overrides,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const submitFilters = (event) => {
        event.preventDefault();
        loadCustomers();
    };

    const resetFilters = () => {
        setSearch("");
        setStatus("");
        setPerPage("15");
        router.get(route("admin.customers.index"), {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const deleteCustomer = (customer) => {
        if (!window.confirm(`Delete ${customer.name}?`)) return;

        setDeletingId(customer.id);
        router.delete(route("admin.customers.destroy", customer.id), {
            preserveScroll: true,
            onFinish: () => setDeletingId(null),
        });
    };

    const rows = customers?.data ?? [];
    const links = customers?.links ?? [];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Customer Management</h2>
                        <p className="mt-1 text-sm text-gray-500">Manage customer information, balances and status.</p>
                    </div>
                    <Link
                        href={route("admin.customers.create")}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                    >
                        <Plus size={18} /> Add Customer
                    </Link>
                </div>
            }
        >
            <Head title="Customers" />

            <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <SummaryCard title="Total Customers" value={summary.total_customers ?? 0} description="All registered customers" icon={Users} className="bg-blue-100 text-blue-700" />
                    <SummaryCard title="Active Customers" value={summary.active_customers ?? 0} description="Currently active accounts" icon={UserCheck} className="bg-green-100 text-green-700" />
                    <SummaryCard title="Inactive Customers" value={summary.inactive_customers ?? 0} description="Currently inactive accounts" icon={UserX} className="bg-amber-100 text-amber-700" />
                    <SummaryCard title="Total Balance" value={formatCurrency(summary.total_due)} description="Combined current balance" icon={Wallet} className="bg-purple-100 text-purple-700" />
                </div>

                <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                    <form onSubmit={submitFilters} className="grid gap-4 border-b border-gray-200 p-5 md:grid-cols-[1fr_180px_120px_auto]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search code, name, phone or email"
                                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                            <option value="">All statuses</option>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                        <select value={perPage} onChange={(event) => setPerPage(event.target.value)} className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                            {[10, 15, 25, 50, 100].map((size) => <option key={size} value={size}>{size} rows</option>)}
                        </select>
                        <div className="flex gap-2">
                            <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Filter</button>
                            <button type="button" onClick={resetFilters} className="inline-flex items-center rounded-lg border border-gray-300 px-3 py-2.5 text-gray-600 hover:bg-gray-50" title="Reset filters">
                                <RotateCcw size={18} />
                            </button>
                        </div>
                    </form>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {['Customer', 'Contact', 'Opening Balance', 'Current Balance', 'Status', 'Actions'].map((heading) => (
                                        <th key={heading} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{heading}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {rows.length === 0 ? (
                                    <tr><td colSpan="6" className="px-5 py-12 text-center text-sm text-gray-500">No customers found.</td></tr>
                                ) : rows.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-gray-50">
                                        <td className="px-5 py-4">
                                            <p className="font-semibold text-gray-900">{customer.name}</p>
                                            <p className="text-xs text-gray-500">{customer.customer_code}</p>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-gray-600">
                                            <p className="flex items-center gap-2"><Phone size={14} /> {customer.phone}</p>
                                            {customer.email && <p className="mt-1 flex items-center gap-2"><Mail size={14} /> {customer.email}</p>}
                                        </td>
                                        <td className="px-5 py-4 text-sm font-medium text-gray-700">{formatCurrency(customer.opening_balance)}</td>
                                        <td className="px-5 py-4 text-sm font-semibold text-gray-900">{formatCurrency(customer.current_balance)}</td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${customer.status ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                {customer.status ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link href={route("admin.customers.edit", customer.id)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50" title="Edit"><Pencil size={17} /></Link>
                                                <button type="button" onClick={() => deleteCustomer(customer)} disabled={deletingId === customer.id} className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50" title="Delete"><Trash2 size={17} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {links.length > 3 && (
                        <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-gray-500">Showing {customers.from ?? 0} to {customers.to ?? 0} of {customers.total ?? 0}</p>
                            <div className="flex flex-wrap gap-1">
                                {links.map((link, index) => {
                                    const label = link.label.replace('&laquo;', '').replace('&raquo;', '').trim();
                                    return (
                                        <button
                                            key={`${link.label}-${index}`}
                                            type="button"
                                            disabled={!link.url}
                                            onClick={() => link.url && router.visit(link.url, { preserveState: true, preserveScroll: true })}
                                            className={`inline-flex min-h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm ${link.active ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'} disabled:cursor-not-allowed disabled:opacity-40`}
                                        >
                                            {index === 0 ? <ChevronLeft size={16} /> : index === links.length - 1 ? <ChevronRight size={16} /> : label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

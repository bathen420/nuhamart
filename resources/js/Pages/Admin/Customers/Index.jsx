import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import {
    Users,
    UserCheck,
    UserX,
    Wallet,
    Plus,
    Search,
    RotateCcw,
    Eye,
    Pencil,
    Trash2,
    Phone,
    Mail,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

function formatCurrency(value) {
    return new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
        minimumFractionDigits: 2,
    }).format(Number(value ?? 0));
}

function SummaryCard({
    title,
    value,
    description,
    icon: Icon,
    iconClassName,
}) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-gray-500">
                        {title}
                    </p>

                    <h3 className="mt-2 text-2xl font-bold text-gray-900">
                        {value}
                    </h3>

                    {description && (
                        <p className="mt-1 text-xs text-gray-500">
                            {description}
                        </p>
                    )}
                </div>

                <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
                >
                    <Icon size={23} />
                </div>
            </div>
        </div>
    );
}

function CustomerAvatar({ name }) {
    const initial = name?.trim()?.charAt(0)?.toUpperCase() || "C";

    return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
            {initial}
        </div>
    );
}

export default function Index({
    customers,
    filters = {},
    summary = {},
}) {
    const [search, setSearch] = useState(filters.search ?? "");
    const [status, setStatus] = useState(filters.status ?? "");
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        setSearch(filters.search ?? "");
        setStatus(filters.status ?? "");
    }, [filters.search, filters.status]);

    const applyFilters = (event) => {
        event.preventDefault();

        router.get(
            route("customers.index"),
            {
                search: search.trim() || undefined,
                status: status !== "" ? status : undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const resetFilters = () => {
        setSearch("");
        setStatus("");

        router.get(
            route("customers.index"),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const deleteCustomer = (customer) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${customer.name}?`,
        );

        if (!confirmed) {
            return;
        }

        setDeletingId(customer.id);

        router.delete(
            route("customers.destroy", customer.id),
            {
                preserveScroll: true,

                onFinish: () => {
                    setDeletingId(null);
                },
            },
        );
    };

    const customerRows = customers?.data ?? [];
    const paginationLinks = customers?.links ?? [];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Customer Management
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Manage customer information, balances and status.
                        </p>
                    </div>

                    <Link
                        href={route("customers.create")}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                    >
                        <Plus size={18} />
                        Add Customer
                    </Link>
                </div>
            }
        >
            <Head title="Customers" />

            <div className="space-y-6">
                {/* Page introduction */}

                <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">
                                Customers
                            </h1>

                            <p className="mt-1 text-sm text-blue-100">
                                View, search and manage all NuhaMart customers.
                            </p>
                        </div>

                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/15">
                            <Users size={30} />
                        </div>
                    </div>
                </div>

                {/* Summary cards */}

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <SummaryCard
                        title="Total Customers"
                        value={Number(
                            summary.total_customers ?? 0,
                        ).toLocaleString()}
                        description="All registered customers"
                        icon={Users}
                        iconClassName="bg-blue-100 text-blue-700"
                    />

                    <SummaryCard
                        title="Active Customers"
                        value={Number(
                            summary.active_customers ?? 0,
                        ).toLocaleString()}
                        description="Currently active accounts"
                        icon={UserCheck}
                        iconClassName="bg-green-100 text-green-700"
                    />

                    <SummaryCard
                        title="Inactive Customers"
                        value={Number(
                            summary.inactive_customers ?? 0,
                        ).toLocaleString()}
                        description="Currently inactive accounts"
                        icon={UserX}
                        iconClassName="bg-red-100 text-red-700"
                    />

                    <SummaryCard
                        title="Total Due"
                        value={formatCurrency(summary.total_due)}
                        description="Outstanding customer balance"
                        icon={Wallet}
                        iconClassName="bg-orange-100 text-orange-700"
                    />
                </div>

                {/* Filters */}

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <form
                        onSubmit={applyFilters}
                        className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_auto]"
                    >
                        <div>
                            <label
                                htmlFor="customer-search"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Search Customer
                            </label>

                            <div className="relative">
                                <Search
                                    size={18}
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    id="customer-search"
                                    type="text"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Code, name, phone, email or address"
                                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="customer-status"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Customer Status
                            </label>

                            <select
                                id="customer-status"
                                value={status}
                                onChange={(event) =>
                                    setStatus(event.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="">All Customers</option>
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                        </div>

                        <div className="flex items-end gap-2">
                            <button
                                type="submit"
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                                <Search size={17} />
                                Search
                            </button>

                            <button
                                type="button"
                                onClick={resetFilters}
                                title="Reset filters"
                                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white p-2.5 text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                            >
                                <RotateCcw size={18} />
                            </button>
                        </div>
                    </form>
                </div>

                {/* Customer table */}

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-2 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-900">
                                Customer List
                            </h3>

                            <p className="mt-1 text-xs text-gray-500">
                                Showing {customers?.from ?? 0} to{" "}
                                {customers?.to ?? 0} of{" "}
                                {customers?.total ?? 0} customers
                            </p>
                        </div>

                        {(filters.search || filters.status !== "") && (
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Code
                                    </th>

                                    <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Customer
                                    </th>

                                    <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Contact
                                    </th>

                                    <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Opening Balance
                                    </th>

                                    <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Current Balance
                                    </th>

                                    <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Status
                                    </th>

                                    <th className="whitespace-nowrap px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100 bg-white">
                                {customerRows.length > 0 ? (
                                    customerRows.map((customer) => (
                                        <tr
                                            key={customer.id}
                                            className="transition hover:bg-gray-50"
                                        >
                                            <td className="whitespace-nowrap px-5 py-4">
                                                <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                                    {customer.customer_code}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex min-w-[200px] items-center gap-3">
                                                    <CustomerAvatar
                                                        name={customer.name}
                                                    />

                                                    <div>
                                                        <Link
                                                            href={route(
                                                                "customers.show",
                                                                customer.id,
                                                            )}
                                                            className="font-semibold text-gray-900 transition hover:text-blue-600"
                                                        >
                                                            {customer.name}
                                                        </Link>

                                                        <p className="mt-0.5 max-w-[240px] truncate text-xs text-gray-500">
                                                            {customer.address ||
                                                                "No address provided"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="min-w-[180px] space-y-1.5 text-sm">
                                                    <div className="flex items-center gap-2 text-gray-700">
                                                        <Phone
                                                            size={14}
                                                            className="text-gray-400"
                                                        />
                                                        {customer.phone}
                                                    </div>

                                                    <div className="flex items-center gap-2 text-gray-500">
                                                        <Mail
                                                            size={14}
                                                            className="text-gray-400"
                                                        />
                                                        <span className="max-w-[190px] truncate">
                                                            {customer.email ||
                                                                "No email"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-gray-700">
                                                {formatCurrency(
                                                    customer.opening_balance,
                                                )}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4">
                                                <span
                                                    className={`text-sm font-semibold ${
                                                        Number(
                                                            customer.current_balance,
                                                        ) > 0
                                                            ? "text-red-600"
                                                            : "text-green-600"
                                                    }`}
                                                >
                                                    {formatCurrency(
                                                        customer.current_balance,
                                                    )}
                                                </span>
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4">
                                                {customer.status ? (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                                                        Inactive
                                                    </span>
                                                )}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={route(
                                                            "customers.show",
                                                            customer.id,
                                                        )}
                                                        title="View customer"
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700 transition hover:bg-blue-100"
                                                    >
                                                        <Eye size={17} />
                                                    </Link>

                                                    <Link
                                                        href={route(
                                                            "customers.edit",
                                                            customer.id,
                                                        )}
                                                        title="Edit customer"
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700 transition hover:bg-amber-100"
                                                    >
                                                        <Pencil size={17} />
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        title="Delete customer"
                                                        disabled={
                                                            deletingId ===
                                                            customer.id
                                                        }
                                                        onClick={() =>
                                                            deleteCustomer(
                                                                customer,
                                                            )
                                                        }
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <Trash2 size={17} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-6 py-16 text-center"
                                        >
                                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                                                <Users size={26} />
                                            </div>

                                            <h3 className="mt-4 font-semibold text-gray-900">
                                                No customers found
                                            </h3>

                                            <p className="mt-1 text-sm text-gray-500">
                                                Try changing your search or
                                                create a new customer.
                                            </p>

                                            <Link
                                                href={route(
                                                    "customers.create",
                                                )}
                                                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                                            >
                                                <Plus size={17} />
                                                Add Customer
                                            </Link>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}

                    {customers?.last_page > 1 && (
                        <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-gray-500">
                                Page {customers.current_page} of{" "}
                                {customers.last_page}
                            </p>

                            <div className="flex flex-wrap items-center gap-1">
                                {paginationLinks.map((link, index) => {
                                    const isPrevious =
                                        index === 0;
                                    const isNext =
                                        index ===
                                        paginationLinks.length - 1;

                                    return link.url ? (
                                        <Link
                                            key={`${link.label}-${index}`}
                                            href={link.url}
                                            preserveScroll
                                            preserveState
                                            className={`inline-flex min-h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm font-medium transition ${
                                                link.active
                                                    ? "border-blue-600 bg-blue-600 text-white"
                                                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                                            }`}
                                        >
                                            {isPrevious ? (
                                                <ChevronLeft size={16} />
                                            ) : isNext ? (
                                                <ChevronRight size={16} />
                                            ) : (
                                                <span
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                />
                                            )}
                                        </Link>
                                    ) : (
                                        <span
                                            key={`${link.label}-${index}`}
                                            className="inline-flex min-h-9 min-w-9 cursor-not-allowed items-center justify-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-400"
                                        >
                                            {isPrevious ? (
                                                <ChevronLeft size={16} />
                                            ) : isNext ? (
                                                <ChevronRight size={16} />
                                            ) : (
                                                <span
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                />
                                            )}
                                        </span>
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
import { Head, Link, router } from "@inertiajs/react";
import {
    Boxes,
    Edit3,
    Plus,
    Search,
    Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import DataTable from "@/Components/UI/DataTable";
import PageHeader from "@/Components/UI/PageHeader";
import Pagination from "@/Components/UI/Pagination";
import SearchToolbar from "@/Components/UI/SearchToolbar";
import useDebouncedValue from "@/hooks/useDebouncedValue";

const money = (value) =>
    new Intl.NumberFormat("en-BD", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number(value || 0));

export default function Index({
    auth,
    products,
    filters = {},
    filterOptions = {},
}) {
    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status ?? "");
    const [category, setCategory] = useState(filters.category ?? "");
    const [brand, setBrand] = useState(filters.brand ?? "");
    const [perPage, setPerPage] = useState(String(filters.per_page || 10));
    const [loading, setLoading] = useState(false);

    const debouncedSearch = useDebouncedValue(search, 300);

    const visit = (overrides = {}) => {
        const query = {
            search: debouncedSearch,
            status,
            category,
            brand,
            per_page: perPage,
            sort: filters.sort || "created_at",
            direction: filters.direction || "desc",
            ...overrides,
        };

        Object.keys(query).forEach((key) => {
            if (query[key] === "" || query[key] === null || query[key] === undefined) {
                delete query[key];
            }
        });

        router.get(route("admin.products.index"), query, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onStart: () => setLoading(true),
            onFinish: () => setLoading(false),
        });
    };

    useEffect(() => {
        if (debouncedSearch === (filters.search || "")) {
            return;
        }

        visit({ search: debouncedSearch, page: 1 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    const handleFilterChange = (setter, key, value) => {
        setter(value);
        visit({ [key]: value, page: 1 });
    };

    const resetFilters = () => {
        setSearch("");
        setStatus("");
        setCategory("");
        setBrand("");
        setPerPage("10");

        router.get(
            route("admin.products.index"),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    const deleteProduct = (product) => {
        if (!window.confirm(`Delete “${product.name}”? This action cannot be undone.`)) {
            return;
        }

        router.delete(route("admin.products.destroy", product.id), {
            preserveScroll: true,
        });
    };

    const columns = useMemo(
        () => [
            {
                key: "id",
                label: "ID",
                sortable: true,
                width: 80,
            },
            {
                key: "image",
                label: "Image",
                width: 90,
                render: (_, product) =>
                    product.image ? (
                        <img
                            src={`/storage/${product.image}`}
                            alt={product.name}
                            className="h-12 w-12 rounded-xl border border-slate-200 object-cover"
                            loading="lazy"
                        />
                    ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-[10px] font-semibold text-slate-400">
                            No image
                        </div>
                    ),
            },
            {
                key: "name",
                label: "Product",
                sortable: true,
                minWidth: 230,
                render: (_, product) => (
                    <div>
                        <div className="font-semibold text-slate-900">{product.name}</div>
                        <div className="mt-1 text-xs text-slate-500">{product.sku || "No SKU"}</div>
                    </div>
                ),
            },
            {
                key: "category",
                label: "Category",
                render: (_, product) => product.category?.name || "—",
            },
            {
                key: "brand",
                label: "Brand",
                render: (_, product) => product.brand?.name || "—",
            },
            {
                key: "price",
                label: "Price",
                sortable: true,
                align: "right",
                render: (value) => <span className="font-semibold text-slate-900">৳{money(value)}</span>,
            },
            {
                key: "stock_quantity",
                label: "Stock",
                sortable: true,
                align: "center",
                render: (value) => (
                    <span
                        className={`inline-flex min-w-14 justify-center rounded-full px-2.5 py-1 text-xs font-bold ${
                            Number(value) <= 0
                                ? "bg-rose-100 text-rose-700"
                                : Number(value) <= 5
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-emerald-100 text-emerald-700"
                        }`}
                    >
                        {value}
                    </span>
                ),
            },
            {
                key: "status",
                label: "Status",
                align: "center",
                render: (value) => (
                    <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                            value
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-200 text-slate-600"
                        }`}
                    >
                        {value ? "Active" : "Inactive"}
                    </span>
                ),
            },
            {
                key: "actions",
                label: "Actions",
                align: "right",
                width: 150,
                render: (_, product) => (
                    <div className="flex justify-end gap-2">
                        <Link
                            href={route("admin.products.edit", product.id)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-amber-200 bg-amber-50 text-amber-700 transition hover:bg-amber-100"
                            title="Edit product"
                        >
                            <Edit3 className="h-4 w-4" />
                        </Link>
                        <button
                            type="button"
                            onClick={() => deleteProduct(product)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-700 transition hover:bg-rose-100"
                            title="Delete product"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                ),
            },
        ],
        []
    );

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Products" />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8">
                <PageHeader
                    title="Products"
                    description="Search, filter, sort and manage inventory products from one fast workspace."
                    icon={Boxes}
                    breadcrumbs={[{ label: "Products" }]}
                    action={
                        <Link
                            href={route("admin.products.create")}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                        >
                            <Plus className="h-4 w-4" />
                            Add Product
                        </Link>
                    }
                />

                <SearchToolbar
                    search={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Search product, SKU, category or brand..."
                    status={status}
                    onStatusChange={(value) => handleFilterChange(setStatus, "status", value)}
                    onReset={resetFilters}
                >
                    <select
                        value={category}
                        onChange={(event) =>
                            handleFilterChange(setCategory, "category", event.target.value)
                        }
                        className="h-11 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 lg:w-52"
                    >
                        <option value="">All Categories</option>
                        {(filterOptions.categories || []).map((item) => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                    </select>

                    <select
                        value={brand}
                        onChange={(event) =>
                            handleFilterChange(setBrand, "brand", event.target.value)
                        }
                        className="h-11 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 lg:w-52"
                    >
                        <option value="">All Brands</option>
                        {(filterOptions.brands || []).map((item) => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                    </select>

                    <select
                        value={perPage}
                        onChange={(event) =>
                            handleFilterChange(setPerPage, "per_page", event.target.value)
                        }
                        className="h-11 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 lg:w-32"
                    >
                        {[10, 25, 50, 100].map((size) => (
                            <option key={size} value={size}>{size} rows</option>
                        ))}
                    </select>
                </SearchToolbar>

                <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
                    <div className="inline-flex items-center gap-2">
                        <Search className="h-4 w-4" />
                        Showing {products.from || 0}–{products.to || 0} of {products.total || 0} products
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={products.data || []}
                    loading={loading}
                    sortColumn={filters.sort || "created_at"}
                    sortDirection={filters.direction || "desc"}
                    onSort={(sort, direction) => visit({ sort, direction, page: 1 })}
                    emptyTitle="No products found"
                    emptyDescription="Try changing your search or filters, or add a new product."
                />

                <Pagination links={products.links || []} />
            </div>
        </AuthenticatedLayout>
    );
}

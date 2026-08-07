import { Head, Link, router, usePage } from "@inertiajs/react";
import {
    ArrowDown,
    ArrowUp,
    Boxes,
    Eye,
    Filter,
    Pencil,
    Plus,
    Search,
    Trash2,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Badge,
    Button,
    Card,
    CardBody,
    PageHeader,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/Admin/UI";
import Input from "@/Components/Admin/UI/Input";

export default function Index({
    products = {},
    filters = {},
    filterOptions = {},
}) {
    const { businessSettings = {} } = usePage().props;
    const rows = products.data || [];
    const currency = businessSettings.currency_symbol || "৳";

    const apply = (event) => {
        event.preventDefault();
        const query = Object.fromEntries(new FormData(event.currentTarget));
        Object.keys(query).forEach(
            (key) => query[key] === "" && delete query[key],
        );

        router.get(route("admin.products.index"), query, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const sortLink = (field) => {
        const direction =
            filters.sort === field && filters.direction === "asc"
                ? "desc"
                : "asc";

        router.get(
            route("admin.products.index"),
            { ...filters, sort: field, direction },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Products" />

            <div className="space-y-6">
                <PageHeader
                    eyebrow="Catalog"
                    title="Products & Books"
                    description="Manage physical products, hardcopy books, ebooks, pricing and inventory."
                    actions={
                        <Button as={Link} href={route("admin.products.create")}>
                            <Plus size={16} />
                            Add product
                        </Button>
                    }
                />

                <Card>
                    <CardBody>
                        <form
                            onSubmit={apply}
                            className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(220px,2fr)_1fr_1fr_160px_auto]"
                        >
                            <div className="relative">
                                <Search
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
                                />
                                <Input
                                    name="search"
                                    defaultValue={filters.search || ""}
                                    placeholder="Search name, SKU, category..."
                                    className="pl-9"
                                />
                            </div>
                            <Select
                                name="category"
                                defaultValue={filters.category || ""}
                            >
                                <option value="">All categories</option>
                                {(filterOptions.categories || []).map(
                                    (item) => (
                                        <option
                                            key={item.id}
                                            value={item.id}
                                        >
                                            {item.name}
                                        </option>
                                    ),
                                )}
                            </Select>
                            <Select
                                name="brand"
                                defaultValue={filters.brand || ""}
                            >
                                <option value="">All brands</option>
                                {(filterOptions.brands || []).map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </Select>
                            <Select
                                name="status"
                                defaultValue={filters.status ?? ""}
                            >
                                <option value="">All status</option>
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </Select>
                            <div className="flex gap-2">
                                <Button type="submit" className="flex-1">
                                    <Filter size={15} />
                                    Apply
                                </Button>
                                <Button
                                    as={Link}
                                    href={route("admin.products.index")}
                                    variant="secondary"
                                >
                                    Reset
                                </Button>
                            </div>
                        </form>
                    </CardBody>
                </Card>

                <Card>
                    <div className="border-b border-ink-100 px-5 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="font-black text-ink-950">
                                    Product catalog
                                </h2>
                                <p className="mt-1 text-xs text-ink-400">
                                    {products.total || rows.length} total item(s)
                                </p>
                            </div>
                            <Badge tone="brand">
                                Page {products.current_page || 1}
                            </Badge>
                        </div>
                    </div>

                    <div className="p-3 sm:p-4">
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <tr>
                                        <TableHeader>Product</TableHeader>
                                        <TableHeader>Category</TableHeader>
                                        <TableHeader>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    sortLink("price")
                                                }
                                                className="inline-flex items-center gap-1"
                                            >
                                                Price
                                                {filters.sort === "price" &&
                                                    (filters.direction ===
                                                    "asc" ? (
                                                        <ArrowUp size={12} />
                                                    ) : (
                                                        <ArrowDown size={12} />
                                                    ))}
                                            </button>
                                        </TableHeader>
                                        <TableHeader>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    sortLink("stock_quantity")
                                                }
                                                className="inline-flex items-center gap-1"
                                            >
                                                Stock
                                                {filters.sort ===
                                                    "stock_quantity" &&
                                                    (filters.direction ===
                                                    "asc" ? (
                                                        <ArrowUp size={12} />
                                                    ) : (
                                                        <ArrowDown size={12} />
                                                    ))}
                                            </button>
                                        </TableHeader>
                                        <TableHeader>Status</TableHeader>
                                        <TableHeader className="text-right">
                                            Actions
                                        </TableHeader>
                                    </tr>
                                </TableHead>
                                <TableBody>
                                    {rows.map((product) => {
                                        const stock = Number(
                                            product.stock_quantity || 0,
                                        );
                                        return (
                                            <TableRow key={product.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-ink-200 bg-ink-50">
                                                            {product.image ? (
                                                                <img
                                                                    src={`/storage/${product.image}`}
                                                                    alt={
                                                                        product.name
                                                                    }
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <Boxes
                                                                    size={20}
                                                                    className="text-ink-300"
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="max-w-64 truncate font-black text-ink-900">
                                                                {product.name}
                                                            </p>
                                                            <p className="mt-1 text-[10px] font-semibold text-ink-400">
                                                                SKU:{" "}
                                                                {product.sku}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <p className="font-bold text-ink-700">
                                                        {product.category
                                                            ?.name || "—"}
                                                    </p>
                                                    <p className="mt-1 text-[10px] text-ink-400">
                                                        {product.brand?.name ||
                                                            "No brand"}
                                                    </p>
                                                </TableCell>
                                                <TableCell className="font-black text-ink-950">
                                                    {currency}
                                                    {Number(
                                                        product.price || 0,
                                                    ).toLocaleString("en-BD", {
                                                        minimumFractionDigits: 2,
                                                    })}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        tone={
                                                            stock <= 0
                                                                ? "danger"
                                                                : stock <= 5
                                                                  ? "warning"
                                                                  : "success"
                                                        }
                                                        dot
                                                    >
                                                        {stock}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        tone={
                                                            product.status
                                                                ? "success"
                                                                : "neutral"
                                                        }
                                                        dot
                                                    >
                                                        {product.status
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex justify-end gap-1">
                                                        <Button
                                                            as={Link}
                                                            href={route(
                                                                "admin.products.show",
                                                                product.id,
                                                            )}
                                                            variant="ghost"
                                                            size="icon"
                                                            title="View"
                                                        >
                                                            <Eye size={16} />
                                                        </Button>
                                                        <Button
                                                            as={Link}
                                                            href={route(
                                                                "admin.products.edit",
                                                                product.id,
                                                            )}
                                                            variant="ghost"
                                                            size="icon"
                                                            title="Edit"
                                                        >
                                                            <Pencil size={16} />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="Delete"
                                                            className="text-rose-600 hover:bg-rose-50"
                                                            onClick={() => {
                                                                if (
                                                                    window.confirm(
                                                                        `Delete ${product.name}?`,
                                                                    )
                                                                ) {
                                                                    router.delete(
                                                                        route(
                                                                            "admin.products.destroy",
                                                                            product.id,
                                                                        ),
                                                                        {
                                                                            preserveScroll: true,
                                                                        },
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {rows.length === 0 && (
                            <div className="py-14 text-center">
                                <Boxes
                                    size={32}
                                    className="mx-auto text-ink-300"
                                />
                                <p className="mt-3 font-black text-ink-700">
                                    No products found
                                </p>
                            </div>
                        )}

                        {(products.links || []).length > 0 && (
                            <div className="mt-4 flex flex-wrap justify-center gap-2">
                                {products.links.map((link, index) =>
                                    link.url ? (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            preserveScroll
                                            preserveState
                                            className={`rounded-lg border px-3 py-2 text-xs font-black ${
                                                link.active
                                                    ? "border-brand-700 bg-brand-700 text-white"
                                                    : "border-ink-200 bg-white text-ink-600 hover:bg-ink-50"
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ) : (
                                        <span
                                            key={index}
                                            className="rounded-lg border border-ink-100 px-3 py-2 text-xs text-ink-300"
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ),
                                )}
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}

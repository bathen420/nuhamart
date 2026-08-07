import { Head, Link, usePage } from "@inertiajs/react";
import {
    ArrowLeft,
    BookOpen,
    Boxes,
    Pencil,
    Package,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Badge,
    Button,
    Card,
    CardBody,
    CardHeader,
    PageHeader,
} from "@/Components/Admin/UI";

export default function Show({ product }) {
    const { businessSettings = {} } = usePage().props;
    const currency = businessSettings.currency_symbol || "৳";

    const detail = (label, value) => (
        <div className="rounded-2xl bg-ink-50 px-4 py-3">
            <p className="text-[10px] font-black uppercase tracking-wider text-ink-400">
                {label}
            </p>
            <p className="mt-1 text-sm font-black text-ink-800">
                {value || "—"}
            </p>
        </div>
    );

    return (
        <AuthenticatedLayout>
            <Head title={product.name} />

            <div className="space-y-6">
                <PageHeader
                    eyebrow="Catalog"
                    title={product.name}
                    description="Product details, pricing, inventory and publishing information."
                    actions={
                        <>
                            <Button
                                as={Link}
                                href={route("admin.products.index")}
                                variant="secondary"
                            >
                                <ArrowLeft size={16} />
                                Products
                            </Button>
                            <Button
                                as={Link}
                                href={route(
                                    "admin.products.edit",
                                    product.id,
                                )}
                            >
                                <Pencil size={16} />
                                Edit
                            </Button>
                        </>
                    }
                >
                    <div className="mt-3 flex flex-wrap gap-2">
                        <Badge tone="brand">{product.sku}</Badge>
                        <Badge
                            tone={product.status ? "success" : "neutral"}
                            dot
                        >
                            {product.status ? "Active" : "Inactive"}
                        </Badge>
                        <Badge tone="purple">
                            {product.product_type || "physical"}
                        </Badge>
                    </div>
                </PageHeader>

                <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
                    <Card>
                        <CardBody>
                            <div className="grid aspect-square place-items-center overflow-hidden rounded-2xl bg-ink-50 p-6">
                                {product.image ? (
                                    <img
                                        src={`/storage/${product.image}`}
                                        alt={product.name}
                                        className="h-full w-full object-contain"
                                    />
                                ) : (
                                    <Package
                                        size={54}
                                        className="text-ink-300"
                                    />
                                )}
                            </div>
                            <div className="mt-5">
                                <p className="text-2xl font-black text-brand-700">
                                    {currency}
                                    {Number(
                                        product.discount_price ||
                                            product.price ||
                                            0,
                                    ).toLocaleString("en-BD", {
                                        minimumFractionDigits: 2,
                                    })}
                                </p>
                                {product.discount_price && (
                                    <p className="mt-1 text-sm text-ink-400 line-through">
                                        {currency}
                                        {Number(product.price || 0).toLocaleString(
                                            "en-BD",
                                        )}
                                    </p>
                                )}
                            </div>
                        </CardBody>
                    </Card>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader
                                title="Catalog information"
                                description="Primary product identity."
                            />
                            <CardBody className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {detail(
                                    "Category",
                                    product.category?.name,
                                )}
                                {detail("Brand", product.brand?.name)}
                                {detail("Stock", product.stock_quantity)}
                                {detail("Barcode", product.barcode)}
                                {detail(
                                    "Product type",
                                    product.product_type,
                                )}
                                {detail("Sort order", product.sort_order)}
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader
                                title="Book & publishing"
                                description="Publishing metadata when applicable."
                            />
                            <CardBody className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {detail("Author", product.author?.name)}
                                {detail(
                                    "Publisher",
                                    product.publisher?.name,
                                )}
                                {detail("ISBN", product.isbn)}
                                {detail("Edition", product.edition)}
                                {detail("Language", product.language)}
                                {detail("Pages", product.pages)}
                                {detail(
                                    "Publication year",
                                    product.publication_year,
                                )}
                                {detail("Binding", product.binding)}
                                {detail("Dimensions", product.dimensions)}
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader title="Description" />
                            <CardBody>
                                <p className="whitespace-pre-line text-sm leading-7 text-ink-600">
                                    {product.description ||
                                        product.short_description ||
                                        "No description provided."}
                                </p>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

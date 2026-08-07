import { Head, useForm } from "@inertiajs/react";
import { ArrowLeft, PackageCheck } from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Badge, Button, PageHeader } from "@/Components/Admin/UI";
import Form from "./Form";

export default function Edit({
    product,
    categories = [],
    brands = [],
    authors = [],
    publishers = [],
}) {
    const form = useForm({
        category_id: product.category_id ?? "",
        brand_id: product.brand_id ?? "",
        name: product.name ?? "",
        name_bn: product.name_bn ?? "",
        sku: product.sku ?? "",
        barcode: product.barcode ?? "",
        barcode_type: product.barcode_type ?? "code128",
        author_id: product.author_id ?? "",
        publisher_id: product.publisher_id ?? "",
        product_type: product.product_type ?? "physical",
        isbn: product.isbn ?? "",
        edition: product.edition ?? "",
        language: product.language ?? "",
        pages: product.pages ?? "",
        publication_year: product.publication_year ?? "",
        binding: product.binding ?? "",
        weight: product.weight ?? "",
        dimensions: product.dimensions ?? "",
        ebook_price: product.ebook_price ?? "",
        is_featured: product.is_featured ? 1 : 0,
        is_new_arrival: product.is_new_arrival ? 1 : 0,
        is_best_seller: product.is_best_seller ? 1 : 0,
        price: product.price ?? "",
        discount_price: product.discount_price ?? "",
        stock_quantity: product.stock_quantity ?? 0,
        short_description: product.short_description ?? "",
        short_description_bn: product.short_description_bn ?? "",
        description: product.description ?? "",
        description_bn: product.description_bn ?? "",
        seo_title: product.seo_title ?? "",
        seo_description: product.seo_description ?? "",
        status: product.status ? 1 : 0,
        sort_order: product.sort_order ?? 0,
        image: null,
        gallery_images: [],
        sample_file: null,
    });

    return (
        <AuthenticatedLayout>
            <Head title={`Edit ${product.name}`} />

            <div className="space-y-6">
                <PageHeader
                    eyebrow="Catalog"
                    title="Edit product"
                    description="Update catalog content, pricing, media and storefront visibility."
                    actions={
                        <Button
                            as="a"
                            href={route("admin.products.index")}
                            variant="secondary"
                        >
                            <ArrowLeft size={16} />
                            Products
                        </Button>
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
                    </div>
                </PageHeader>

                <Form
                    data={form.data}
                    setData={form.setData}
                    errors={form.errors}
                    processing={form.processing}
                    submit={(event) => {
                        event.preventDefault();
                        form.transform((data) => ({
                            ...data,
                            _method: "put",
                        }));
                        form.post(
                            route("admin.products.update", product.id),
                            {
                                forceFormData: true,
                                preserveScroll: true,
                            },
                        );
                    }}
                    categories={categories}
                    brands={brands}
                    authors={authors}
                    publishers={publishers}
                    buttonText="Update product"
                    product={product}
                />
            </div>
        </AuthenticatedLayout>
    );
}

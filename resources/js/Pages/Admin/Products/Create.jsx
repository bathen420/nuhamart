import { Head, useForm } from "@inertiajs/react";
import { ArrowLeft, PackagePlus } from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button, PageHeader } from "@/Components/Admin/UI";
import Form from "./Form";

const defaults = {
    category_id: "",
    brand_id: "",
    name: "",
    name_bn: "",
    sku: "",
    barcode: "",
    barcode_type: "code128",
    author_id: "",
    publisher_id: "",
    product_type: "physical",
    isbn: "",
    edition: "",
    language: "",
    pages: "",
    publication_year: "",
    binding: "",
    weight: "",
    dimensions: "",
    ebook_price: "",
    is_featured: 0,
    is_new_arrival: 0,
    is_best_seller: 0,
    price: "",
    discount_price: "",
    stock_quantity: "",
    short_description: "",
    short_description_bn: "",
    description: "",
    description_bn: "",
    seo_title: "",
    seo_description: "",
    status: 1,
    sort_order: 0,
    image: null,
    gallery_images: [],
    sample_file: null,
};

export default function Create({
    categories = [],
    brands = [],
    authors = [],
    publishers = [],
}) {
    const form = useForm(defaults);

    return (
        <AuthenticatedLayout>
            <Head title="Add Product" />

            <div className="space-y-6">
                <PageHeader
                    eyebrow="Catalog"
                    title="Add product"
                    description="Create a physical product, hardcopy book, ebook or combined listing."
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
                    <div className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-brand-700">
                        <PackagePlus size={15} />
                        New catalog item
                    </div>
                </PageHeader>

                <Form
                    data={form.data}
                    setData={form.setData}
                    errors={form.errors}
                    processing={form.processing}
                    submit={(event) => {
                        event.preventDefault();
                        form.post(route("admin.products.store"), {
                            forceFormData: true,
                            preserveScroll: true,
                        });
                    }}
                    categories={categories}
                    brands={brands}
                    authors={authors}
                    publishers={publishers}
                    buttonText="Save product"
                />
            </div>
        </AuthenticatedLayout>
    );
}

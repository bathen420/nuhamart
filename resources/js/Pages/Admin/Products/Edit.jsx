import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Form from "./Form";

export default function Edit({
    auth,
    product,
    categories,
    brands,
    authors,
    publishers,
}) {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        transform,
    } = useForm({
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
        status: product.status ? 1 : 0,
        sort_order: product.sort_order ?? 0,
        image: null,
        gallery_images: [],
        sample_file: null,
    });

    const submit = (event) => {
        event.preventDefault();

        // PHP does not reliably parse multipart/form-data sent directly with PUT.
        // Send POST and spoof the method so text fields and image are both received.
        transform((formData) => ({
            ...formData,
            _method: "put",
        }));

        post(route("admin.products.update", product.id), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={
                <h2 className="text-xl font-semibold">
                    Edit Product
                </h2>
            }
        >
            <Head title="Edit Product" />

            <div className="py-8">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
                    <div className="rounded-lg bg-white shadow">
                        <div className="p-6">
                            <Form
                                data={data}
                                setData={setData}
                                errors={errors}
                                processing={processing}
                                submit={submit}
                                categories={categories}
                                brands={brands}
                                authors={authors}
                                publishers={publishers}
                                buttonText="Update Product"
                                product={product}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

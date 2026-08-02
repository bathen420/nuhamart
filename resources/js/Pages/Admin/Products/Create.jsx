import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Form from "./Form";

export default function Create({ auth, categories, brands, authors, publishers }) {
    const { data, setData, post, processing, errors } = useForm({
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
        description_bn: "",
        short_description_bn: "",
        description: "",
        status: 1,
        sort_order: 0,
        image: null,
        gallery_images: [],
        sample_file: null,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("admin.products.store"), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Add Product
                </h2>
            }
        >
            <Head title="Add Product" />

            <div className="py-8">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {errors.error && (
                                <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                                    {errors.error}
                                </div>
                            )}

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
                                buttonText="Save Product"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
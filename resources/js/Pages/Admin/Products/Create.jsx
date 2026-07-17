import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Form from "./Form";

export default function Create({ auth, categories, brands }) {
    const { data, setData, post, processing, errors } = useForm({
        category_id: "",
        brand_id: "",
        name: "",
        sku: "",
        price: "",
        discount_price: "",
        stock_quantity: "",
        short_description: "",
        description: "",
        status: 1,
        sort_order: 0,
        image: null,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("products.store"), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
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
                            <Form
                                data={data}
                                setData={setData}
                                errors={errors}
                                processing={processing}
                                submit={submit}
                                categories={categories}
                                brands={brands}
                                buttonText="Save Product"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
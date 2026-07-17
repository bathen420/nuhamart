import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Form from "./Form";

export default function Edit({ auth, category }) {

    const { data, setData, put, processing, errors } = useForm({
        name: category.name || "",
        description: category.description || "",
        status: category.status ? 1 : 0,
        sort_order: category.sort_order || 0,
    });


    const submit = (e) => {
        e.preventDefault();

        put(route("categories.update", category.id));
    };


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit Category
                </h2>
            }
        >

            <Head title="Edit Category" />

            <div className="py-8">

                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">

                    <div className="bg-white shadow-sm sm:rounded-lg">

                        <div className="p-6">

                            <Form
                                data={data}
                                setData={setData}
                                errors={errors}
                                processing={processing}
                                submit={submit}
                                buttonText="Update Category"
                            />

                        </div>

                    </div>

                </div>

            </div>

        </AuthenticatedLayout>
    );
}
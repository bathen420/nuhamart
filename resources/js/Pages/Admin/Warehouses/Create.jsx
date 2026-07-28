import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Form from "./Form";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        code: "",
        contact_person: "",
        phone: "",
        email: "",
        address: "",
        is_default: 0,
        status: 1,
    });

    const submit = (event) => {
        event.preventDefault();
        post(route("admin.warehouses.store"));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Create Warehouse</h2>}>
            <Head title="Create Warehouse" />
            <div className="py-8">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <Form data={data} setData={setData} errors={errors} processing={processing} submit={submit} buttonText="Create Warehouse" />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

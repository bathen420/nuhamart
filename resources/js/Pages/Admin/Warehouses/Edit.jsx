import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Form from "./Form";

export default function Edit({ warehouse }) {
    const { data, setData, put, processing, errors } = useForm({
        name: warehouse.name || "",
        code: warehouse.code || "",
        contact_person: warehouse.contact_person || "",
        phone: warehouse.phone || "",
        email: warehouse.email || "",
        address: warehouse.address || "",
        is_default: warehouse.is_default ? 1 : 0,
        status: warehouse.status ? 1 : 0,
    });

    const submit = (event) => {
        event.preventDefault();
        put(route("admin.warehouses.update", warehouse.id));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Edit Warehouse</h2>}>
            <Head title="Edit Warehouse" />
            <div className="py-8">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <Form data={data} setData={setData} errors={errors} processing={processing} submit={submit} buttonText="Update Warehouse" />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Form from "./Form";

export default function Edit({group}) {
    const { data, setData, put, processing, errors } = useForm({name: group.name || "", code: group.code || "", discount_type: group.discount_type || "percentage", discount_value: group.discount_value || 0, credit_limit: group.credit_limit || 0, description: group.description || "", status: group.status ? 1 : 0});
    const submit = (event) => { event.preventDefault(); put(route("admin.customer-groups.update", group.id)); };
    return <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Edit Customer Group</h2>}><Head title="Edit Customer Group" /><div className="py-8"><div className="mx-auto max-w-4xl sm:px-6 lg:px-8"><div className="overflow-hidden bg-white shadow-sm sm:rounded-lg"><div className="p-6"><Form data={data} setData={setData} errors={errors} processing={processing} submit={submit} buttonText="Update Customer Group" /></div></div></div></div></AuthenticatedLayout>;
}

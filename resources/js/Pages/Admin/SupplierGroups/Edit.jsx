import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Form from "./Form";

export default function Edit({group}) {
    const { data, setData, put, processing, errors } = useForm({name: group.name || "", code: group.code || "", payment_terms_days: group.payment_terms_days || 0, description: group.description || "", status: group.status ? 1 : 0});
    const submit = (event) => { event.preventDefault(); put(route("admin.supplier-groups.update", group.id)); };
    return <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Edit Supplier Group</h2>}><Head title="Edit Supplier Group" /><div className="py-8"><div className="mx-auto max-w-4xl sm:px-6 lg:px-8"><div className="overflow-hidden bg-white shadow-sm sm:rounded-lg"><div className="p-6"><Form data={data} setData={setData} errors={errors} processing={processing} submit={submit} buttonText="Update Supplier Group" /></div></div></div></div></AuthenticatedLayout>;
}

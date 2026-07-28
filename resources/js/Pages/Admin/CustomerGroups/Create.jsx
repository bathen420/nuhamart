import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Form from "./Form";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({name: "", code: "", discount_type: "percentage", discount_value: 0, credit_limit: 0, description: "", status: 1});
    const submit = (event) => { event.preventDefault(); post(route("admin.customer-groups.store")); };
    return <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Create Customer Group</h2>}><Head title="Create Customer Group" /><div className="py-8"><div className="mx-auto max-w-4xl sm:px-6 lg:px-8"><div className="overflow-hidden bg-white shadow-sm sm:rounded-lg"><div className="p-6"><Form data={data} setData={setData} errors={errors} processing={processing} submit={submit} buttonText="Create Customer Group" /></div></div></div></div></AuthenticatedLayout>;
}

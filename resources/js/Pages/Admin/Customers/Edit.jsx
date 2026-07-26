import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CustomerForm from "./Form";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Pencil } from "lucide-react";

export default function Edit({ customer }) {
    const { data, setData, patch, processing, errors } = useForm({
        name: customer?.name ?? "",
        phone: customer?.phone ?? "",
        email: customer?.email ?? "",
        address: customer?.address ?? "",
        opening_balance: String(customer?.opening_balance ?? 0),
        status: Boolean(customer?.status),
        notes: customer?.notes ?? "",
    });

    const submit = (event) => {
        event.preventDefault();
        patch(route("admin.customers.update", customer.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Edit Customer</h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Update {customer?.customer_code ?? "customer"} information.
                        </p>
                    </div>
                    <Link
                        href={route("admin.customers.index")}
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-blue-600"
                    >
                        <ArrowLeft size={17} />
                        Back to Customers
                    </Link>
                </div>
            }
        >
            <Head title="Edit Customer" />

            <div className="mx-auto max-w-5xl">
                <div className="mb-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="rounded-xl bg-white/15 p-3">
                            <Pencil size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Edit Customer</h1>
                            <p className="mt-1 text-sm text-blue-100">
                                Customer code: {customer?.customer_code}
                            </p>
                        </div>
                    </div>
                </div>

                <CustomerForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    submitLabel="Update Customer"
                    onSubmit={submit}
                />
            </div>
        </AuthenticatedLayout>
    );
}

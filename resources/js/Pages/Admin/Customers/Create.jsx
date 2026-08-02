import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CustomerForm from "./Form";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, UserPlus } from "lucide-react";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        phone: "",
        email: "",
        address: "",
        opening_balance: "0",
        status: true,
        notes: "",
    });

    const submit = (event) => {
        event.preventDefault();

        post(route("admin.customers.store"));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Add Customer
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Create a new customer record for Nuha Mart BD.
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
            <Head title="Add Customer" />

            <div className="mx-auto max-w-5xl">
                <div className="mb-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="rounded-xl bg-white/15 p-3">
                            <UserPlus size={28} />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold">
                                New Customer
                            </h1>

                            <p className="mt-1 text-sm text-blue-100">
                                Customer code will be generated automatically.
                            </p>
                        </div>
                    </div>
                </div>

                <CustomerForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    submitLabel="Create Customer"
                    onSubmit={submit}
                />
            </div>
        </AuthenticatedLayout>
    );
}
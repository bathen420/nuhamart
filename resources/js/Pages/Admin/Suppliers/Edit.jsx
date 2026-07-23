import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Edit({ auth, supplier }) {

    const { data, setData, put, processing, errors } = useForm({
        name: supplier.name || "",
        company_name: supplier.company_name || "",
        phone: supplier.phone || "",
        email: supplier.email || "",
        address: supplier.address || "",
        status: supplier.status,
    });

    const submit = (e) => {
        e.preventDefault();

        put(route("suppliers.update", supplier.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold">
                    Edit Supplier
                </h2>
            }
        >
            <Head title="Edit Supplier" />

            <div className="mx-auto max-w-4xl py-6">

                <div className="mb-6 flex items-center justify-between">

                    <h1 className="text-2xl font-bold">
                        Edit Supplier
                    </h1>

                    <Link
                        href={route("suppliers.index")}
                        className="rounded-lg bg-gray-700 px-5 py-2 text-white"
                    >
                        Back
                    </Link>

                </div>

                <form
                    onSubmit={submit}
                    className="space-y-6 rounded-xl bg-white p-6 shadow"
                >

                    <div>

                        <label className="mb-2 block font-medium">
                            Supplier Name
                        </label>

                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) =>
                                setData("name", e.target.value)
                            }
                            className="w-full rounded-lg border p-3"
                        />

                        {errors.name && (
                            <p className="mt-1 text-red-600">
                                {errors.name}
                            </p>
                        )}

                    </div>

                    <div>

                        <label className="mb-2 block font-medium">
                            Company Name
                        </label>

                        <input
                            type="text"
                            value={data.company_name}
                            onChange={(e) =>
                                setData("company_name", e.target.value)
                            }
                            className="w-full rounded-lg border p-3"
                        />

                    </div>

                    <div>

                        <label className="mb-2 block font-medium">
                            Phone
                        </label>

                        <input
                            type="text"
                            value={data.phone}
                            onChange={(e) =>
                                setData("phone", e.target.value)
                            }
                            className="w-full rounded-lg border p-3"
                        />

                        {errors.phone && (
                            <p className="mt-1 text-red-600">
                                {errors.phone}
                            </p>
                        )}

                    </div>

                    <div>

                        <label className="mb-2 block font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) =>
                                setData("email", e.target.value)
                            }
                            className="w-full rounded-lg border p-3"
                        />

                    </div>

                    <div>

                        <label className="mb-2 block font-medium">
                            Address
                        </label>

                        <textarea
                            rows="4"
                            value={data.address}
                            onChange={(e) =>
                                setData("address", e.target.value)
                            }
                            className="w-full rounded-lg border p-3"
                        />

                    </div>

                    <div className="flex items-center gap-3">

                        <input
                            type="checkbox"
                            checked={data.status}
                            onChange={(e) =>
                                setData("status", e.target.checked)
                            }
                        />

                        <label>Active Supplier</label>

                    </div>

                    <button
                        disabled={processing}
                        className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
                    >
                        Update Supplier
                    </button>

                </form>

            </div>

        </AuthenticatedLayout>
    );
}
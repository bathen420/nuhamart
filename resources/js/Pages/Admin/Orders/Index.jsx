import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Index({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Orders
                </h2>
            }
        >
            <Head title="Orders" />

            <div className="rounded-lg bg-white p-6 shadow">
                <h1 className="text-2xl font-bold">
                    Orders Module
                </h1>

                <p className="mt-2 text-gray-600">
                    Order List Coming Soon...
                </p>
            </div>

        </AuthenticatedLayout>
    );
}
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Dashboard({ auth, stats }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-2xl font-bold">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">

                <div className="rounded-xl bg-white p-6 shadow">
                    <h3 className="text-gray-500">Products</h3>
                    <p className="mt-3 text-3xl font-bold">
                        {stats.products}
                    </p>
                </div>

                <div className="rounded-xl bg-white p-6 shadow">
                    <h3 className="text-gray-500">Categories</h3>
                    <p className="mt-3 text-3xl font-bold">
                        {stats.categories}
                    </p>
                </div>

                <div className="rounded-xl bg-white p-6 shadow">
                    <h3 className="text-gray-500">Brands</h3>
                    <p className="mt-3 text-3xl font-bold">
                        {stats.brands}
                    </p>
                </div>

                <div className="rounded-xl bg-white p-6 shadow">
                    <h3 className="text-gray-500">Orders</h3>
                    <p className="mt-3 text-3xl font-bold">
                        {stats.orders}
                    </p>
                </div>

                <div className="rounded-xl bg-white p-6 shadow">
                    <h3 className="text-gray-500">Customers</h3>
                    <p className="mt-3 text-3xl font-bold">
                        {stats.customers}
                    </p>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
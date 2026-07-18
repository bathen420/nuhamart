import { Head, Link, router, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Pagination from "@/Components/Pagination";

export default function Index({ auth, orders, filters }) {

    const { data, setData, get } = useForm({
        search: filters.search || "",
    });

    const searchOrder = (e) => {
        e.preventDefault();

        get(route("orders.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const deleteOrder = (id) => {

        if (confirm("Are you sure you want to delete this order?")) {

            router.delete(route("orders.destroy", id));

        }

    };

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

            <div className="py-8">

                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    {/* Top Bar */}

                    <div className="mb-6 flex items-center justify-between">

                        <form
                            onSubmit={searchOrder}
                            className="flex gap-2"
                        >

                            <input
                                type="text"
                                placeholder="Search Order..."
                                value={data.search}
                                onChange={(e) =>
                                    setData("search", e.target.value)
                                }
                                className="w-72 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                            />

                            <button
                                className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                            >
                                Search
                            </button>

                        </form>

                        <Link
                            href={route("orders.create")}
                            className="rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700"
                        >
                            + Add Order
                        </Link>

                    </div>

                    {/* Table */}

                    <div className="overflow-hidden rounded-lg bg-white shadow">

                        <table className="min-w-full">

                            <thead className="bg-gray-100">

                                <tr>

                                    <th className="px-4 py-3 text-left">
                                        Order No
                                    </th>

                                    <th className="px-4 py-3 text-left">
                                        Customer
                                    </th>

                                    <th className="px-4 py-3 text-left">
                                        Phone
                                    </th>

                                    <th className="px-4 py-3 text-left">
                                        Total
                                    </th>

                                    <th className="px-4 py-3 text-left">
                                        Payment
                                    </th>

                                    <th className="px-4 py-3 text-left">
                                        Status
                                    </th>

                                    <th className="px-4 py-3 text-center">
                                        Action
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {orders.data.length > 0 ? (

                                    orders.data.map((order) => (

                                        <tr
                                            key={order.id}
                                            className="border-t hover:bg-gray-50"
                                        >

                                            <td className="px-4 py-3 font-medium">
                                                {order.order_number}
                                            </td>

                                            <td className="px-4 py-3">
                                                {order.customer_name}
                                            </td>

                                            <td className="px-4 py-3">
                                                {order.customer_phone}
                                            </td>

                                            <td className="px-4 py-3">
                                                ৳ {order.total}
                                            </td>

                                            <td className="px-4 py-3">

                                                <span
                                                    className={`rounded-full px-3 py-1 text-sm text-white

                                                    ${
                                                        order.payment_status === "Paid"
                                                            ? "bg-green-600"
                                                            : order.payment_status === "Failed"
                                                            ? "bg-red-600"
                                                            : "bg-yellow-500"
                                                    }`}
                                                >
                                                    {order.payment_status}
                                                </span>

                                            </td>

                                            <td className="px-4 py-3">

                                                <span
                                                    className={`rounded-full px-3 py-1 text-sm text-white

                                                    ${
                                                        order.order_status === "Delivered"
                                                            ? "bg-green-600"

                                                            : order.order_status === "Processing"
                                                            ? "bg-blue-600"

                                                            : order.order_status === "Shipped"
                                                            ? "bg-purple-600"

                                                            : order.order_status === "Cancelled"
                                                            ? "bg-red-600"

                                                            : "bg-yellow-500"
                                                    }`}
                                                >
                                                    {order.order_status}
                                                </span>

                                            </td>

                                            <td className="space-x-2 px-4 py-3 text-center">

                                                <Link
                                                    href={route("orders.show", order.id)}
                                                    className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                                                >
                                                    View
                                                </Link>

                                                <Link
                                                    href={route("orders.edit", order.id)}
                                                    className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    onClick={() =>
                                                        deleteOrder(order.id)
                                                    }
                                                    className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>

                                    ))

                                ) : (

                                    <tr>

                                        <td
                                            colSpan="7"
                                            className="py-8 text-center text-gray-500"
                                        >
                                            No Orders Found.
                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                        <Pagination links={orders.links} />

                    </div>

                </div>

            </div>

        </AuthenticatedLayout>

    );

}
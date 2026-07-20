import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Show({ auth, order }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold text-gray-800">
                    Order Details
                </h2>
            }
        >
            <Head title={`Order ${order.order_number}`} />

            <div className="mx-auto max-w-7xl py-6 space-y-6">

                {/* Header */}

                <div className="flex items-center justify-between rounded-xl bg-white p-6 shadow">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Order #{order.order_number}
                        </h1>

                        <p className="text-gray-500">
                            {new Date(order.created_at).toLocaleString()}
                        </p>
                    </div>

                    <Link
                        href={route("orders.index")}
                        className="rounded-lg bg-gray-700 px-5 py-2 text-white hover:bg-gray-800"
                    >
                        Back
                    </Link>
                </div>

                {/* Customer */}

                <div className="rounded-xl bg-white p-6 shadow">

                    <h2 className="mb-5 text-xl font-semibold">
                        Customer Information
                    </h2>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                        <div>
                            <p className="text-gray-500">Customer Name</p>
                            <p className="font-semibold">
                                {order.customer_name}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">Phone</p>
                            <p className="font-semibold">
                                {order.customer_phone}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">Email</p>
                            <p className="font-semibold">
                                {order.customer_email || "-"}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">Address</p>
                            <p className="font-semibold">
                                {order.customer_address}
                            </p>
                        </div>

                    </div>

                </div>

                {/* Order */}

                <div className="rounded-xl bg-white p-6 shadow">

                    <h2 className="mb-5 text-xl font-semibold">
                        Order Information
                    </h2>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

                        <div>
                            <p className="text-gray-500">Payment Method</p>
                            <p className="font-semibold">
                                {order.payment_method}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">Payment Status</p>
                            <p className="font-semibold">
                                {order.payment_status}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">Order Status</p>
                            <p className="font-semibold">
                                {order.order_status}
                            </p>
                        </div>

                    </div>

                </div>

                {/* Products */}

                <div className="rounded-xl bg-white p-6 shadow">

                    <h2 className="mb-5 text-xl font-semibold">
                        Ordered Products
                    </h2>

                    <div className="overflow-x-auto">

                        <table className="min-w-full border">

                            <thead className="bg-gray-100">

                                <tr>

                                    <th className="border px-4 py-3 text-left">
                                        Product
                                    </th>

                                    <th className="border px-4 py-3">
                                        Qty
                                    </th>

                                    <th className="border px-4 py-3">
                                        Price
                                    </th>

                                    <th className="border px-4 py-3">
                                        Subtotal
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {order.items.map((item) => (

                                    <tr key={item.id}>

                                        <td className="border p-3">
                                            {item.product?.name}
                                        </td>

                                        <td className="border p-3 text-center">
                                            {item.quantity}
                                        </td>

                                        <td className="border p-3 text-center">
                                            ৳ {Number(item.price).toFixed(2)}
                                        </td>

                                        <td className="border p-3 text-center font-semibold">
                                            ৳ {Number(item.subtotal).toFixed(2)}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

                {/* Summary */}

                <div className="rounded-xl bg-white p-6 shadow">

                    <h2 className="mb-5 text-xl font-semibold">
                        Order Summary
                    </h2>

                    <div className="space-y-3">

                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>
                                ৳ {Number(order.subtotal).toFixed(2)}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span>Discount</span>
                            <span>
                                ৳ {Number(order.discount).toFixed(2)}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>
                                ৳ {Number(order.shipping).toFixed(2)}
                            </span>
                        </div>

                        <hr />

                        <div className="flex justify-between text-2xl font-bold">

                            <span>Grand Total</span>

                            <span>
                                ৳ {Number(order.total).toFixed(2)}
                            </span>

                        </div>

                    </div>

                </div>

            </div>

        </AuthenticatedLayout>
    );
}
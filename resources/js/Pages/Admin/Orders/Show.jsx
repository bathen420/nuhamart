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

            <Head title="Order Details" />

            <div className="mx-auto max-w-6xl space-y-6">

                {/* Top */}

                <div className="flex items-center justify-between">

                    <h1 className="text-2xl font-bold">
                        Order #{order.order_number}
                    </h1>

                    <Link
                        href={route("orders.index")}
                        className="rounded-lg bg-gray-600 px-5 py-2 text-white"
                    >
                        Back
                    </Link>

                </div>

                <div className="grid grid-cols-2 gap-6">

                    {/* Customer */}

                    <div className="rounded-xl bg-white p-6 shadow">

                        <h2 className="mb-4 text-lg font-semibold">
                            Customer Information
                        </h2>

                        <div className="space-y-2">

                            <p>
                                <strong>Name :</strong> {order.customer_name}
                            </p>

                            <p>
                                <strong>Phone :</strong> {order.customer_phone}
                            </p>

                            <p>
                                <strong>Email :</strong> {order.customer_email}
                            </p>

                            <p>
                                <strong>Address :</strong>
                                <br />
                                {order.customer_address}
                            </p>

                        </div>

                    </div>

                    {/* Order */}

                    <div className="rounded-xl bg-white p-6 shadow">

                        <h2 className="mb-4 text-lg font-semibold">
                            Order Information
                        </h2>

                        <div className="space-y-2">

                            <p>

                                <strong>Subtotal :</strong>

                                ৳ {order.subtotal}

                            </p>

                            <p>

                                <strong>Discount :</strong>

                                ৳ {order.discount}

                            </p>

                            <p>

                                <strong>Shipping :</strong>

                                ৳ {order.shipping}

                            </p>

                            <p>

                                <strong>Total :</strong>

                                <span className="font-bold text-green-600">

                                    ৳ {order.total}

                                </span>

                            </p>

                        </div>

                    </div>

                </div>

                <div className="grid grid-cols-2 gap-6">

                    {/* Payment */}

                    <div className="rounded-xl bg-white p-6 shadow">

                        <h2 className="mb-4 text-lg font-semibold">
                            Payment
                        </h2>

                        <p>

                            <strong>Method :</strong>

                            {order.payment_method}

                        </p>

                        <p className="mt-3">

                            <strong>Status :</strong>

                            <span
                                className={`ml-2 rounded-full px-3 py-1 text-white

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

                        </p>

                    </div>

                    {/* Order Status */}

                    <div className="rounded-xl bg-white p-6 shadow">

                        <h2 className="mb-4 text-lg font-semibold">
                            Order Status
                        </h2>

                        <span
                            className={`rounded-full px-4 py-2 text-white

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

                    </div>

                </div>

                <div className="rounded-xl bg-white p-6 shadow">

                    <h2 className="mb-4 text-lg font-semibold">

                        Note

                    </h2>

                    <p>

                        {order.note || "No Note"}

                    </p>

                </div>

            </div>

        </AuthenticatedLayout>

    );

}
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const paymentBadge = (status) => {
    switch (status) {
        case "Paid":
            return "bg-green-100 text-green-700";
        case "Pending":
            return "bg-yellow-100 text-yellow-700";
        case "Failed":
            return "bg-red-100 text-red-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
};

const orderBadge = (status) => {
    switch (status) {
        case "Pending":
            return "bg-yellow-100 text-yellow-700";
        case "Processing":
            return "bg-blue-100 text-blue-700";
        case "Shipped":
            return "bg-purple-100 text-purple-700";
        case "Delivered":
            return "bg-green-100 text-green-700";
        case "Cancelled":
            return "bg-red-100 text-red-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
};

export default function Show({ auth, order }) {

    const printInvoice = () => {
        window.print();
    };

    return (
        <>
            <style>{`
                @media print{
                    nav,
                    aside,
                    header,
                    .print-hidden{
                        display:none !important;
                    }

                    body{
                        background:#fff;
                    }

                    #invoice{
                        width:100%;
                        max-width:100%;
                        box-shadow:none;
                        margin:0;
                        padding:0;
                    }
                }
            `}</style>

            <AuthenticatedLayout
                user={auth.user}
                header={
                    <h2 className="text-xl font-semibold">
                        Invoice
                    </h2>
                }
            >

                <Head title={`Invoice ${order.order_number}`} />

                <div
                    id="invoice"
                    className="mx-auto max-w-6xl space-y-6 bg-white p-8 shadow-xl"
                >

                    {/* Top Buttons */}

                    <div className="flex justify-between print-hidden">

                        <Link
                            href={route("orders.index")}
                            className="rounded-lg bg-gray-700 px-5 py-2 text-white"
                        >
                            ← Back
                        </Link>

                        <div className="space-x-3">

                            <button
                                onClick={printInvoice}
                                className="rounded-lg bg-blue-600 px-5 py-2 text-white"
                            >
                                🖨 Print
                            </button>

                            <a
                                href={route("orders.pdf", order.id)}
                                className="rounded-lg bg-red-600 px-5 py-2 text-white"
                            >
                                📄 PDF
                            </a>

                        </div>

                    </div>
                                        {/* Invoice Header */}

                    <div className="rounded-xl border-b-4 border-blue-600 pb-8">

                        <div className="flex flex-col justify-between md:flex-row">

                            <div>

                                <h1 className="text-4xl font-extrabold text-blue-700">
                                    NuhaMart
                                </h1>

                                <p className="mt-2 text-gray-500">
                                    Professional Inventory & POS System
                                </p>

                                <div className="mt-5 space-y-1 text-sm text-gray-500">

                                    <p>Dhaka, Bangladesh</p>

                                    <p>support@nuhamart.com</p>

                                    <p>+880 1700-000000</p>

                                </div>

                            </div>

                            <div className="mt-8 text-right md:mt-0">

                                <h2 className="text-5xl font-bold text-gray-700">
                                    INVOICE
                                </h2>

                                <div className="mt-6 space-y-2">

                                    <p>
                                        <span className="font-bold">
                                            Invoice #
                                        </span>
                                        <br />
                                        {order.order_number}
                                    </p>

                                    <p>
                                        <span className="font-bold">
                                            Date
                                        </span>
                                        <br />
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* Customer & Payment */}

                    <div className="grid gap-6 md:grid-cols-2">

                        <div className="rounded-xl bg-gray-50 p-6">

                            <h3 className="mb-5 border-b pb-2 text-xl font-bold">
                                Customer Information
                            </h3>

                            <div className="space-y-3">

                                <p>
                                    <strong>Name:</strong><br />
                                    {order.customer_name}
                                </p>

                                <p>
                                    <strong>Phone:</strong><br />
                                    {order.customer_phone}
                                </p>

                                <p>
                                    <strong>Email:</strong><br />
                                    {order.customer_email || "-"}
                                </p>

                                <p>
                                    <strong>Address:</strong><br />
                                    {order.customer_address}
                                </p>

                            </div>

                        </div>

                        <div className="rounded-xl bg-gray-50 p-6">

                            <h3 className="mb-5 border-b pb-2 text-xl font-bold">
                                Payment Information
                            </h3>

                            <div className="space-y-4">

                                <div className="flex justify-between">

                                    <span>Payment Method</span>

                                    <strong>{order.payment_method}</strong>

                                </div>

                                <div className="flex justify-between items-center">

                                    <span>Payment Status</span>

                                    <span
                                        className={`rounded-full px-3 py-1 text-sm font-semibold ${paymentBadge(order.payment_status)}`}
                                    >
                                        {order.payment_status}
                                    </span>

                                </div>

                                <div className="flex justify-between items-center">

                                    <span>Order Status</span>

                                    <span
                                        className={`rounded-full px-3 py-1 text-sm font-semibold ${orderBadge(order.order_status)}`}
                                    >
                                        {order.order_status}
                                    </span>

                                </div>

                                <div className="flex justify-between">

                                    <span>Created At</span>

                                    <strong>
                                        {new Date(order.created_at).toLocaleString()}
                                    </strong>

                                </div>

                            </div>

                        </div>

                    </div>
                                        {/* Products */}

                    <div className="rounded-xl bg-white p-6 shadow">

                        <h2 className="mb-6 text-2xl font-bold">
                            Ordered Products
                        </h2>

                        <div className="overflow-x-auto">

                            <table className="min-w-full border border-gray-200">

                                <thead className="bg-blue-600 text-white">

                                    <tr>

                                        <th className="border px-4 py-3 text-center w-16">
                                            #
                                        </th>

                                        <th className="border px-4 py-3 text-left">
                                            Product
                                        </th>

                                        <th className="border px-4 py-3 text-center">
                                            Qty
                                        </th>

                                        <th className="border px-4 py-3 text-right">
                                            Unit Price
                                        </th>

                                        <th className="border px-4 py-3 text-right">
                                            Total
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {order.items.map((item, index) => (

                                        <tr
                                            key={item.id}
                                            className="hover:bg-gray-50"
                                        >

                                            <td className="border px-4 py-3 text-center">
                                                {index + 1}
                                            </td>

                                            <td className="border px-4 py-3 font-medium">
                                                {item.product?.name || "-"}
                                            </td>

                                            <td className="border px-4 py-3 text-center">
                                                {item.quantity}
                                            </td>

                                            <td className="border px-4 py-3 text-right">
                                                ৳ {Number(item.price).toFixed(2)}
                                            </td>

                                            <td className="border px-4 py-3 text-right font-semibold">
                                                ৳ {Number(item.subtotal).toFixed(2)}
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    </div>

                    {/* Order Summary */}

                    <div className="flex justify-end">

                        <div className="w-full rounded-xl bg-white p-6 shadow md:w-[420px]">

                            <h2 className="mb-6 text-xl font-bold">
                                Order Summary
                            </h2>

                            <div className="space-y-4">

                                <div className="flex justify-between">

                                    <span>Subtotal</span>

                                    <strong>
                                        ৳ {Number(order.subtotal).toFixed(2)}
                                    </strong>

                                </div>

                                <div className="flex justify-between">

                                    <span>Discount</span>

                                    <strong>
                                        ৳ {Number(order.discount).toFixed(2)}
                                    </strong>

                                </div>

                                <div className="flex justify-between">

                                    <span>Shipping</span>

                                    <strong>
                                        ৳ {Number(order.shipping).toFixed(2)}
                                    </strong>

                                </div>

                                <hr />

                                <div className="flex justify-between text-2xl font-bold text-blue-700">

                                    <span>Grand Total</span>

                                    <span>
                                        ৳ {Number(order.total).toFixed(2)}
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                                        {/* Footer */}

                    <div className="rounded-xl bg-white p-8 shadow">

                        <div className="grid gap-8 md:grid-cols-2">

                            <div>

                                <h3 className="mb-3 text-lg font-bold">
                                    Notes
                                </h3>

                                <p className="text-gray-600">
                                    {order.note || "No additional notes."}
                                </p>

                            </div>

                            <div className="text-right">

                                <div className="mt-16 inline-block border-t border-black pt-2">

                                    <p className="font-semibold">
                                        Authorized Signature
                                    </p>

                                </div>

                            </div>

                        </div>

                        <div className="mt-10 border-t pt-6 text-center">

                            <h2 className="text-2xl font-bold text-blue-700">
                                Thank You For Your Business ❤️
                            </h2>

                            <p className="mt-2 text-gray-500">
                                Generated by NuhaMart Inventory & POS System
                            </p>

                        </div>

                    </div>

                </div>

            </AuthenticatedLayout>

        </>

    );

}
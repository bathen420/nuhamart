import { Head, Link, router, useForm } from "@inertiajs/react";
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
    const consignment = order.courier_consignments?.[0] ?? null;
    const workflow = useForm({
        status: order.status ?? "pending",
        payment_status: order.payment_status ?? "pending",
        courier_name: order.courier_name ?? "",
        tracking_number: order.tracking_number ?? "",
        admin_note: order.admin_note ?? "",
    });

    const updateWorkflow = (event) => {
        event.preventDefault();
        workflow.patch(route("admin.orders.workflow.update", order.id), { preserveScroll: true });
    };

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
                                        <form onSubmit={updateWorkflow} className="print-hidden rounded-xl border border-teal-100 bg-teal-50 p-5">
                        <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                            <div><h3 className="text-lg font-bold text-teal-900">Order Workflow</h3><p className="text-sm text-teal-700">Update payment, packing and courier details from one place.</p></div>
                            <button disabled={workflow.processing} className="rounded-lg bg-teal-700 px-5 py-2.5 font-semibold text-white disabled:opacity-50">{workflow.processing ? "Saving..." : "Save Workflow"}</button>
                        </div>
                        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <label className="text-sm font-medium">Order Status<select className="mt-1 w-full rounded-lg border-gray-300" value={workflow.data.status} onChange={e => workflow.setData("status", e.target.value)}>{[["pending","Pending"],["confirmed","Confirmed"],["processing","Packed / Processing"],["shipped","Shipped"],["delivered","Delivered"],["cancelled","Cancelled"]].map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
                            <label className="text-sm font-medium">Payment Status<select className="mt-1 w-full rounded-lg border-gray-300" value={workflow.data.payment_status} onChange={e => workflow.setData("payment_status", e.target.value)}>{["pending","paid","failed"].map(value => <option key={value} value={value}>{value.charAt(0).toUpperCase()+value.slice(1)}</option>)}</select></label>
                            <label className="text-sm font-medium">Courier<input className="mt-1 w-full rounded-lg border-gray-300" value={workflow.data.courier_name} onChange={e => workflow.setData("courier_name", e.target.value)} placeholder="Steadfast / Pathao" /></label>
                            <label className="text-sm font-medium">Tracking Number<input className="mt-1 w-full rounded-lg border-gray-300" value={workflow.data.tracking_number} onChange={e => workflow.setData("tracking_number", e.target.value)} /></label>
                            <label className="text-sm font-medium md:col-span-2 lg:col-span-4">Internal Admin Note<textarea rows="2" className="mt-1 w-full rounded-lg border-gray-300" value={workflow.data.admin_note} onChange={e => workflow.setData("admin_note", e.target.value)} /></label>
                        </div>
                        {Object.keys(workflow.errors).length > 0 && <p className="mt-3 text-sm text-red-600">Please review the workflow fields.</p>}
                    </form>

                    <section className="print-hidden rounded-xl border border-indigo-100 bg-indigo-50 p-5">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-indigo-900">Courier Delivery</h3>
                                <p className="text-sm text-indigo-700">Create and synchronize the Steadfast consignment from this order.</p>
                            </div>
                            {!consignment ? (
                                <button type="button" onClick={() => router.post(route("admin.orders.courier-consignments.store", order.id), { provider: "steadfast" }, { preserveScroll: true })} className="rounded-lg bg-indigo-700 px-5 py-2.5 font-semibold text-white">Send to Steadfast</button>
                            ) : (
                                <button type="button" onClick={() => router.post(route("admin.courier-consignments.sync", consignment.id), {}, { preserveScroll: true })} className="rounded-lg bg-indigo-700 px-5 py-2.5 font-semibold text-white">Sync Courier Status</button>
                            )}
                        </div>
                        {consignment && <div className="mt-4 grid gap-3 text-sm md:grid-cols-4">
                            <div><span className="block text-gray-500">Provider</span><strong className="capitalize">{consignment.provider}</strong></div>
                            <div><span className="block text-gray-500">Tracking</span><strong>{consignment.tracking_code || "Pending"}</strong></div>
                            <div><span className="block text-gray-500">Status</span><strong className="capitalize">{consignment.status?.replaceAll("_", " ")}</strong></div>
                            <div><span className="block text-gray-500">Last Sync</span><strong>{consignment.last_synced_at ? new Date(consignment.last_synced_at).toLocaleString() : "Never"}</strong></div>
                            {consignment.last_error && <p className="text-red-600 md:col-span-4">{consignment.last_error}</p>}
                        </div>}
                    </section>

                    {/* Invoice Header */}

                    <div className="rounded-xl border-b-4 border-blue-600 pb-8">

                        <div className="flex flex-col justify-between md:flex-row">

                            <div>

                                <h1 className="text-4xl font-extrabold text-blue-700">
                                    Nuha Mart BD
                                </h1>

                                <p className="mt-2 text-gray-500">
                                    Professional Inventory & POS System
                                </p>

                                <div className="mt-5 space-y-1 text-sm text-gray-500">

                                    <p>Dhaka, Bangladesh</p>

                                    <p>support@nuhamartbd.com</p>

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
                                Generated by Nuha Mart BD Inventory & POS System
                            </p>

                        </div>

                    </div>

                </div>

            </AuthenticatedLayout>

        </>

    );

}
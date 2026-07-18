import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Edit({ auth, order }) {

    const { data, setData, put, processing, errors } = useForm({

        order_number: order.order_number || "",
        customer_name: order.customer_name || "",
        customer_phone: order.customer_phone || "",
        customer_email: order.customer_email || "",
        customer_address: order.customer_address || "",

        subtotal: order.subtotal || 0,
        discount: order.discount || 0,
        shipping: order.shipping || 0,
        total: order.total || 0,

        payment_method: order.payment_method || "Cash On Delivery",
        payment_status: order.payment_status || "Pending",
        order_status: order.order_status || "Pending",

        note: order.note || "",

    });

    const submit = (e) => {

        e.preventDefault();

        put(route("orders.update", order.id));

    };

    return (

        <AuthenticatedLayout

            user={auth.user}

            header={
                <h2 className="text-xl font-semibold text-gray-800">
                    Edit Order
                </h2>
            }

        >

            <Head title="Edit Order" />

            <div className="mx-auto max-w-5xl">

                <div className="rounded-xl bg-white p-8 shadow">

                    <form
                        onSubmit={submit}
                        className="space-y-6"
                    >

                        <div className="grid grid-cols-2 gap-6">

                            <div>

                                <label>Order Number</label>

                                <input
                                    type="text"
                                    value={data.order_number}
                                    onChange={(e)=>setData("order_number",e.target.value)}
                                    className="w-full rounded border px-4 py-2"
                                />

                                <p className="text-red-600 text-sm">
                                    {errors.order_number}
                                </p>

                            </div>

                            <div>

                                <label>Customer Name</label>

                                <input
                                    type="text"
                                    value={data.customer_name}
                                    onChange={(e)=>setData("customer_name",e.target.value)}
                                    className="w-full rounded border px-4 py-2"
                                />

                                <p className="text-red-600 text-sm">
                                    {errors.customer_name}
                                </p>

                            </div>

                            <div>

                                <label>Customer Phone</label>

                                <input
                                    type="text"
                                    value={data.customer_phone}
                                    onChange={(e)=>setData("customer_phone",e.target.value)}
                                    className="w-full rounded border px-4 py-2"
                                />

                            </div>

                            <div>

                                <label>Customer Email</label>

                                <input
                                    type="email"
                                    value={data.customer_email}
                                    onChange={(e)=>setData("customer_email",e.target.value)}
                                    className="w-full rounded border px-4 py-2"
                                />

                            </div>

                        </div>

                        <div>

                            <label>Customer Address</label>

                            <textarea
                                rows="3"
                                value={data.customer_address}
                                onChange={(e)=>setData("customer_address",e.target.value)}
                                className="w-full rounded border px-4 py-2"
                            />

                        </div>

                        <div className="grid grid-cols-4 gap-6">

                            <div>

                                <label>Subtotal</label>

                                <input
                                    type="number"
                                    value={data.subtotal}
                                    onChange={(e)=>setData("subtotal",e.target.value)}
                                    className="w-full rounded border px-4 py-2"
                                />

                            </div>

                            <div>

                                <label>Discount</label>

                                <input
                                    type="number"
                                    value={data.discount}
                                    onChange={(e)=>setData("discount",e.target.value)}
                                    className="w-full rounded border px-4 py-2"
                                />

                            </div>

                            <div>

                                <label>Shipping</label>

                                <input
                                    type="number"
                                    value={data.shipping}
                                    onChange={(e)=>setData("shipping",e.target.value)}
                                    className="w-full rounded border px-4 py-2"
                                />

                            </div>

                            <div>

                                <label>Total</label>

                                <input
                                    type="number"
                                    value={data.total}
                                    onChange={(e)=>setData("total",e.target.value)}
                                    className="w-full rounded border px-4 py-2"
                                />

                            </div>

                        </div>

                        <div className="grid grid-cols-3 gap-6">

                            <div>

                                <label>Payment Method</label>

                                <select
                                    value={data.payment_method}
                                    onChange={(e)=>setData("payment_method",e.target.value)}
                                    className="w-full rounded border px-4 py-2"
                                >
                                    <option>Cash On Delivery</option>
                                    <option>BKash</option>
                                    <option>Nagad</option>
                                    <option>Card</option>
                                </select>

                            </div>

                            <div>

                                <label>Payment Status</label>

                                <select
                                    value={data.payment_status}
                                    onChange={(e)=>setData("payment_status",e.target.value)}
                                    className="w-full rounded border px-4 py-2"
                                >
                                    <option>Pending</option>
                                    <option>Paid</option>
                                    <option>Failed</option>
                                </select>

                            </div>

                            <div>

                                <label>Order Status</label>

                                <select
                                    value={data.order_status}
                                    onChange={(e)=>setData("order_status",e.target.value)}
                                    className="w-full rounded border px-4 py-2"
                                >
                                    <option>Pending</option>
                                    <option>Processing</option>
                                    <option>Shipped</option>
                                    <option>Delivered</option>
                                    <option>Cancelled</option>
                                </select>

                            </div>

                        </div>

                        <div>

                            <label>Note</label>

                            <textarea
                                rows="4"
                                value={data.note}
                                onChange={(e)=>setData("note",e.target.value)}
                                className="w-full rounded border px-4 py-2"
                            />

                        </div>

                        <button
                            disabled={processing}
                            className="rounded-lg bg-blue-600 px-8 py-3 text-white hover:bg-blue-700"
                        >
                            Update Order
                        </button>

                    </form>

                </div>

            </div>

        </AuthenticatedLayout>

    );

}
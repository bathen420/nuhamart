import axios from "axios";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import {
    AlertTriangle,
    ArrowLeft,
    CheckCircle2,
    Circle,
    Download,
    MapPin,
    Package,
    RefreshCw,
    Truck,
    WalletCards,
} from "lucide-react";
import { useState } from "react";
import CustomerAccountLayout from "@/Layouts/CustomerAccountLayout";
import useCart from "@/hooks/useCart";

const money = (value) => `৳${Number(value || 0).toLocaleString("en-BD")}`;

const stages = [
    ["pending", "Order placed"],
    ["confirmed", "Confirmed"],
    ["processing", "Processing"],
    ["shipped", "Shipped"],
    ["delivered", "Delivered"],
];

const statusClass = {
    pending: "bg-amber-50 text-amber-700",
    confirmed: "bg-blue-50 text-blue-700",
    processing: "bg-indigo-50 text-indigo-700",
    shipped: "bg-violet-50 text-violet-700",
    delivered: "bg-emerald-50 text-emerald-700",
    cancelled: "bg-rose-50 text-rose-700",
};

export default function Show({ order }) {
    const { flash = {} } = usePage().props;
    const { addToCart } = useCart();
    const [reordering, setReordering] = useState(false);
    const [reorderMessage, setReorderMessage] = useState("");
    const [showCancel, setShowCancel] = useState(false);

    const cancelForm = useForm({ reason: "" });

    const current = Math.max(
        0,
        stages.findIndex(([value]) => value === order.status),
    );

    const reorder = async () => {
        setReordering(true);
        setReorderMessage("");

        try {
            const response = await axios.post(
                route("customer.orders.reorder", order.id),
            );

            response.data.items.forEach((item) => {
                addToCart({ ...item, quantity: item.quantity });
            });

            const skipped = Number(response.data.skipped || 0);

            setReorderMessage(
                response.data.items.length
                    ? `${response.data.items.length} product(s) added to cart${
                          skipped ? `; ${skipped} unavailable product(s) skipped` : ""
                      }.`
                    : "No products from this order are currently available.",
            );
        } catch {
            setReorderMessage("Unable to reorder right now. Please try again.");
        } finally {
            setReordering(false);
        }
    };

    const requestCancellation = (event) => {
        event.preventDefault();

        cancelForm.post(
            route("customer.orders.cancel-request", order.id),
            {
                preserveScroll: true,
                onSuccess: () => {
                    setShowCancel(false);
                    cancelForm.reset();
                },
            },
        );
    };

    return (
        <CustomerAccountLayout title={order.order_no}>
            <Head title={order.order_no} />

            <div className="space-y-6">
                {(flash.status === "cancellation-requested" ||
                    order.cancellation_requested_at) && (
                    <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-800">
                        <AlertTriangle size={20} className="mt-0.5 shrink-0" />
                        Cancellation request submitted. Our team will review it.
                    </div>
                )}

                <section className="rounded-3xl bg-white p-5 shadow-sm sm:p-7">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <Link
                                href={route("customer.orders.index")}
                                className="inline-flex items-center gap-2 text-sm font-black text-teal-700"
                            >
                                <ArrowLeft size={17} />
                                Back to orders
                            </Link>

                            <h1 className="mt-4 text-3xl font-black text-slate-900">
                                {order.order_no}
                            </h1>
                            <p className="mt-2 text-sm text-slate-500">
                                Placed{" "}
                                {order.ordered_at
                                    ? new Date(order.ordered_at).toLocaleString()
                                    : ""}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <a
                                href={route("customer.orders.invoice", order.id)}
                                className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 hover:border-teal-300 hover:text-teal-700"
                            >
                                <Download size={17} />
                                Download invoice
                            </a>

                            <button
                                type="button"
                                onClick={reorder}
                                disabled={reordering}
                                className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-black text-white hover:bg-teal-700 disabled:opacity-50"
                            >
                                <RefreshCw
                                    size={17}
                                    className={reordering ? "animate-spin" : ""}
                                />
                                {reordering ? "Adding..." : "Reorder"}
                            </button>
                        </div>
                    </div>

                    {reorderMessage && (
                        <p className="mt-4 rounded-xl bg-teal-50 p-3 text-sm font-bold text-teal-700">
                            {reorderMessage}
                        </p>
                    )}
                </section>

                <section className="rounded-3xl bg-white p-5 shadow-sm sm:p-7">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[.2em] text-teal-700">
                                Current status
                            </p>
                            <h2 className="mt-2 text-xl font-black">
                                Order progress
                            </h2>
                        </div>

                        <span
                            className={`rounded-full px-4 py-2 text-xs font-black capitalize ${
                                statusClass[order.status] || "bg-slate-100 text-slate-700"
                            }`}
                        >
                            {order.status}
                        </span>
                    </div>

                    {order.status === "cancelled" ? (
                        <div className="mt-6 rounded-2xl bg-rose-50 p-5 text-sm font-bold text-rose-700">
                            This order has been cancelled.
                        </div>
                    ) : (
                        <div className="mt-7 grid gap-4 sm:grid-cols-5">
                            {stages.map(([status, label], index) => {
                                const complete = index <= current;

                                return (
                                    <div key={status} className="relative flex items-center gap-3 sm:block">
                                        {index < stages.length - 1 && (
                                            <span
                                                className={`absolute left-5 top-10 hidden h-0.5 w-[calc(100%-1rem)] sm:block ${
                                                    index < current ? "bg-teal-600" : "bg-slate-200"
                                                }`}
                                            />
                                        )}

                                        {complete ? (
                                            <CheckCircle2 className="relative z-10 text-teal-600" size={25} />
                                        ) : (
                                            <Circle className="relative z-10 text-slate-300" size={25} />
                                        )}

                                        <p
                                            className={`text-sm font-black sm:mt-3 ${
                                                complete ? "text-slate-900" : "text-slate-400"
                                            }`}
                                        >
                                            {label}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {order.timeline?.length > 0 && (
                        <div className="mt-8 border-t pt-6">
                            <h3 className="font-black text-slate-900">
                                Detailed timeline
                            </h3>

                            <div className="mt-4 space-y-4">
                                {order.timeline.map((event, index) => (
                                    <div key={`${event.status}-${index}`} className="flex gap-3">
                                        <CheckCircle2
                                            size={19}
                                            className="mt-0.5 shrink-0 text-teal-600"
                                        />
                                        <div>
                                            <p className="font-black text-slate-800">
                                                {event.title || event.status}
                                            </p>
                                            {event.note && (
                                                <p className="mt-1 text-sm text-slate-500">
                                                    {event.note}
                                                </p>
                                            )}
                                            <p className="mt-1 text-xs text-slate-400">
                                                {event.recorded_at
                                                    ? new Date(event.recorded_at).toLocaleString()
                                                    : ""}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>

                <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                    <section className="rounded-3xl bg-white p-5 shadow-sm sm:p-7">
                        <div className="flex items-center gap-3">
                            <Package className="text-teal-700" />
                            <h2 className="text-xl font-black">Order items</h2>
                        </div>

                        <div className="mt-5 divide-y divide-slate-100">
                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="grid gap-3 py-4 sm:grid-cols-[1fr_auto]"
                                >
                                    <div className="flex gap-3">
                                        {item.product?.image && (
                                            <img
                                                src={item.product.image}
                                                alt={item.name}
                                                className="h-16 w-16 rounded-xl border object-contain p-1"
                                            />
                                        )}
                                        <div>
                                            <p className="font-black text-slate-900">
                                                {item.name}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500">
                                                Qty {item.quantity} × {money(item.unit_price)}
                                            </p>
                                        </div>
                                    </div>
                                    <b className="self-center sm:text-right">
                                        {money(item.subtotal)}
                                    </b>
                                </div>
                            ))}
                        </div>
                    </section>

                    <aside className="space-y-6">
                        <section className="rounded-3xl bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <WalletCards className="text-teal-700" />
                                <h2 className="text-lg font-black">Payment summary</h2>
                            </div>

                            <div className="mt-5 space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <b>{money(order.subtotal)}</b>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <b>{money(order.shipping_charge)}</b>
                                </div>
                                {Number(order.discount) > 0 && (
                                    <div className="flex justify-between text-emerald-700">
                                        <span>Discount</span>
                                        <b>-{money(order.discount)}</b>
                                    </div>
                                )}
                                <div className="flex justify-between border-t pt-4 text-lg">
                                    <b>Total</b>
                                    <b className="text-teal-700">{money(order.total)}</b>
                                </div>
                                <p className="border-t pt-4 capitalize text-slate-500">
                                    {order.payment_method} · {order.payment_status}
                                </p>

                                {order.payment_transaction && (
                                    <div className="rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600">
                                        <p>
                                            Transaction:{" "}
                                            <b>{order.payment_transaction.transaction_id}</b>
                                        </p>
                                        {order.payment_transaction.bank_transaction_id && (
                                            <p>
                                                Bank transaction:{" "}
                                                <b>{order.payment_transaction.bank_transaction_id}</b>
                                            </p>
                                        )}
                                        <p className="capitalize">
                                            Gateway status:{" "}
                                            <b>{order.payment_transaction.status}</b>
                                        </p>
                                        {order.payment_transaction.failure_reason && (
                                            <p className="mt-1 font-bold text-rose-600">
                                                {order.payment_transaction.failure_reason}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {order.can_retry_payment && (
                                    <Link
                                        href={route("payments.sslcommerz.retry", order.id)}
                                        method="post"
                                        as="button"
                                        className="flex w-full items-center justify-center rounded-xl bg-teal-700 px-4 py-3 text-sm font-black text-white hover:bg-teal-800"
                                    >
                                        Retry online payment
                                    </Link>
                                )}
                            </div>
                        </section>

                        <section className="rounded-3xl bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <MapPin className="text-teal-700" />
                                <h2 className="text-lg font-black">Delivery details</h2>
                            </div>

                            <div className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
                                <p className="font-black text-slate-900">
                                    {order.customer_name}
                                </p>
                                <p>{order.customer_phone}</p>
                                {order.customer_email && <p>{order.customer_email}</p>}
                                <p>{order.full_address}</p>
                                {order.courier_name && (
                                    <p className="pt-2">
                                        Courier: <b>{order.courier_name}</b>
                                    </p>
                                )}
                                {order.tracking_number && (
                                    <p>
                                        Tracking: <b>{order.tracking_number}</b>
                                    </p>
                                )}
                            </div>

                            <Link
                                href={route("orders.track")}
                                className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-teal-50 px-4 py-3 text-sm font-black text-teal-700"
                            >
                                <Truck size={17} />
                                Track order
                            </Link>
                        </section>
                    </aside>
                </div>

                {order.can_request_cancellation && (
                    <section className="rounded-3xl border border-rose-100 bg-white p-5 shadow-sm sm:p-7">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-black text-slate-900">
                                    Need to cancel?
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Cancellation can be requested while the order is pending or confirmed.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowCancel((value) => !value)}
                                className="rounded-xl bg-rose-50 px-5 py-3 text-sm font-black text-rose-600"
                            >
                                Request cancellation
                            </button>
                        </div>

                        {showCancel && (
                            <form onSubmit={requestCancellation} className="mt-5">
                                <textarea
                                    value={cancelForm.data.reason}
                                    onChange={(event) => cancelForm.setData("reason", event.target.value)}
                                    rows="4"
                                    placeholder="Tell us why you want to cancel this order..."
                                    className="w-full rounded-xl border-slate-300 focus:border-rose-500 focus:ring-rose-500"
                                />
                                {cancelForm.errors.reason && (
                                    <p className="mt-2 text-sm font-bold text-rose-600">
                                        {cancelForm.errors.reason}
                                    </p>
                                )}
                                <button
                                    disabled={cancelForm.processing}
                                    className="mt-3 rounded-xl bg-rose-600 px-5 py-3 text-sm font-black text-white disabled:opacity-50"
                                >
                                    {cancelForm.processing ? "Submitting..." : "Submit request"}
                                </button>
                            </form>
                        )}
                    </section>
                )}
            </div>
        </CustomerAccountLayout>
    );
}

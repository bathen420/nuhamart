import { Head, Link, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Show({ auth, purchase }) {
    const { flash = {}, errors = {}, businessSettings = {} } = usePage().props;
    const companyName = businessSettings.company_name || "Nuha Mart BD";
    const currencySymbol = businessSettings.currency_symbol || "৳";

    const formatMoney = (amount) =>
        Number(amount || 0).toLocaleString("en-BD", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    const formatDate = (date, includeTime = false) => {
        if (!date) {
            return "—";
        }

        const options = {
            day: "2-digit",
            month: "long",
            year: "numeric",
        };

        if (includeTime) {
            options.hour = "2-digit";
            options.minute = "2-digit";
        }

        return new Intl.DateTimeFormat("en-GB", options).format(
            new Date(date)
        );
    };

    const paymentStatus = String(
        purchase.payment_status || "unpaid"
    ).toLowerCase();

    const statusLabel =
        paymentStatus === "paid"
            ? "PAID"
            : paymentStatus === "partial"
              ? "PARTIAL"
              : "UNPAID";

    const statusClass =
        paymentStatus === "paid"
            ? "bg-green-100 text-green-700"
            : paymentStatus === "partial"
              ? "bg-amber-100 text-amber-700"
              : "bg-red-100 text-red-700";

    const deletePurchase = () => {
        const confirmed = window.confirm(
            `Are you sure you want to delete purchase ${purchase.purchase_number}?`
        );

        if (!confirmed) {
            return;
        }

        router.delete(
            route("admin.purchases.destroy", purchase.id)
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold text-gray-800">
                    Purchase Details
                </h2>
            }
        >
            <Head title={`Purchase ${purchase.purchase_number}`} />

            <style>{`
                @page {
                    size: A4 portrait;
                    margin: 10mm;
                }

                @media print {
                    html,
                    body {
                        width: 210mm !important;
                        min-height: 297mm !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        background: #ffffff !important;
                    }

                    body * {
                        visibility: hidden !important;
                    }

                    #print-invoice,
                    #print-invoice * {
                        visibility: visible !important;
                    }

                    #print-invoice {
                        position: absolute !important;
                        top: 0 !important;
                        left: 0 !important;
                        width: 190mm !important;
                        min-height: auto !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        background: #ffffff !important;
                        box-shadow: none !important;
                        border: 0 !important;
                    }

                    .no-print {
                        display: none !important;
                    }

                    .print-grid {
                        display: grid !important;
                        grid-template-columns: 1fr 1fr !important;
                        gap: 10px !important;
                    }

                    .print-table {
                        width: 100% !important;
                        border-collapse: collapse !important;
                    }

                    .print-table th,
                    .print-table td {
                        border: 1px solid #d1d5db !important;
                        padding: 7px !important;
                        font-size: 11px !important;
                    }

                    .avoid-break {
                        break-inside: avoid !important;
                        page-break-inside: avoid !important;
                    }

                    a {
                        text-decoration: none !important;
                    }
                }
            `}</style>

            <div className="py-8">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <div className="no-print">
                        {flash.success && (
                            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
                                {flash.success}
                            </div>
                        )}

                        {errors.error && (
                            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                                {errors.error}
                            </div>
                        )}

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {purchase.purchase_number}
                                </h1>
                                <p className="mt-1 text-sm text-gray-500">
                                    Created {formatDate(purchase.created_at, true)}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Link
                                    href={route("admin.purchases.index")}
                                    className="rounded-lg bg-gray-600 px-4 py-2 font-semibold text-white hover:bg-gray-700"
                                >
                                    Back
                                </Link>

                                <button
                                    type="button"
                                    onClick={() => window.print()}
                                    className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
                                >
                                    Print
                                </button>

                                <a
                                    href={route(
                                        "admin.purchases.pdf",
                                        purchase.id
                                    )}
                                    className="rounded-lg bg-purple-600 px-4 py-2 font-semibold text-white hover:bg-purple-700"
                                >
                                    Download PDF
                                </a>

                                <Link
                                    href={route("admin.purchases.returns.create", purchase.id)}
                                    className="rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white hover:bg-orange-700"
                                >
                                    Purchase Return
                                </Link>

                                <button
                                    type="button"
                                    onClick={deletePurchase}
                                    className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>

                    <section
                        id="print-invoice"
                        className="relative overflow-hidden rounded-xl bg-white p-6 shadow sm:p-8"
                    >
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
                            <span className="rotate-[-28deg] text-8xl font-black tracking-widest text-gray-100">
                                {statusLabel}
                            </span>
                        </div>

                        <div className="relative">
                            <div className="avoid-break flex items-start justify-between border-b-2 border-blue-600 pb-5">
                                <div>
                                    <h1 className="text-3xl font-black text-blue-600">
                                        {companyName}
                                    </h1>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {businessSettings.company_tagline || "Inventory & POS System"}
                                    </p>
                                    <div className="mt-3 space-y-1 text-xs text-gray-600">
                                        {businessSettings.address && <p>{businessSettings.address}</p>}
                                        {businessSettings.email && <p>Email: {businessSettings.email}</p>}
                                        {businessSettings.phone && <p>Phone: {businessSettings.phone}</p>}
                                    </div>
                                </div>

                                <div className="text-right">
                                    <h2 className="text-2xl font-black text-gray-900">
                                        PURCHASE
                                    </h2>
                                    <p className="mt-3 text-xs font-semibold text-gray-500">
                                        Purchase No.
                                    </p>
                                    <p className="text-sm font-bold text-gray-900">
                                        {purchase.purchase_number}
                                    </p>
                                    <p className="mt-3 text-xs font-semibold text-gray-500">
                                        Purchase Date
                                    </p>
                                    <p className="text-sm font-bold text-gray-900">
                                        {formatDate(
                                            purchase.purchase_date ||
                                                purchase.created_at
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="print-grid avoid-break mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                                <InfoCard title="Purchase Information">
                                    <InvoiceRow
                                        label="Purchase Number"
                                        value={purchase.purchase_number}
                                    />
                                    <InvoiceRow
                                        label="Date"
                                        value={formatDate(
                                            purchase.purchase_date ||
                                                purchase.created_at
                                        )}
                                    />
                                    <InvoiceRow
                                        label="Created By"
                                        value={purchase.user?.name || "—"}
                                    />
                                    <InvoiceRow
                                        label="Payment Method"
                                        value={formatPaymentMethod(
                                            purchase.payment_method
                                        )}
                                    />
                                </InfoCard>

                                <InfoCard title="Supplier Information">
                                    <InvoiceRow
                                        label="Supplier"
                                        value={purchase.supplier?.name || "—"}
                                    />
                                    <InvoiceRow
                                        label="Phone"
                                        value={purchase.supplier?.phone || "—"}
                                    />
                                    <InvoiceRow
                                        label="Email"
                                        value={purchase.supplier?.email || "—"}
                                    />
                                    <InvoiceRow
                                        label="Address"
                                        value={purchase.supplier?.address || "—"}
                                    />
                                </InfoCard>
                            </div>

                            <div className="mt-5 overflow-x-auto">
                                <table className="print-table min-w-full border-collapse">
                                    <thead>
                                        <tr className="bg-blue-600 text-white">
                                            <th className="border border-blue-500 px-3 py-3 text-left text-xs">
                                                #
                                            </th>
                                            <th className="border border-blue-500 px-3 py-3 text-left text-xs">
                                                Product
                                            </th>
                                            <th className="border border-blue-500 px-3 py-3 text-center text-xs">
                                                Quantity
                                            </th>
                                            <th className="border border-blue-500 px-3 py-3 text-right text-xs">
                                                Buy Price
                                            </th>
                                            <th className="border border-blue-500 px-3 py-3 text-right text-xs">
                                                Subtotal
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {purchase.items?.length > 0 ? (
                                            purchase.items.map((item, index) => (
                                                <tr key={item.id || index}>
                                                    <td className="border px-3 py-3 text-sm text-gray-700">
                                                        {index + 1}
                                                    </td>
                                                    <td className="border px-3 py-3 text-sm font-semibold text-gray-900">
                                                        {item.product?.name ||
                                                            "Deleted product"}
                                                    </td>
                                                    <td className="border px-3 py-3 text-center text-sm">
                                                        {item.quantity}
                                                    </td>
                                                    <td className="border px-3 py-3 text-right text-sm">
                                                        {currencySymbol} {formatMoney(item.price)}
                                                    </td>
                                                    <td className="border px-3 py-3 text-right text-sm font-bold">
                                                        {currencySymbol}{" "}
                                                        {formatMoney(
                                                            item.subtotal
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="border py-8 text-center text-gray-500"
                                                >
                                                    No purchase items found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="avoid-break mt-5 flex justify-end">
                                <div className="w-full max-w-md overflow-hidden border border-gray-200">
                                    <SummaryRow
                                        label="Subtotal"
                                        value={`${currencySymbol} ${formatMoney(
                                            purchase.subtotal
                                        )}`}
                                    />
                                    <SummaryRow
                                        label="Discount"
                                        value={`${currencySymbol} ${formatMoney(
                                            purchase.discount
                                        )}`}
                                    />
                                    <SummaryRow
                                        label="Shipping"
                                        value={`${currencySymbol} ${formatMoney(
                                            purchase.shipping
                                        )}`}
                                    />
                                    <SummaryRow
                                        label="Grand Total"
                                        value={`${currencySymbol} ${formatMoney(
                                            purchase.total
                                        )}`}
                                        strong
                                    />
                                    <SummaryRow
                                        label="Paid Amount"
                                        value={`${currencySymbol} ${formatMoney(
                                            purchase.paid_amount
                                        )}`}
                                    />
                                    <SummaryRow
                                        label="Due Amount"
                                        value={`${currencySymbol} ${formatMoney(
                                            purchase.due_amount
                                        )}`}
                                    />

                                    <div className="flex items-center justify-between border-t bg-gray-50 px-4 py-3">
                                        <span className="text-sm font-bold text-gray-700">
                                            Payment Status
                                        </span>
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-black ${statusClass}`}
                                        >
                                            {statusLabel}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="avoid-break mt-5 rounded border border-gray-200 p-4">
                                <p className="text-sm font-bold text-gray-900">
                                    Note
                                </p>
                                <p className="mt-2 whitespace-pre-line text-sm text-gray-600">
                                    {purchase.note ||
                                        "No note was added for this purchase."}
                                </p>
                            </div>

                            <div className="avoid-break mt-12 grid grid-cols-2 gap-16">
                                <div className="border-t border-gray-500 pt-2 text-center text-xs text-gray-600">
                                    Supplier Signature
                                </div>
                                <div className="border-t border-gray-500 pt-2 text-center text-xs text-gray-600">
                                    Authorized Signature
                                </div>
                            </div>

                            <div className="avoid-break mt-8 border-t pt-4 text-center text-[10px] text-gray-400">
                                This purchase document was generated automatically
                                by {companyName}.
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function InfoCard({ title, children }) {
    return (
        <div className="rounded-lg border border-gray-200 p-4">
            <h3 className="mb-3 border-b pb-2 text-sm font-black text-gray-900">
                {title}
            </h3>
            <div className="space-y-2">{children}</div>
        </div>
    );
}

function InvoiceRow({ label, value }) {
    return (
        <div className="grid grid-cols-[130px_1fr] gap-3 text-xs">
            <span className="font-bold text-gray-700">{label}:</span>
            <span className="break-words text-gray-700">{value}</span>
        </div>
    );
}

function SummaryRow({ label, value, strong = false }) {
    return (
        <div
            className={`flex items-center justify-between border-b px-4 py-3 ${
                strong ? "bg-blue-600 text-white" : "bg-white"
            }`}
        >
            <span className={`text-sm ${strong ? "font-black" : "font-semibold"}`}>
                {label}
            </span>
            <span className={`text-sm ${strong ? "font-black" : "font-semibold"}`}>
                {value}
            </span>
        </div>
    );
}

function formatPaymentMethod(method) {
    if (!method) {
        return "—";
    }

    return String(method)
        .replaceAll("_", " ")
        .replace(/\b\w/g, (character) => character.toUpperCase());
}

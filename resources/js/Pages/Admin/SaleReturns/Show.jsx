import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";

function formatMoney(value) {
    const amount = Number(value ?? 0);

    return new Intl.NumberFormat("en-BD", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number.isFinite(amount) ? amount : 0);
}

function formatDate(value) {
    if (!value) {
        return "N/A";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("en-BD", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
}

function formatStatus(value) {
    if (!value) {
        return "N/A";
    }

    return String(value)
        .replaceAll("_", " ")
        .replaceAll("-", " ")
        .replace(/\b\w/g, (character) =>
            character.toUpperCase()
        );
}

export default function Show({
    saleReturn = {},
}) {
    const page = usePage();

    const businessSettings =
        page.props?.businessSettings ?? {};

    const companyName =
        businessSettings.company_name ??
        businessSettings.business_name ??
        "Nuha Mart BD";

    const currencySymbol =
        businessSettings.currency_symbol ??
        "৳";

    const returnItems = Array.isArray(
        saleReturn?.items
    )
        ? saleReturn.items
        : [];

    const returnNumber =
        saleReturn?.return_number ??
        saleReturn?.return_no ??
        `Return #${saleReturn?.id ?? ""}`;

    const originalSaleNumber =
        saleReturn?.sale?.sale_number ??
        saleReturn?.sale?.invoice_no ??
        saleReturn?.sale?.sale_no ??
        "N/A";

    const customerName =
        saleReturn?.customer?.name ??
        saleReturn?.sale?.customer?.name ??
        saleReturn?.customer_name ??
        "Walk-in Customer";

    const createdBy =
        saleReturn?.user?.name ??
        saleReturn?.created_by_user?.name ??
        "N/A";

    const refundMethod =
        formatStatus(
            saleReturn?.refund_method
        );

    const returnSubtotal =
        saleReturn?.subtotal ??
        saleReturn?.total ??
        0;

    const refundAmount =
        saleReturn?.refund_amount ??
        saleReturn?.total ??
        0;

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Sales Return Details
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        View sales return invoice and
                        refund information.
                    </p>
                </div>
            }
        >
            <Head title={returnNumber} />

            <section className="space-y-6">
                <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {returnNumber}
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Original sale:{" "}
                            {originalSaleNumber}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Link
                            href={route(
                                "admin.sale-returns.index"
                            )}
                            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                        >
                            Back
                        </Link>

                        <button
                            type="button"
                            onClick={() =>
                                window.print()
                            }
                            className="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                        >
                            Print
                        </button>
                    </div>
                </div>

                <section
                    id="print-invoice"
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                >
                    <div className="border-b-2 border-red-600 p-6 sm:flex sm:items-start sm:justify-between">
                        <div>
                            <h2 className="text-3xl font-black text-red-600">
                                {companyName}
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Sales Return Invoice
                            </p>
                        </div>

                        <div className="mt-4 text-left sm:mt-0 sm:text-right">
                            <p className="font-bold text-gray-900">
                                {returnNumber}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                                {formatDate(
                                    saleReturn?.return_date ??
                                        saleReturn?.created_at
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-x-8 gap-y-1 p-6 md:grid-cols-2">
                        <Info
                            label="Original Invoice"
                            value={originalSaleNumber}
                        />

                        <Info
                            label="Customer"
                            value={customerName}
                        />

                        <Info
                            label="Refund Method"
                            value={refundMethod}
                        />

                        <Info
                            label="Created By"
                            value={createdBy}
                        />

                        {saleReturn?.status && (
                            <Info
                                label="Status"
                                value={formatStatus(
                                    saleReturn.status
                                )}
                            />
                        )}
                    </div>

                    <div className="overflow-x-auto px-6">
                        <table className="min-w-full border-collapse">
                            <thead className="bg-red-600 text-white">
                                <tr>
                                    <th className="border border-red-500 px-4 py-3 text-left text-sm font-semibold">
                                        #
                                    </th>

                                    <th className="border border-red-500 px-4 py-3 text-left text-sm font-semibold">
                                        Product
                                    </th>

                                    <th className="border border-red-500 px-4 py-3 text-center text-sm font-semibold">
                                        Qty
                                    </th>

                                    <th className="border border-red-500 px-4 py-3 text-right text-sm font-semibold">
                                        Price
                                    </th>

                                    <th className="border border-red-500 px-4 py-3 text-right text-sm font-semibold">
                                        Subtotal
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {returnItems.length > 0 ? (
                                    returnItems.map(
                                        (
                                            item,
                                            index
                                        ) => {
                                            const productName =
                                                item
                                                    ?.product
                                                    ?.name ??
                                                item
                                                    ?.product_variant
                                                    ?.product
                                                    ?.name ??
                                                item
                                                    ?.variant
                                                    ?.product
                                                    ?.name ??
                                                item
                                                    ?.product_name ??
                                                "Unknown Product";

                                            const quantity =
                                                Number(
                                                    item?.quantity ??
                                                        item?.qty ??
                                                        0
                                                );

                                            const price =
                                                item?.price ??
                                                item?.unit_price ??
                                                0;

                                            const subtotal =
                                                item?.subtotal ??
                                                Number(
                                                    price
                                                ) *
                                                    quantity;

                                            return (
                                                <tr
                                                    key={
                                                        item?.id ??
                                                        index
                                                    }
                                                    className="border-b border-gray-200"
                                                >
                                                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">
                                                        {index +
                                                            1}
                                                    </td>

                                                    <td className="border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900">
                                                        {
                                                            productName
                                                        }

                                                        {item
                                                            ?.product_variant
                                                            ?.name && (
                                                            <div className="mt-0.5 text-xs text-gray-500">
                                                                {
                                                                    item
                                                                        .product_variant
                                                                        .name
                                                                }
                                                            </div>
                                                        )}
                                                    </td>

                                                    <td className="border border-gray-200 px-4 py-3 text-center text-sm text-gray-700">
                                                        {
                                                            quantity
                                                        }
                                                    </td>

                                                    <td className="whitespace-nowrap border border-gray-200 px-4 py-3 text-right text-sm text-gray-700">
                                                        {
                                                            currencySymbol
                                                        }
                                                        {formatMoney(
                                                            price
                                                        )}
                                                    </td>

                                                    <td className="whitespace-nowrap border border-gray-200 px-4 py-3 text-right text-sm font-semibold text-gray-900">
                                                        {
                                                            currencySymbol
                                                        }
                                                        {formatMoney(
                                                            subtotal
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="border border-gray-200 px-4 py-10 text-center text-sm text-gray-500"
                                        >
                                            No return items
                                            found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-6">
                        <div className="ml-auto max-w-md rounded-lg bg-gray-50 p-4">
                            <Info
                                label="Return Total"
                                value={`${currencySymbol}${formatMoney(
                                    returnSubtotal
                                )}`}
                            />

                            <Info
                                label="Refund Amount"
                                value={`${currencySymbol}${formatMoney(
                                    refundAmount
                                )}`}
                            />
                        </div>

                        <div className="mt-6 rounded-lg border border-gray-200 p-4">
                            <p className="font-semibold text-gray-900">
                                Return Reason
                            </p>

                            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-600">
                                {saleReturn?.reason ??
                                    saleReturn?.note ??
                                    "No reason provided."}
                            </p>
                        </div>
                    </div>
                </section>
            </section>
        </AuthenticatedLayout>
    );
}

function Info({ label, value }) {
    return (
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 py-3 last:border-b-0">
            <span className="text-sm font-medium text-gray-600">
                {label}
            </span>

            <span className="text-right text-sm font-semibold text-gray-900">
                {value ?? "N/A"}
            </span>
        </div>
    );
}
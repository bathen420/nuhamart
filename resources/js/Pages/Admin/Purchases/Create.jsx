import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Create({ auth, suppliers = [], products = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        purchase_number: `PUR-${Date.now()}`,
        supplier_id: "",
        subtotal: 0,
        discount: 0,
        shipping: 0,
        total: 0,
        note: "",
        items: [
            {
                product_id: "",
                quantity: 1,
                price: 0,
                subtotal: 0,
            },
        ],
    });

    /**
     * Calculate purchase subtotal and grand total.
     */
    const calculateTotals = (
        items,
        discount = data.discount,
        shipping = data.shipping
    ) => {
        const subtotal = items.reduce((sum, item) => {
            return sum + Number(item.subtotal || 0);
        }, 0);

        const safeDiscount = Number(discount || 0);
        const safeShipping = Number(shipping || 0);

        const total = Math.max(
            0,
            subtotal - safeDiscount + safeShipping
        );

        return {
            subtotal,
            total,
        };
    };

    /**
     * Add a new product row.
     */
    const addRow = () => {
        setData("items", [
            ...data.items,
            {
                product_id: "",
                quantity: 1,
                price: 0,
                subtotal: 0,
            },
        ]);
    };

    /**
     * Update a purchase item.
     */
    const updateItem = (index, field, value) => {
        const updatedItems = data.items.map((item, itemIndex) => {
            if (itemIndex !== index) {
                return item;
            }

            const updatedItem = {
                ...item,
                [field]: value,
            };

            /*
             * When a product is selected, automatically use its price.
             * You can still edit the purchase price manually.
             */
            if (field === "product_id") {
                const selectedProduct = products.find(
                    (product) =>
                        Number(product.id) === Number(value)
                );

                updatedItem.price = selectedProduct
                    ? Number(
                          selectedProduct.purchase_price ??
                              selectedProduct.buy_price ??
                              selectedProduct.price ??
                              0
                      )
                    : 0;
            }

            updatedItem.subtotal =
                Number(updatedItem.quantity || 0) *
                Number(updatedItem.price || 0);

            return updatedItem;
        });

        const totals = calculateTotals(updatedItems);

        setData({
            ...data,
            items: updatedItems,
            subtotal: totals.subtotal,
            total: totals.total,
        });
    };

    /**
     * Remove a product row.
     */
    const removeRow = (index) => {
        let updatedItems = data.items.filter(
            (_, itemIndex) => itemIndex !== index
        );

        /*
         * Keep at least one empty row in the form.
         */
        if (updatedItems.length === 0) {
            updatedItems = [
                {
                    product_id: "",
                    quantity: 1,
                    price: 0,
                    subtotal: 0,
                },
            ];
        }

        const totals = calculateTotals(updatedItems);

        setData({
            ...data,
            items: updatedItems,
            subtotal: totals.subtotal,
            total: totals.total,
        });
    };

    /**
     * Update discount and recalculate total.
     */
    const updateDiscount = (value) => {
        const discount = value === "" ? 0 : value;

        const totals = calculateTotals(
            data.items,
            discount,
            data.shipping
        );

        setData({
            ...data,
            discount,
            subtotal: totals.subtotal,
            total: totals.total,
        });
    };

    /**
     * Update shipping and recalculate total.
     */
    const updateShipping = (value) => {
        const shipping = value === "" ? 0 : value;

        const totals = calculateTotals(
            data.items,
            data.discount,
            shipping
        );

        setData({
            ...data,
            shipping,
            subtotal: totals.subtotal,
            total: totals.total,
        });
    };

    /**
     * Submit purchase.
     */
    const submit = (event) => {
        event.preventDefault();

        post(route("purchases.store"), {
            preserveScroll: true,
        });
    };

    /**
     * Display a field validation error.
     */
    const ErrorMessage = ({ message }) => {
        if (!message) {
            return null;
        }

        return (
            <p className="mt-1 text-sm text-red-600">
                {message}
            </p>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold text-gray-800">
                    New Purchase
                </h2>
            }
        >
            <Head title="New Purchase" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <form onSubmit={submit}>
                        <div className="rounded-xl bg-white p-6 shadow">
                            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        Create Purchase
                                    </h1>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Add products purchased from a supplier.
                                    </p>
                                </div>

                                <Link
                                    href={route("purchases.index")}
                                    className="inline-flex rounded-lg bg-gray-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
                                >
                                    Back to Purchases
                                </Link>
                            </div>

                            {/* General backend error */}
                            {errors.error && (
                                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                    {errors.error}
                                </div>
                            )}

                            {/* Purchase Information */}
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                {/* Purchase Number */}
                                <div>
                                    <label className="mb-2 block font-semibold text-gray-700">
                                        Purchase Number
                                    </label>

                                    <input
                                        type="text"
                                        value={data.purchase_number}
                                        readOnly
                                        className="w-full rounded-lg border border-gray-300 bg-gray-100 p-3 text-gray-700"
                                    />

                                    <ErrorMessage
                                        message={errors.purchase_number}
                                    />
                                </div>

                                {/* Supplier */}
                                <div>
                                    <label className="mb-2 block font-semibold text-gray-700">
                                        Supplier
                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <select
                                        value={data.supplier_id}
                                        onChange={(event) =>
                                            setData(
                                                "supplier_id",
                                                event.target.value
                                            )
                                        }
                                        className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">
                                            Select Supplier
                                        </option>

                                        {suppliers.map((supplier) => (
                                            <option
                                                key={supplier.id}
                                                value={supplier.id}
                                            >
                                                {supplier.name}
                                            </option>
                                        ))}
                                    </select>

                                    <ErrorMessage
                                        message={errors.supplier_id}
                                    />
                                </div>
                            </div>

                            {/* Products */}
                            <div className="mt-8">
                                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Products
                                        </h2>

                                        <p className="text-sm text-gray-500">
                                            Select products and enter purchase
                                            quantity and price.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={addRow}
                                        className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
                                    >
                                        + Add Product
                                    </button>
                                </div>

                                <ErrorMessage message={errors.items} />

                                <div className="overflow-x-auto rounded-lg border border-gray-200">
                                    <table className="min-w-full">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="min-w-56 border-b p-3 text-left text-sm font-semibold text-gray-700">
                                                    Product
                                                </th>

                                                <th className="w-32 border-b p-3 text-left text-sm font-semibold text-gray-700">
                                                    Quantity
                                                </th>

                                                <th className="w-40 border-b p-3 text-left text-sm font-semibold text-gray-700">
                                                    Buy Price
                                                </th>

                                                <th className="w-44 border-b p-3 text-right text-sm font-semibold text-gray-700">
                                                    Subtotal
                                                </th>

                                                <th className="w-24 border-b p-3 text-center text-sm font-semibold text-gray-700">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {data.items.map(
                                                (item, index) => (
                                                    <tr
                                                        key={index}
                                                        className="border-b last:border-b-0"
                                                    >
                                                        {/* Product */}
                                                        <td className="p-3 align-top">
                                                            <select
                                                                value={
                                                                    item.product_id
                                                                }
                                                                onChange={(
                                                                    event
                                                                ) =>
                                                                    updateItem(
                                                                        index,
                                                                        "product_id",
                                                                        event
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                                className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                                                            >
                                                                <option value="">
                                                                    Select
                                                                    Product
                                                                </option>

                                                                {products.map(
                                                                    (
                                                                        product
                                                                    ) => (
                                                                        <option
                                                                            key={
                                                                                product.id
                                                                            }
                                                                            value={
                                                                                product.id
                                                                            }
                                                                        >
                                                                            {
                                                                                product.name
                                                                            }
                                                                            {product.stock_quantity !==
                                                                                undefined &&
                                                                                ` — Stock: ${product.stock_quantity}`}
                                                                        </option>
                                                                    )
                                                                )}
                                                            </select>

                                                            <ErrorMessage
                                                                message={
                                                                    errors[
                                                                        `items.${index}.product_id`
                                                                    ]
                                                                }
                                                            />
                                                        </td>

                                                        {/* Quantity */}
                                                        <td className="p-3 align-top">
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                step="1"
                                                                value={
                                                                    item.quantity
                                                                }
                                                                onChange={(
                                                                    event
                                                                ) =>
                                                                    updateItem(
                                                                        index,
                                                                        "quantity",
                                                                        event
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                                className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                                                            />

                                                            <ErrorMessage
                                                                message={
                                                                    errors[
                                                                        `items.${index}.quantity`
                                                                    ]
                                                                }
                                                            />
                                                        </td>

                                                        {/* Price */}
                                                        <td className="p-3 align-top">
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                value={
                                                                    item.price
                                                                }
                                                                onChange={(
                                                                    event
                                                                ) =>
                                                                    updateItem(
                                                                        index,
                                                                        "price",
                                                                        event
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                                className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                                                            />

                                                            <ErrorMessage
                                                                message={
                                                                    errors[
                                                                        `items.${index}.price`
                                                                    ]
                                                                }
                                                            />
                                                        </td>

                                                        {/* Subtotal */}
                                                        <td className="p-3 text-right align-top font-bold text-gray-800">
                                                            ৳{" "}
                                                            {Number(
                                                                item.subtotal ||
                                                                    0
                                                            ).toFixed(2)}

                                                            <ErrorMessage
                                                                message={
                                                                    errors[
                                                                        `items.${index}.subtotal`
                                                                    ]
                                                                }
                                                            />
                                                        </td>

                                                        {/* Delete */}
                                                        <td className="p-3 text-center align-top">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeRow(
                                                                        index
                                                                    )
                                                                }
                                                                className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Note and Summary */}
                            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                                {/* Note */}
                                <div>
                                    <label className="mb-2 block font-semibold text-gray-700">
                                        Note
                                    </label>

                                    <textarea
                                        rows="6"
                                        value={data.note}
                                        onChange={(event) =>
                                            setData(
                                                "note",
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter purchase note..."
                                        className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500"
                                    />

                                    <ErrorMessage message={errors.note} />
                                </div>

                                {/* Purchase Summary */}
                                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                                    <h3 className="mb-5 text-lg font-bold text-gray-900">
                                        Purchase Summary
                                    </h3>

                                    {/* Subtotal */}
                                    <div className="mb-4">
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                                            Subtotal
                                        </label>

                                        <input
                                            type="text"
                                            value={`৳ ${Number(
                                                data.subtotal || 0
                                            ).toFixed(2)}`}
                                            readOnly
                                            className="w-full rounded-lg border border-gray-300 bg-gray-100 p-3 font-semibold"
                                        />

                                        <ErrorMessage
                                            message={errors.subtotal}
                                        />
                                    </div>

                                    {/* Discount */}
                                    <div className="mb-4">
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                                            Discount
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={data.discount}
                                            onChange={(event) =>
                                                updateDiscount(
                                                    event.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500"
                                        />

                                        <ErrorMessage
                                            message={errors.discount}
                                        />
                                    </div>

                                    {/* Shipping */}
                                    <div className="mb-4">
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                                            Shipping Cost
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={data.shipping}
                                            onChange={(event) =>
                                                updateShipping(
                                                    event.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500"
                                        />

                                        <ErrorMessage
                                            message={errors.shipping}
                                        />
                                    </div>

                                    {/* Grand Total */}
                                    <div className="border-t border-gray-300 pt-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-bold text-gray-900">
                                                Grand Total
                                            </span>

                                            <span className="text-2xl font-bold text-green-700">
                                                ৳{" "}
                                                {Number(
                                                    data.total || 0
                                                ).toFixed(2)}
                                            </span>
                                        </div>

                                        <ErrorMessage
                                            message={errors.total}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="mt-8 flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
                                <Link
                                    href={route("purchases.index")}
                                    className="rounded-lg bg-gray-500 px-6 py-3 text-center font-semibold text-white hover:bg-gray-600"
                                >
                                    Cancel
                                </Link>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing
                                        ? "Saving Purchase..."
                                        : "Save Purchase"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
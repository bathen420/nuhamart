import { Head, useForm, usePage } from "@inertiajs/react";
import { useMemo } from "react";
import useCart from "@/hooks/useCart";

export default function CheckoutIndex() {
    const { flash = {} } = usePage().props;

    const {
        items = [],
        clearCart,
    } = useCart();

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        transform,
    } = useForm({
        name: "",
        phone: "",
        email: "",
        division: "",
        district: "",
        area: "",
        address: "",
        note: "",
        payment_method: "cod",
    });

    /**
     * Cart subtotal.
     */
    const subtotal = useMemo(() => {
        return items.reduce((total, item) => {
            const price = Number(
                item.price ??
                item.sale_price ??
                item.unit_price ??
                0
            );

            const quantity = Number(item.quantity ?? 1);

            return total + price * quantity;
        }, 0);
    }, [items]);

    const shippingCharge = 0;
    const discount = 0;

    const total =
        subtotal +
        shippingCharge -
        discount;

    /**
     * Format money as BDT.
     */
    const formatMoney = (amount) => {
        return new Intl.NumberFormat("en-BD", {
            style: "currency",
            currency: "BDT",
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(Number(amount || 0));
    };

    /**
     * Resolve product ID from different cart item structures.
     */
    const getProductId = (item) => {
        return (
            item.product_id ??
            item.product?.id ??
            item.id ??
            null
        );
    };

    /**
     * Resolve product name.
     */
    const getProductName = (item) => {
        return (
            item.product_name ??
            item.product?.name ??
            item.name ??
            "Product"
        );
    };

    /**
     * Resolve product image.
     */
    const getProductImage = (item) => {
        return (
            item.image ??
            item.image_url ??
            item.thumbnail ??
            item.product?.image ??
            item.product?.image_url ??
            null
        );
    };

    /**
     * Resolve product price.
     */
    const getProductPrice = (item) => {
        return Number(
            item.price ??
            item.sale_price ??
            item.unit_price ??
            item.product?.price ??
            0
        );
    };

    /**
     * Handle input changes.
     */
    const handleChange = (event) => {
        const { name, value } = event.target;

        setData(name, value);
    };

    /**
     * Submit checkout form.
     */
    const handleSubmit = (event) => {
        event.preventDefault();

        if (items.length === 0) {
            return;
        }

        transform((formData) => ({
            ...formData,

            items: items
                .map((item) => ({
                    product_id: getProductId(item),
                    quantity: Number(item.quantity ?? 1),
                }))
                .filter((item) => item.product_id !== null),
        }));

        post(route("checkout.store"), {
            preserveScroll: true,

            onSuccess: () => {
                clearCart();

                reset(
                    "name",
                    "phone",
                    "email",
                    "division",
                    "district",
                    "area",
                    "address",
                    "note"
                );

                setData("payment_method", "cod");
            },

            onError: (validationErrors) => {
                console.error(
                    "Checkout validation errors:",
                    validationErrors
                );
            },
        });
    };

    return (
        <>
            <Head title="Checkout" />

            <div className="min-h-screen bg-slate-100 py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900">
                            Checkout
                        </h1>

                        <p className="mt-2 text-sm text-slate-600">
                            Complete your information and place your order.
                        </p>
                    </div>

                    {flash.success && (
                        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                            {flash.success}
                        </div>
                    )}

                    {flash.error && (
                        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {flash.error}
                        </div>
                    )}

                    {errors.error && (
                        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {errors.error}
                        </div>
                    )}

                    {items.length === 0 ? (
                        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                            <h2 className="text-xl font-semibold text-slate-900">
                                Your cart is empty
                            </h2>

                            <p className="mt-2 text-slate-600">
                                Add products to your cart before placing an
                                order.
                            </p>

                            <a
                                href="/"
                                className="mt-6 inline-flex rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
                            >
                                Continue Shopping
                            </a>
                        </div>
                    ) : (
                        <form
                            id="checkout-form"
                            onSubmit={handleSubmit}
                        >
                            <div className="grid gap-8 lg:grid-cols-3">
                                <div className="space-y-8 lg:col-span-2">
                                    {/* Customer Information */}
                                    <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
                                        <div className="mb-6">
                                            <h2 className="text-xl font-bold text-slate-900">
                                                Customer Information
                                            </h2>

                                            <p className="mt-1 text-sm text-slate-500">
                                                Enter your contact details.
                                            </p>
                                        </div>

                                        <div className="grid gap-5 sm:grid-cols-2">
                                            <InputField
                                                label="Customer Name"
                                                name="name"
                                                value={data.name}
                                                onChange={handleChange}
                                                error={errors.name}
                                                placeholder="Enter your full name"
                                                required
                                            />

                                            <InputField
                                                label="Phone Number"
                                                name="phone"
                                                type="tel"
                                                value={data.phone}
                                                onChange={handleChange}
                                                error={errors.phone}
                                                placeholder="01XXXXXXXXX"
                                                required
                                            />

                                            <div className="sm:col-span-2">
                                                <InputField
                                                    label="Email Address"
                                                    name="email"
                                                    type="email"
                                                    value={data.email}
                                                    onChange={handleChange}
                                                    error={errors.email}
                                                    placeholder="example@email.com"
                                                />
                                            </div>
                                        </div>
                                    </section>

                                    {/* Delivery Address */}
                                    <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
                                        <div className="mb-6">
                                            <h2 className="text-xl font-bold text-slate-900">
                                                Delivery Address
                                            </h2>

                                            <p className="mt-1 text-sm text-slate-500">
                                                Enter the complete delivery
                                                address.
                                            </p>
                                        </div>

                                        <div className="grid gap-5 sm:grid-cols-2">
                                            <InputField
                                                label="Division"
                                                name="division"
                                                value={data.division}
                                                onChange={handleChange}
                                                error={errors.division}
                                                placeholder="Dhaka"
                                                required
                                            />

                                            <InputField
                                                label="District"
                                                name="district"
                                                value={data.district}
                                                onChange={handleChange}
                                                error={errors.district}
                                                placeholder="Dhaka"
                                                required
                                            />

                                            <div className="sm:col-span-2">
                                                <InputField
                                                    label="Area"
                                                    name="area"
                                                    value={data.area}
                                                    onChange={handleChange}
                                                    error={errors.area}
                                                    placeholder="Bashundhara, Mirpur, Uttara..."
                                                    required
                                                />
                                            </div>

                                            <div className="sm:col-span-2">
                                                <TextAreaField
                                                    label="Full Address"
                                                    name="address"
                                                    value={data.address}
                                                    onChange={handleChange}
                                                    error={errors.address}
                                                    placeholder="House, road, block and landmark"
                                                    required
                                                />
                                            </div>

                                            <div className="sm:col-span-2">
                                                <TextAreaField
                                                    label="Order Note"
                                                    name="note"
                                                    value={data.note}
                                                    onChange={handleChange}
                                                    error={errors.note}
                                                    placeholder="Additional delivery instructions"
                                                />
                                            </div>
                                        </div>
                                    </section>

                                    {/* Payment Method */}
                                    <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
                                        <div className="mb-6">
                                            <h2 className="text-xl font-bold text-slate-900">
                                                Payment Method
                                            </h2>

                                            <p className="mt-1 text-sm text-slate-500">
                                                Select your preferred payment
                                                method.
                                            </p>
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <PaymentOption
                                                value="cod"
                                                label="Cash on Delivery"
                                                description="Pay after receiving your order."
                                                selected={
                                                    data.payment_method ===
                                                    "cod"
                                                }
                                                onChange={(value) =>
                                                    setData(
                                                        "payment_method",
                                                        value
                                                    )
                                                }
                                            />

                                            <PaymentOption
                                                value="sslcommerz"
                                                label="Online Payment"
                                                description="Pay using card or mobile banking."
                                                selected={
                                                    data.payment_method ===
                                                    "sslcommerz"
                                                }
                                                onChange={(value) =>
                                                    setData(
                                                        "payment_method",
                                                        value
                                                    )
                                                }
                                            />

                                            <PaymentOption
                                                value="bkash"
                                                label="bKash"
                                                description="Pay using your bKash account."
                                                selected={
                                                    data.payment_method ===
                                                    "bkash"
                                                }
                                                onChange={(value) =>
                                                    setData(
                                                        "payment_method",
                                                        value
                                                    )
                                                }
                                            />

                                            <PaymentOption
                                                value="nagad"
                                                label="Nagad"
                                                description="Pay using your Nagad account."
                                                selected={
                                                    data.payment_method ===
                                                    "nagad"
                                                }
                                                onChange={(value) =>
                                                    setData(
                                                        "payment_method",
                                                        value
                                                    )
                                                }
                                            />
                                        </div>

                                        {errors.payment_method && (
                                            <p className="mt-3 text-sm text-red-600">
                                                {errors.payment_method}
                                            </p>
                                        )}
                                    </section>
                                </div>

                                {/* Order Summary */}
                                <aside className="lg:col-span-1">
                                    <div className="sticky top-6 rounded-2xl bg-white p-6 shadow-sm">
                                        <h2 className="text-xl font-bold text-slate-900">
                                            Order Summary
                                        </h2>

                                        <div className="mt-6 max-h-[420px] space-y-5 overflow-y-auto pr-1">
                                            {items.map((item, index) => {
                                                const productId =
                                                    getProductId(item);

                                                const productName =
                                                    getProductName(item);

                                                const productImage =
                                                    getProductImage(item);

                                                const price =
                                                    getProductPrice(item);

                                                const quantity = Number(
                                                    item.quantity ?? 1
                                                );

                                                return (
                                                    <div
                                                        key={
                                                            productId ??
                                                            `${productName}-${index}`
                                                        }
                                                        className="flex gap-4 border-b border-slate-200 pb-5"
                                                    >
                                                        <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                                                            {productImage ? (
                                                                <img
                                                                    src={
                                                                        productImage
                                                                    }
                                                                    alt={
                                                                        productName
                                                                    }
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <span className="text-xs text-slate-400">
                                                                    Product
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="min-w-0 flex-1">
                                                            <h3 className="line-clamp-2 font-semibold text-slate-900">
                                                                {productName}
                                                            </h3>

                                                            <p className="mt-1 text-sm text-slate-500">
                                                                Quantity:{" "}
                                                                {quantity}
                                                            </p>

                                                            <p className="mt-2 font-semibold text-indigo-600">
                                                                {formatMoney(
                                                                    price *
                                                                        quantity
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {errors.items && (
                                            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                                                {errors.items}
                                            </div>
                                        )}

                                        <div className="mt-6 space-y-4">
                                            <SummaryRow
                                                label="Subtotal"
                                                value={formatMoney(subtotal)}
                                            />

                                            <SummaryRow
                                                label="Shipping"
                                                value={
                                                    shippingCharge > 0
                                                        ? formatMoney(
                                                              shippingCharge
                                                          )
                                                        : "Free"
                                                }
                                            />

                                            {discount > 0 && (
                                                <SummaryRow
                                                    label="Discount"
                                                    value={`- ${formatMoney(
                                                        discount
                                                    )}`}
                                                />
                                            )}

                                            <div className="border-t border-slate-200 pt-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xl font-bold text-slate-900">
                                                        Total
                                                    </span>

                                                    <span className="text-xl font-bold text-slate-900">
                                                        {formatMoney(total)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={
                                                processing ||
                                                items.length === 0
                                            }
                                            className="mt-7 w-full rounded-xl bg-indigo-600 px-5 py-4 text-base font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {processing
                                                ? "Placing Order..."
                                                : "Place Order"}
                                        </button>
                                    </div>
                                </aside>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
}

function InputField({
    label,
    name,
    type = "text",
    value,
    onChange,
    error,
    placeholder,
    required = false,
}) {
    return (
        <div>
            <label
                htmlFor={name}
                className="mb-2 block text-sm font-semibold text-slate-700"
            >
                {label}

                {required && (
                    <span className="ml-1 text-red-500">
                        *
                    </span>
                )}
            </label>

            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className={`w-full rounded-lg border px-4 py-3 text-slate-900 outline-none transition focus:ring-2 ${
                    error
                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
                }`}
            />

            {error && (
                <p className="mt-1 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}

function TextAreaField({
    label,
    name,
    value,
    onChange,
    error,
    placeholder,
    required = false,
}) {
    return (
        <div>
            <label
                htmlFor={name}
                className="mb-2 block text-sm font-semibold text-slate-700"
            >
                {label}

                {required && (
                    <span className="ml-1 text-red-500">
                        *
                    </span>
                )}
            </label>

            <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                rows={4}
                className={`w-full resize-none rounded-lg border px-4 py-3 text-slate-900 outline-none transition focus:ring-2 ${
                    error
                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
                }`}
            />

            {error && (
                <p className="mt-1 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}

function PaymentOption({
    value,
    label,
    description,
    selected,
    onChange,
}) {
    return (
        <label
            className={`cursor-pointer rounded-xl border p-4 transition ${
                selected
                    ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100"
                    : "border-slate-200 hover:border-indigo-300"
            }`}
        >
            <div className="flex items-start gap-3">
                <input
                    type="radio"
                    name="payment_method"
                    value={value}
                    checked={selected}
                    onChange={() => onChange(value)}
                    className="mt-1 h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />

                <div>
                    <div className="font-semibold text-slate-900">
                        {label}
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                        {description}
                    </p>
                </div>
            </div>
        </label>
    );
}

function SummaryRow({ label, value }) {
    return (
        <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">
                {label}
            </span>

            <span className="font-semibold text-slate-900">
                {value}
            </span>
        </div>
    );
}
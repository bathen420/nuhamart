import axios from "axios";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import {
    BadgePercent,
    CheckCircle2,
    ChevronRight,
    LockKeyhole,
    MapPin,
    PackageCheck,
    ShieldCheck,
    Store,
    Truck,
    WalletCards,
    X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import StorefrontLayout from "@/Layouts/StorefrontLayout";
import useCart from "@/hooks/useCart";

const money = (value) =>
    `৳${Number(value || 0).toLocaleString("en-BD", {
        maximumFractionDigits: 2,
    })}`;

const itemPrice = (item) =>
    Number(
        item.product_type === "ebook"
            ? (item.ebook_price ?? item.sale_price ?? item.price)
            : (item.sale_price ?? item.price ?? 0),
    );

const Field = ({ label, error, className = "", ...props }) => (
    <label className={`block ${className}`}>
        <span className="mb-1.5 block text-sm font-bold text-slate-700">
            {label}
        </span>
        <input
            {...props}
            className="w-full rounded-xl border-slate-300 focus:border-teal-600 focus:ring-teal-600"
        />
        {error && (
            <span className="mt-1 block text-xs font-semibold text-red-600">
                {error}
            </span>
        )}
    </label>
);

export default function CheckoutIndex({
    customer,
    shippingRates,
    savedAddresses = [],
    paymentMethods = [],
}) {
    const { flash = {} } = usePage().props;
    const { items, clearCart } = useCart();

    const defaultAddress =
        savedAddresses.find((address) => address.is_default) ?? null;

    const {
        data,
        setData,
        post,
        processing,
        errors,
        transform,
        clearErrors,
    } = useForm({
        name: defaultAddress?.name ?? customer?.name ?? "",
        phone: defaultAddress?.phone ?? customer?.phone ?? "",
        email: customer?.email ?? "",
        division: defaultAddress?.division ?? "Dhaka",
        district: defaultAddress?.district ?? "Dhaka",
        area: defaultAddress?.area ?? "",
        address: defaultAddress?.address ?? "",
        note: "",
        shipping_method: "standard",
        payment_method: paymentMethods?.[0]?.key ?? "cod",
        payment_reference: "",
        address_label: defaultAddress?.label ?? "Home",
        save_address: false,
        address_is_default: false,
        coupon_code: "",
    });

    const [selectedAddressId, setSelectedAddressId] = useState(
        defaultAddress?.id ? String(defaultAddress.id) : "",
    );
    const [couponResult, setCouponResult] = useState(null);
    const [couponLoading, setCouponLoading] = useState(false);

    const subtotal = useMemo(
        () =>
            items.reduce(
                (sum, item) =>
                    sum +
                    itemPrice(item) * Number(item.quantity || 1),
                0,
            ),
        [items],
    );

    const digitalOnly =
        items.length > 0 &&
        items.every((item) =>
            ["ebook", "digital"].includes(item.product_type),
        );

    const threshold = Number(
        shippingRates?.free_shipping_threshold ?? 0,
    );
    const qualifiesFreeShipping =
        threshold > 0 && subtotal >= threshold;

    const district = data.district.trim().toLowerCase();

    const homeDeliveryCharge =
        district === "dhaka"
            ? Number(shippingRates?.dhaka ?? 60)
            : Number(shippingRates?.outside_dhaka ?? 120);

    const shipping =
        digitalOnly ||
        data.shipping_method === "store_pickup" ||
        qualifiesFreeShipping
            ? 0
            : homeDeliveryCharge;

    const itemDiscount = Number(couponResult?.discount || 0);
    const shippingDiscount = Number(
        couponResult?.shipping_discount || 0,
    );
    const payableShipping = Math.max(0, shipping - shippingDiscount);
    const total = Math.max(
        0,
        subtotal + payableShipping - itemDiscount,
    );
    const amountUntilFreeShipping = Math.max(
        0,
        threshold - subtotal,
    );

    const completedSteps = [
        data.name && data.phone,
        data.shipping_method === "store_pickup" ||
            (data.division &&
                data.district &&
                data.area &&
                data.address),
        data.payment_method &&
            (!["bkash", "nagad", "bank"].includes(
                data.payment_method,
            ) ||
                data.payment_reference),
    ].filter(Boolean).length;

    useEffect(() => {
        setCouponResult(null);
    }, [
        subtotal,
        shipping,
        data.phone,
        data.shipping_method,
        data.district,
    ]);

    useEffect(() => {
        if (digitalOnly && data.shipping_method !== "standard") {
            setData("shipping_method", "standard");
        }
    }, [digitalOnly]);

    const applyCoupon = async () => {
        const code = data.coupon_code.trim().toUpperCase();

        if (!code || couponLoading) return;

        setCouponLoading(true);
        clearErrors("coupon_code");

        try {
            const response = await axios.post(
                route("checkout.coupon.validate"),
                {
                    coupon_code: code,
                    phone: data.phone,
                    shipping,
                    items: items.map((item) => ({
                        product_id: item.id,
                        quantity: Number(item.quantity || 1),
                    })),
                },
            );

            setData("coupon_code", code);
            setCouponResult(response.data);
        } catch (error) {
            const message =
                error.response?.data?.message ||
                Object.values(
                    error.response?.data?.errors || {},
                )?.[0]?.[0] ||
                "Coupon could not be applied.";

            setCouponResult({ error: message });
        } finally {
            setCouponLoading(false);
        }
    };

    const removeCoupon = () => {
        setData("coupon_code", "");
        setCouponResult(null);
    };

    const applyAddress = (id) => {
        setSelectedAddressId(id);

        const address = savedAddresses.find(
            (item) => String(item.id) === String(id),
        );

        if (!address) return;

        setData((current) => ({
            ...current,
            name: address.name || "",
            phone: address.phone || "",
            division: address.division || "",
            district: address.district || "",
            area: address.area || "",
            address: address.address || "",
            shipping_method: "standard",
        }));
    };

    const submit = (event) => {
        event.preventDefault();

        if (processing) return;

        transform((form) => ({
            ...form,
            items: items.map((item) => ({
                product_id: item.id,
                quantity: Number(item.quantity || 1),
            })),
        }));

        post(route("checkout.store"), {
            preserveScroll: true,
            onSuccess: clearCart,
        });
    };

    if (!items.length) {
        return (
            <StorefrontLayout>
                <Head title="Checkout" />
                <div className="mx-auto max-w-3xl px-4 py-20 text-center">
                    <PackageCheck className="mx-auto h-14 w-14 text-teal-700" />
                    <h1 className="mt-4 text-3xl font-black">
                        Your cart is empty
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Add products to your cart before continuing to
                        checkout.
                    </p>
                    <Link
                        href={route("storefront.catalog")}
                        className="mt-6 inline-flex rounded-xl bg-teal-700 px-6 py-3 font-bold text-white"
                    >
                        Shop now
                    </Link>
                </div>
            </StorefrontLayout>
        );
    }

    return (
        <StorefrontLayout>
            <Head title="Secure Checkout" />

            <main className="bg-slate-50 pb-28 pt-8 lg:pb-12">
                <div className="mx-auto mb-6 max-w-7xl px-4">
                    <div className="rounded-2xl border border-teal-100 bg-white p-4 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-700">
                                    Secure one-page checkout
                                </p>
                                <h1 className="mt-1 text-3xl font-black text-slate-900">
                                    Complete your order
                                </h1>
                            </div>

                            <div className="flex items-center gap-2 text-xs font-black text-slate-500">
                                {[1, 2, 3].map((step) => (
                                    <div
                                        key={step}
                                        className="flex items-center gap-2"
                                    >
                                        <span
                                            className={`grid h-8 w-8 place-items-center rounded-full ${
                                                completedSteps >= step
                                                    ? "bg-teal-700 text-white"
                                                    : "bg-slate-100 text-slate-500"
                                            }`}
                                        >
                                            {completedSteps >= step ? (
                                                <CheckCircle2 size={17} />
                                            ) : (
                                                step
                                            )}
                                        </span>
                                        {step < 3 && (
                                            <ChevronRight
                                                size={15}
                                                className="text-slate-300"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <form
                    onSubmit={submit}
                    className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[1fr_390px]"
                >
                    <div className="space-y-6">
                        {(flash.error || errors.error) && (
                            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                                {flash.error || errors.error}
                            </div>
                        )}

                        <section className="rounded-3xl bg-white p-6 shadow-sm">
                            <div className="mb-5 flex items-center gap-3">
                                <Truck className="text-teal-700" />
                                <div>
                                    <h2 className="text-xl font-black">
                                        Delivery method
                                    </h2>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Choose how you want to receive
                                        your order.
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <label
                                    className={`cursor-pointer rounded-2xl border p-4 ${
                                        data.shipping_method ===
                                        "standard"
                                            ? "border-teal-600 bg-teal-50"
                                            : "border-slate-200"
                                    }`}
                                >
                                    <div className="flex gap-3">
                                        <input
                                            type="radio"
                                            checked={
                                                data.shipping_method ===
                                                "standard"
                                            }
                                            onChange={() =>
                                                setData(
                                                    "shipping_method",
                                                    "standard",
                                                )
                                            }
                                            className="mt-1 text-teal-600 focus:ring-teal-600"
                                        />
                                        <div>
                                            <b>Home delivery</b>
                                            <p className="mt-1 text-xs text-slate-500">
                                                Dhaka and nationwide
                                                courier delivery
                                            </p>
                                        </div>
                                    </div>
                                </label>

                                {!digitalOnly && (
                                    <label
                                        className={`cursor-pointer rounded-2xl border p-4 ${
                                            data.shipping_method ===
                                            "store_pickup"
                                                ? "border-teal-600 bg-teal-50"
                                                : "border-slate-200"
                                        }`}
                                    >
                                        <div className="flex gap-3">
                                            <input
                                                type="radio"
                                                checked={
                                                    data.shipping_method ===
                                                    "store_pickup"
                                                }
                                                onChange={() =>
                                                    setData(
                                                        "shipping_method",
                                                        "store_pickup",
                                                    )
                                                }
                                                className="mt-1 text-teal-600 focus:ring-teal-600"
                                            />
                                            <div>
                                                <b>Store pickup</b>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    Collect without a
                                                    delivery charge
                                                </p>
                                            </div>
                                        </div>
                                    </label>
                                )}
                            </div>

                            {digitalOnly && (
                                <div className="mt-4 rounded-xl bg-indigo-50 p-3 text-sm font-semibold text-indigo-700">
                                    Digital products have no shipping
                                    charge and are delivered through your
                                    account.
                                </div>
                            )}

                            {threshold > 0 &&
                                !digitalOnly &&
                                data.shipping_method === "standard" && (
                                    <div
                                        className={`mt-4 rounded-xl p-3 text-sm font-semibold ${
                                            qualifiesFreeShipping
                                                ? "bg-emerald-50 text-emerald-700"
                                                : "bg-amber-50 text-amber-800"
                                        }`}
                                    >
                                        {qualifiesFreeShipping
                                            ? "You unlocked free delivery."
                                            : `Add ${money(
                                                  amountUntilFreeShipping,
                                              )} more to unlock free delivery.`}
                                    </div>
                                )}
                        </section>

                        <section className="rounded-3xl bg-white p-6 shadow-sm">
                            <div className="mb-5 flex items-center gap-3">
                                <MapPin className="text-teal-700" />
                                <div>
                                    <h2 className="text-xl font-black">
                                        Contact & address
                                    </h2>
                                    <p className="mt-1 text-xs text-slate-500">
                                        We use these details for order
                                        confirmation and delivery.
                                    </p>
                                </div>
                            </div>

                            {savedAddresses.length > 0 &&
                                data.shipping_method === "standard" && (
                                    <label className="mb-5 block">
                                        <span className="mb-1.5 block text-sm font-bold">
                                            Use saved address
                                        </span>
                                        <select
                                            value={selectedAddressId}
                                            onChange={(event) =>
                                                applyAddress(
                                                    event.target.value,
                                                )
                                            }
                                            className="w-full rounded-xl border-slate-300 focus:border-teal-600 focus:ring-teal-600"
                                        >
                                            <option value="">
                                                Enter a different address
                                            </option>
                                            {savedAddresses.map(
                                                (address) => (
                                                    <option
                                                        key={address.id}
                                                        value={address.id}
                                                    >
                                                        {address.label}
                                                        {address.is_default
                                                            ? " (Default)"
                                                            : ""}
                                                        {" — "}
                                                        {address.area},{" "}
                                                        {address.district}
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                    </label>
                                )}

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Full name"
                                    value={data.name}
                                    onChange={(event) =>
                                        setData(
                                            "name",
                                            event.target.value,
                                        )
                                    }
                                    error={errors.name}
                                    autoComplete="name"
                                    required
                                />

                                <Field
                                    label="Mobile number"
                                    value={data.phone}
                                    onChange={(event) =>
                                        setData(
                                            "phone",
                                            event.target.value,
                                        )
                                    }
                                    error={errors.phone}
                                    placeholder="01XXXXXXXXX"
                                    inputMode="tel"
                                    autoComplete="tel"
                                    required
                                />

                                <Field
                                    label="Email (optional)"
                                    type="email"
                                    value={data.email}
                                    onChange={(event) =>
                                        setData(
                                            "email",
                                            event.target.value,
                                        )
                                    }
                                    error={errors.email}
                                    autoComplete="email"
                                    className="sm:col-span-2"
                                />

                                {data.shipping_method === "standard" && (
                                    <>
                                        <Field
                                            label="Division"
                                            value={data.division}
                                            onChange={(event) =>
                                                setData(
                                                    "division",
                                                    event.target.value,
                                                )
                                            }
                                            error={errors.division}
                                            required
                                        />

                                        <Field
                                            label="District"
                                            value={data.district}
                                            onChange={(event) =>
                                                setData(
                                                    "district",
                                                    event.target.value,
                                                )
                                            }
                                            error={errors.district}
                                            required
                                        />

                                        <Field
                                            label="Area / Thana"
                                            value={data.area}
                                            onChange={(event) =>
                                                setData(
                                                    "area",
                                                    event.target.value,
                                                )
                                            }
                                            error={errors.area}
                                            className="sm:col-span-2"
                                            required
                                        />

                                        <label className="block sm:col-span-2">
                                            <span className="mb-1.5 block text-sm font-bold">
                                                Full address
                                            </span>
                                            <textarea
                                                value={data.address}
                                                onChange={(event) =>
                                                    setData(
                                                        "address",
                                                        event.target.value,
                                                    )
                                                }
                                                rows="3"
                                                className="w-full rounded-xl border-slate-300 focus:border-teal-600 focus:ring-teal-600"
                                                required
                                            />
                                            {errors.address && (
                                                <span className="text-xs text-red-600">
                                                    {errors.address}
                                                </span>
                                            )}
                                        </label>
                                    </>
                                )}

                                <label className="block sm:col-span-2">
                                    <span className="mb-1.5 block text-sm font-bold">
                                        Order note (optional)
                                    </span>
                                    <textarea
                                        value={data.note}
                                        onChange={(event) =>
                                            setData(
                                                "note",
                                                event.target.value,
                                            )
                                        }
                                        rows="2"
                                        maxLength={1000}
                                        className="w-full rounded-xl border-slate-300 focus:border-teal-600 focus:ring-teal-600"
                                    />
                                </label>

                                {customer &&
                                    data.shipping_method === "standard" && (
                                        <div className="sm:col-span-2 rounded-xl bg-slate-50 p-4">
                                            <label className="flex items-center gap-2 text-sm font-bold">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        data.save_address
                                                    }
                                                    onChange={(event) =>
                                                        setData(
                                                            "save_address",
                                                            event.target
                                                                .checked,
                                                        )
                                                    }
                                                />
                                                Save this address to my
                                                account
                                            </label>

                                            {data.save_address && (
                                                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                                    <Field
                                                        label="Address label"
                                                        value={
                                                            data.address_label
                                                        }
                                                        onChange={(
                                                            event,
                                                        ) =>
                                                            setData(
                                                                "address_label",
                                                                event.target
                                                                    .value,
                                                            )
                                                        }
                                                        error={
                                                            errors.address_label
                                                        }
                                                        placeholder="Home or Office"
                                                        required
                                                    />

                                                    <label className="flex items-center gap-2 self-end pb-3 text-sm font-bold">
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                data.address_is_default
                                                            }
                                                            onChange={(
                                                                event,
                                                            ) =>
                                                                setData(
                                                                    "address_is_default",
                                                                    event
                                                                        .target
                                                                        .checked,
                                                                )
                                                            }
                                                        />
                                                        Set as default
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    )}
                            </div>
                        </section>

                        <section className="rounded-3xl bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-3">
                                <BadgePercent className="text-teal-700" />
                                <div>
                                    <h2 className="text-xl font-black">
                                        Coupon
                                    </h2>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Coupon eligibility is verified
                                        securely by the server.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 flex gap-2">
                                <input
                                    value={data.coupon_code}
                                    onChange={(event) => {
                                        setData(
                                            "coupon_code",
                                            event.target.value.toUpperCase(),
                                        );
                                        setCouponResult(null);
                                    }}
                                    placeholder="Enter coupon code"
                                    className="min-w-0 flex-1 rounded-xl border-slate-300 focus:border-teal-600 focus:ring-teal-600"
                                />

                                {couponResult?.valid ? (
                                    <button
                                        type="button"
                                        onClick={removeCoupon}
                                        className="flex items-center gap-2 rounded-xl bg-rose-50 px-4 font-bold text-rose-600"
                                    >
                                        <X size={16} />
                                        Remove
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={applyCoupon}
                                        disabled={
                                            couponLoading ||
                                            !data.coupon_code.trim()
                                        }
                                        className="rounded-xl bg-slate-900 px-5 font-bold text-white disabled:opacity-50"
                                    >
                                        {couponLoading
                                            ? "Checking..."
                                            : "Apply"}
                                    </button>
                                )}
                            </div>

                            {errors.coupon_code && (
                                <p className="mt-2 text-sm font-semibold text-red-700">
                                    {errors.coupon_code}
                                </p>
                            )}

                            {couponResult?.message && (
                                <p className="mt-2 text-sm font-semibold text-emerald-700">
                                    {couponResult.message}
                                </p>
                            )}

                            {couponResult?.error && (
                                <p className="mt-2 text-sm font-semibold text-red-700">
                                    {couponResult.error}
                                </p>
                            )}
                        </section>

                        <section className="rounded-3xl bg-white p-6 shadow-sm">
                            <div className="mb-5 flex items-center gap-3">
                                <WalletCards className="text-teal-700" />
                                <div>
                                    <h2 className="text-xl font-black">
                                        Payment method
                                    </h2>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Select one of the available secure
                                        payment options.
                                    </p>
                                </div>
                            </div>

                            {paymentMethods.length === 0 ? (
                                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
                                    No payment method is currently
                                    available. Please contact support.
                                </div>
                            ) : (
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {paymentMethods.map((method) => (
                                        <label
                                            key={method.key}
                                            className={`cursor-pointer rounded-2xl border p-4 ${
                                                data.payment_method ===
                                                method.key
                                                    ? "border-teal-600 bg-teal-50"
                                                    : "border-slate-200"
                                            }`}
                                        >
                                            <div className="flex gap-3">
                                                <input
                                                    type="radio"
                                                    value={method.key}
                                                    checked={
                                                        data.payment_method ===
                                                        method.key
                                                    }
                                                    onChange={(event) => {
                                                        setData(
                                                            "payment_method",
                                                            event.target
                                                                .value,
                                                        );
                                                        setData(
                                                            "payment_reference",
                                                            "",
                                                        );
                                                    }}
                                                    className="mt-1 text-teal-600 focus:ring-teal-600"
                                                />
                                                <div>
                                                    <b>{method.label}</b>
                                                    <p className="mt-1 whitespace-pre-line text-xs text-slate-500">
                                                        {method.account
                                                            ? `Pay to / Instructions: ${method.account}`
                                                            : method.key ===
                                                                "cod"
                                                              ? "Pay when the parcel arrives"
                                                              : "Secure online payment"}
                                                    </p>
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}

                            {["bkash", "nagad", "bank"].includes(
                                data.payment_method,
                            ) && (
                                <Field
                                    label="Transaction / reference number"
                                    value={data.payment_reference}
                                    onChange={(event) =>
                                        setData(
                                            "payment_reference",
                                            event.target.value,
                                        )
                                    }
                                    error={errors.payment_reference}
                                    className="mt-4"
                                    required
                                />
                            )}
                        </section>
                    </div>

                    <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm lg:sticky lg:top-28">
                        <h2 className="text-xl font-black">
                            Order summary
                        </h2>

                        <div className="mt-5 max-h-72 space-y-4 overflow-auto pr-1">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex gap-3"
                                >
                                    <img
                                        src={
                                            item.image ||
                                            "https://placehold.co/100x100?text=Nuha Mart BD"
                                        }
                                        className="h-16 w-16 rounded-lg border object-contain"
                                        loading="lazy"
                                        alt={item.name}
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-bold">
                                            {item.name}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Qty {item.quantity}
                                        </p>
                                    </div>
                                    <b className="text-sm">
                                        {money(
                                            itemPrice(item) *
                                                item.quantity,
                                        )}
                                    </b>
                                </div>
                            ))}
                        </div>

                        <div className="mt-5 space-y-3 border-t pt-5 text-sm">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <b>{money(subtotal)}</b>
                            </div>

                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <b
                                    className={
                                        payableShipping === 0
                                            ? "text-emerald-600"
                                            : ""
                                    }
                                >
                                    {payableShipping === 0
                                        ? "Free"
                                        : money(payableShipping)}
                                </b>
                            </div>

                            {itemDiscount > 0 && (
                                <div className="flex justify-between text-emerald-700">
                                    <span>Coupon discount</span>
                                    <b>-{money(itemDiscount)}</b>
                                </div>
                            )}

                            {shippingDiscount > 0 && (
                                <div className="flex justify-between text-emerald-700">
                                    <span>Shipping discount</span>
                                    <b>-{money(shippingDiscount)}</b>
                                </div>
                            )}

                            <div className="flex justify-between border-t pt-4 text-lg">
                                <span className="font-black">Total</span>
                                <span className="font-black text-teal-700">
                                    {money(total)}
                                </span>
                            </div>
                        </div>

                        <button
                            disabled={
                                processing ||
                                paymentMethods.length === 0
                            }
                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3.5 font-black text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <LockKeyhole size={18} />
                            {processing
                                ? "Placing order..."
                                : "Place order"}
                        </button>

                        <div className="mt-4 rounded-xl bg-slate-50 p-3">
                            <p className="flex items-center justify-center gap-2 text-center text-xs font-bold text-slate-600">
                                <ShieldCheck
                                    size={16}
                                    className="text-teal-700"
                                />
                                Price, stock, coupon and delivery charge
                                are verified securely.
                            </p>
                        </div>
                    </aside>
                </form>

                <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white p-3 shadow-2xl lg:hidden">
                    <div className="mx-auto flex max-w-7xl items-center gap-3">
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-slate-500">
                                Total payable
                            </p>
                            <p className="text-xl font-black text-teal-700">
                                {money(total)}
                            </p>
                        </div>

                        <button
                            type="button"
                            disabled={
                                processing ||
                                paymentMethods.length === 0
                            }
                            onClick={() =>
                                document
                                    .querySelector("form")
                                    ?.requestSubmit()
                            }
                            className="flex min-w-[180px] items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 font-black text-white disabled:opacity-50"
                        >
                            <LockKeyhole size={17} />
                            {processing
                                ? "Please wait..."
                                : "Place order"}
                        </button>
                    </div>
                </div>
            </main>
        </StorefrontLayout>
    );
}

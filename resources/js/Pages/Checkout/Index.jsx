import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { BadgePercent, CheckCircle2, LockKeyhole, MapPin, PackageCheck, Store, Truck, WalletCards } from "lucide-react";
import { useMemo, useState } from "react";
import StorefrontLayout from "@/Layouts/StorefrontLayout";
import useCart from "@/hooks/useCart";

const money = (value) => `৳${Number(value || 0).toLocaleString("en-BD", { maximumFractionDigits: 2 })}`;
const itemPrice = (item) => Number(item.product_type === "ebook" ? (item.ebook_price ?? item.sale_price ?? item.price) : (item.sale_price ?? item.price ?? 0));

const Field = ({ label, error, className = "", ...props }) => (
    <label className={`block ${className}`}>
        <span className="mb-1.5 block text-sm font-bold text-slate-700">{label}</span>
        <input {...props} className="w-full rounded-xl border-slate-300 focus:border-teal-600 focus:ring-teal-600" />
        {error && <span className="mt-1 block text-xs font-semibold text-red-600">{error}</span>}
    </label>
);

export default function CheckoutIndex({ customer, shippingRates, savedAddresses = [], paymentMethods = [] }) {
    const { flash = {} } = usePage().props;
    const { items, clearCart } = useCart();
    const { data, setData, post, processing, errors, transform } = useForm({
        name: customer?.name ?? "",
        phone: customer?.phone ?? "",
        email: customer?.email ?? "",
        division: "Dhaka",
        district: "Dhaka",
        area: "",
        address: "",
        note: "",
        shipping_method: "standard",
        payment_method: paymentMethods?.[0]?.key ?? "cod",
        payment_reference: "",
        address_label: "Home",
        save_address: false,
        address_is_default: false,
        coupon_code: '',
    });

    const subtotal = useMemo(() => items.reduce((sum, item) => sum + itemPrice(item) * Number(item.quantity || 1), 0), [items]);
    const digitalOnly = items.length > 0 && items.every((item) => item.product_type === "ebook");
    const threshold = Number(shippingRates?.free_shipping_threshold ?? 0);
    const qualifiesFreeShipping = threshold > 0 && subtotal >= threshold;
    const homeDeliveryCharge = data.district.trim().toLowerCase() === "dhaka"
        ? Number(shippingRates?.dhaka ?? 60)
        : Number(shippingRates?.outside_dhaka ?? 120);
    const shipping = digitalOnly || data.shipping_method === "store_pickup" || qualifiesFreeShipping
        ? 0
        : homeDeliveryCharge;
    const [couponResult, setCouponResult] = useState(null);
    const [couponLoading, setCouponLoading] = useState(false);
    const discount = Number(couponResult?.discount || 0) + Number(couponResult?.shipping_discount || 0);
    const payableShipping = Math.max(0, shipping - Number(couponResult?.shipping_discount || 0));
    const total = Math.max(0, subtotal + payableShipping - Number(couponResult?.discount || 0));
    const amountUntilFreeShipping = Math.max(0, threshold - subtotal);


    const applyCoupon = async () => {
        if (!data.coupon_code.trim()) return;
        setCouponLoading(true);
        try {
            const token = document.querySelector('meta[name="csrf-token"]')?.content;
            const response = await fetch(route("checkout.coupon.validate"), {method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json","X-CSRF-TOKEN":token},body:JSON.stringify({coupon_code:data.coupon_code,phone:data.phone,shipping,items:items.map(i=>({product_id:i.id,quantity:Number(i.quantity||1)}))})});
            const json = await response.json();
            if (!response.ok) throw new Error(json?.message || Object.values(json?.errors || {})?.[0]?.[0] || "Coupon could not be applied.");
            setCouponResult(json);
        } catch (error) { setCouponResult({error:error.message}); } finally { setCouponLoading(false); }
    };

    const applyAddress = (id) => {
        const address = savedAddresses.find((item) => String(item.id) === String(id));
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
            items: items.map((item) => ({ product_id: item.id, quantity: Number(item.quantity || 1) })),
        }));
        post(route("checkout.store"), { preserveScroll: true, onSuccess: clearCart });
    };

    if (!items.length) {
        return (
            <StorefrontLayout>
                <Head title="Checkout" />
                <div className="mx-auto max-w-3xl px-4 py-20 text-center">
                    <PackageCheck className="mx-auto h-14 w-14 text-teal-700" />
                    <h1 className="mt-4 text-3xl font-black">Your cart is empty</h1>
                    <Link href={route("storefront.catalog")} className="mt-6 inline-flex rounded-xl bg-teal-700 px-6 py-3 font-bold text-white">Shop now</Link>
                </div>
            </StorefrontLayout>
        );
    }

    return (
        <StorefrontLayout>
            <Head title="One-page Checkout" />
            <main className="bg-slate-50 pb-28 pt-8 lg:pb-12">
                <form onSubmit={submit} className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[1fr_390px]">
                    <div className="space-y-6">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-700">Secure one-page checkout</p>
                            <h1 className="mt-2 text-3xl font-black text-slate-900">Complete your order</h1>
                            <div className="mt-4 flex flex-wrap gap-3 text-xs font-bold text-slate-600">
                                <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-teal-600" /> Secure details</span>
                                <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-teal-600" /> Server-verified price</span>
                                <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-teal-600" /> Fast order confirmation</span>
                            </div>
                        </div>

                        {(flash.error || errors.error) && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{flash.error || errors.error}</div>}

                        <section className="rounded-3xl bg-white p-6 shadow-sm">
                            <div className="mb-5 flex items-center gap-3"><Truck className="text-teal-700" /><h2 className="text-xl font-black">Delivery method</h2></div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <label className={`cursor-pointer rounded-2xl border p-4 ${data.shipping_method === "standard" ? "border-teal-600 bg-teal-50" : "border-slate-200"}`}>
                                    <div className="flex gap-3"><input type="radio" checked={data.shipping_method === "standard"} onChange={() => setData("shipping_method", "standard")} className="mt-1 text-teal-600 focus:ring-teal-600" /><div><b>Home delivery</b><p className="mt-1 text-xs text-slate-500">Dhaka and nationwide courier delivery</p></div></div>
                                </label>
                                <label className={`cursor-pointer rounded-2xl border p-4 ${data.shipping_method === "store_pickup" ? "border-teal-600 bg-teal-50" : "border-slate-200"}`}>
                                    <div className="flex gap-3"><input type="radio" checked={data.shipping_method === "store_pickup"} onChange={() => setData("shipping_method", "store_pickup")} className="mt-1 text-teal-600 focus:ring-teal-600" /><div><b>Store pickup</b><p className="mt-1 text-xs text-slate-500">Collect from Nuha Mart BD without delivery charge</p></div></div>
                                </label>
                            </div>
                            {threshold > 0 && !digitalOnly && data.shipping_method === "standard" && (
                                <div className={`mt-4 rounded-xl p-3 text-sm font-semibold ${qualifiesFreeShipping ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"}`}>
                                    {qualifiesFreeShipping ? "You unlocked free delivery." : `Add ${money(amountUntilFreeShipping)} more to unlock free delivery.`}
                                </div>
                            )}
                        </section>

                        <section className="rounded-3xl bg-white p-6 shadow-sm">
                            <div className="mb-5 flex items-center gap-3"><MapPin className="text-teal-700" /><h2 className="text-xl font-black">Contact & address</h2></div>
                            {savedAddresses.length > 0 && data.shipping_method === "standard" && (
                                <label className="mb-5 block"><span className="mb-1.5 block text-sm font-bold">Use saved address</span><select onChange={(e) => applyAddress(e.target.value)} className="w-full rounded-xl border-slate-300 focus:border-teal-600 focus:ring-teal-600"><option value="">Choose an address</option>{savedAddresses.map((address) => <option key={address.id} value={address.id}>{address.label} — {address.area}, {address.district}</option>)}</select></label>
                            )}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field label="Full name" value={data.name} onChange={(e) => setData("name", e.target.value)} error={errors.name} required />
                                <Field label="Mobile number" value={data.phone} onChange={(e) => setData("phone", e.target.value)} error={errors.phone} placeholder="01XXXXXXXXX" required />
                                <Field label="Email (optional)" type="email" value={data.email} onChange={(e) => setData("email", e.target.value)} error={errors.email} className="sm:col-span-2" />
                                {data.shipping_method === "standard" && <>
                                    <Field label="Division" value={data.division} onChange={(e) => setData("division", e.target.value)} error={errors.division} required />
                                    <Field label="District" value={data.district} onChange={(e) => setData("district", e.target.value)} error={errors.district} required />
                                    <Field label="Area / Thana" value={data.area} onChange={(e) => setData("area", e.target.value)} error={errors.area} className="sm:col-span-2" required />
                                    <label className="block sm:col-span-2"><span className="mb-1.5 block text-sm font-bold">Full address</span><textarea value={data.address} onChange={(e) => setData("address", e.target.value)} rows="3" className="w-full rounded-xl border-slate-300 focus:border-teal-600 focus:ring-teal-600" required />{errors.address && <span className="text-xs text-red-600">{errors.address}</span>}</label>
                                </>}
                                <label className="block sm:col-span-2"><span className="mb-1.5 block text-sm font-bold">Order note (optional)</span><textarea value={data.note} onChange={(e) => setData("note", e.target.value)} rows="2" className="w-full rounded-xl border-slate-300 focus:border-teal-600 focus:ring-teal-600" /></label>
                                {customer && data.shipping_method === "standard" && <div className="sm:col-span-2 rounded-xl bg-slate-50 p-4"><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={data.save_address} onChange={(e) => setData("save_address", e.target.checked)} /> Save this address to my account</label>{data.save_address && <div className="mt-3 grid gap-3 sm:grid-cols-2"><Field label="Address label" value={data.address_label} onChange={(e) => setData("address_label", e.target.value)} /><label className="flex items-center gap-2 self-end pb-3 text-sm font-bold"><input type="checkbox" checked={data.address_is_default} onChange={(e) => setData("address_is_default", e.target.checked)} /> Set as default</label></div>}</div>}
                            </div>
                        </section>

                        <section className="rounded-3xl bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-3"><BadgePercent className="text-teal-700" /><h2 className="text-xl font-black">Coupon</h2></div>
                            <div className="mt-4 flex gap-2">
                                <input value={data.coupon_code} onChange={(e) => { setData("coupon_code", e.target.value.toUpperCase()); setCouponResult(null); }} placeholder="Enter coupon code" className="min-w-0 flex-1 rounded-xl border-slate-300 focus:border-teal-600 focus:ring-teal-600" />
                                <button type="button" onClick={applyCoupon} disabled={couponLoading || !data.coupon_code.trim()} className="rounded-xl bg-slate-900 px-5 font-bold text-white disabled:opacity-50">{couponLoading ? "Checking..." : "Apply"}</button>
                            </div>
                            {errors.coupon_code && <p className="mt-2 text-sm font-semibold text-red-700">{errors.coupon_code}</p>}
                            {couponResult?.message && <p className="mt-2 text-sm font-semibold text-emerald-700">{couponResult.message}</p>}
                            {couponResult?.error && <p className="mt-2 text-sm font-semibold text-red-700">{couponResult.error}</p>}
                        </section>

                        <section className="rounded-3xl bg-white p-6 shadow-sm">
                            <div className="mb-5 flex items-center gap-3"><WalletCards className="text-teal-700" /><h2 className="text-xl font-black">Payment method</h2></div>
                            <div className="grid gap-3 sm:grid-cols-2">{paymentMethods.map((method) => <label key={method.key} className={`cursor-pointer rounded-2xl border p-4 ${data.payment_method === method.key ? "border-teal-600 bg-teal-50" : "border-slate-200"}`}><div className="flex gap-3"><input type="radio" value={method.key} checked={data.payment_method === method.key} onChange={(e) => { setData("payment_method", e.target.value); setData("payment_reference", ""); }} className="mt-1 text-teal-600 focus:ring-teal-600" /><div><b>{method.label}</b><p className="mt-1 whitespace-pre-line text-xs text-slate-500">{method.account ? `Pay to / Instructions: ${method.account}` : method.key === "cod" ? "Pay when the parcel arrives" : "Secure online payment"}</p></div></div></label>)}</div>
                            {["bkash", "nagad", "bank"].includes(data.payment_method) && <Field label="Transaction / reference number" value={data.payment_reference} onChange={(e) => setData("payment_reference", e.target.value)} error={errors.payment_reference} className="mt-4" required />}
                        </section>
                    </div>

                    <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm lg:sticky lg:top-6">
                        <h2 className="text-xl font-black">Order summary</h2>
                        <div className="mt-5 max-h-72 space-y-4 overflow-auto pr-1">{items.map((item) => <div key={item.id} className="flex gap-3"><img src={item.image || "https://placehold.co/100x100?text=Nuha Mart BD"} className="h-16 w-16 rounded-lg border object-contain" loading="lazy" alt="" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{item.name}</p><p className="text-xs text-slate-500">Qty {item.quantity}</p></div><b className="text-sm">{money(itemPrice(item) * item.quantity)}</b></div>)}</div>
                        <div className="mt-5 space-y-3 border-t pt-5 text-sm"><div className="flex justify-between"><span>Subtotal</span><b>{money(subtotal)}</b></div><div className="flex justify-between"><span>Shipping</span><b className={payableShipping === 0 ? "text-emerald-600" : ""}>{payableShipping === 0 ? "Free" : money(payableShipping)}</b></div>{discount > 0 && <div className="flex justify-between text-emerald-700"><span>Coupon discount</span><b>-{money(discount)}</b></div>}<div className="flex justify-between border-t pt-4 text-lg"><span className="font-black">Total</span><span className="font-black text-teal-700">{money(total)}</span></div></div>
                        <button disabled={processing} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3.5 font-black text-white disabled:cursor-not-allowed disabled:opacity-50"><LockKeyhole size={18} />{processing ? "Placing order..." : "Place order"}</button>
                        <p className="mt-3 text-center text-xs text-slate-500">Price, stock and delivery charge are verified securely before order creation.</p>
                    </aside>
                </form>

                <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white p-3 shadow-2xl lg:hidden">
                    <div className="mx-auto flex max-w-7xl items-center gap-3"><div className="min-w-0 flex-1"><p className="text-xs font-semibold text-slate-500">Total payable</p><p className="text-xl font-black text-teal-700">{money(total)}</p></div><button type="button" disabled={processing} onClick={() => document.querySelector("form")?.requestSubmit()} className="flex min-w-[180px] items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 font-black text-white disabled:opacity-50"><LockKeyhole size={17} />{processing ? "Please wait..." : "Place order"}</button></div>
                </div>
            </main>
        </StorefrontLayout>
    );
}

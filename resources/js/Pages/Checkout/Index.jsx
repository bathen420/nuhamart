import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { LockKeyhole, MapPin, WalletCards } from "lucide-react";
import { useMemo } from "react";
import StorefrontLayout from "@/Layouts/StorefrontLayout";
import useCart from "@/hooks/useCart";

const money = (value) => `৳${Number(value || 0).toLocaleString("en-BD", { maximumFractionDigits: 2 })}`;
const itemPrice = (item) => Number(item.product_type === "ebook" ? (item.ebook_price ?? item.sale_price ?? item.price) : (item.sale_price ?? item.price ?? 0));
const Field = ({ label, error, className = "", ...props }) => <label className={`block ${className}`}><span className="mb-1.5 block text-sm font-bold text-slate-700">{label}</span><input {...props} className="w-full rounded-xl border-slate-300 focus:border-orange-500 focus:ring-orange-500"/>{error && <span className="mt-1 block text-xs font-semibold text-red-600">{error}</span>}</label>;

export default function CheckoutIndex({ customer, shippingRates, savedAddresses = [], paymentMethods = [] }) {
    const { flash = {} } = usePage().props;
    const { items, clearCart } = useCart();
    const { data, setData, post, processing, errors, transform } = useForm({
        name: customer?.name ?? "", phone: customer?.phone ?? "", email: customer?.email ?? "", division: "Dhaka", district: "Dhaka", area: "", address: "", note: "", shipping_method: "standard", payment_method: "cod", payment_reference: "", address_label: "Home", save_address: false, address_is_default: false,
    });
    const subtotal = useMemo(() => items.reduce((sum, item) => sum + itemPrice(item) * Number(item.quantity || 1), 0), [items]);
    const digitalOnly = items.length > 0 && items.every((item) => item.product_type === "ebook");
    const shipping = digitalOnly ? Number(shippingRates?.digital_only ?? 0) : (data.district.trim().toLowerCase() === "dhaka" ? Number(shippingRates?.dhaka ?? 60) : Number(shippingRates?.outside_dhaka ?? 120));
    const total = subtotal + shipping;
    const applyAddress = (id) => {
        const address = savedAddresses.find((item) => String(item.id) === String(id));
        if (!address) return;
        Object.entries({ name: address.name, phone: address.phone, division: address.division, district: address.district, area: address.area, address: address.address }).forEach(([key, value]) => setData(key, value || ""));
    };
    const submit = (e) => {
        e.preventDefault();
        transform((form) => ({ ...form, items: items.map((item) => ({ product_id: item.id, quantity: Number(item.quantity || 1) })) }));
        post(route("checkout.store"), { preserveScroll: true, onSuccess: clearCart });
    };

    if (!items.length) return <StorefrontLayout><Head title="Checkout"/><div className="mx-auto max-w-3xl px-4 py-20 text-center"><h1 className="text-3xl font-black">Your cart is empty</h1><Link href={route("storefront.catalog")} className="mt-6 inline-flex rounded-xl bg-teal-700 px-6 py-3 font-bold text-white">Shop now</Link></div></StorefrontLayout>;

    return <StorefrontLayout><Head title="Checkout"/><main className="bg-slate-50 py-10"><form onSubmit={submit} className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[1fr_390px]">
        <div className="space-y-6">
            <div><p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-700">Secure checkout</p><h1 className="mt-2 text-3xl font-black">Complete your order</h1></div>
            {(flash.error || errors.error) && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{flash.error || errors.error}</div>}
            <section className="rounded-3xl bg-white p-6 shadow-sm"><div className="mb-5 flex items-center gap-3"><MapPin className="text-teal-700"/><h2 className="text-xl font-black">Contact & Delivery</h2></div>{savedAddresses.length > 0 && <label className="mb-5 block"><span className="mb-1.5 block text-sm font-bold">Use saved address</span><select onChange={(e)=>applyAddress(e.target.value)} className="w-full rounded-xl border-slate-300 focus:border-teal-600 focus:ring-teal-600"><option value="">Choose an address</option>{savedAddresses.map(a=><option key={a.id} value={a.id}>{a.label} — {a.area}, {a.district}</option>)}</select></label>}<div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" value={data.name} onChange={(e)=>setData("name",e.target.value)} error={errors.name} required/>
                <Field label="Mobile number" value={data.phone} onChange={(e)=>setData("phone",e.target.value)} error={errors.phone} placeholder="01XXXXXXXXX" required/>
                <Field label="Email (optional)" type="email" value={data.email} onChange={(e)=>setData("email",e.target.value)} error={errors.email} className="sm:col-span-2"/>
                <Field label="Division" value={data.division} onChange={(e)=>setData("division",e.target.value)} error={errors.division} required/>
                <Field label="District" value={data.district} onChange={(e)=>setData("district",e.target.value)} error={errors.district} required/>
                <Field label="Area / Thana" value={data.area} onChange={(e)=>setData("area",e.target.value)} error={errors.area} className="sm:col-span-2" required/>
                <label className="block sm:col-span-2"><span className="mb-1.5 block text-sm font-bold">Full address</span><textarea value={data.address} onChange={(e)=>setData("address",e.target.value)} rows="3" className="w-full rounded-xl border-slate-300 focus:border-orange-500 focus:ring-orange-500" required/>{errors.address && <span className="text-xs text-red-600">{errors.address}</span>}</label>
                <label className="block sm:col-span-2"><span className="mb-1.5 block text-sm font-bold">Order note (optional)</span><textarea value={data.note} onChange={(e)=>setData("note",e.target.value)} rows="2" className="w-full rounded-xl border-slate-300 focus:border-orange-500 focus:ring-orange-500"/></label>{customer && <div className="sm:col-span-2 rounded-xl bg-slate-50 p-4"><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={data.save_address} onChange={(e)=>setData("save_address",e.target.checked)}/> Save this address to my account</label>{data.save_address && <div className="mt-3 grid gap-3 sm:grid-cols-2"><Field label="Address label" value={data.address_label} onChange={(e)=>setData("address_label",e.target.value)}/><label className="flex items-center gap-2 self-end pb-3 text-sm font-bold"><input type="checkbox" checked={data.address_is_default} onChange={(e)=>setData("address_is_default",e.target.checked)}/> Set as default</label></div>}</div>}
            </div></section>
            <section className="rounded-3xl bg-white p-6 shadow-sm"><div className="mb-5 flex items-center gap-3"><WalletCards className="text-teal-700"/><h2 className="text-xl font-black">Payment method</h2></div><div className="grid gap-3 sm:grid-cols-2">{paymentMethods.map((method)=><label key={method.key} className={`cursor-pointer rounded-2xl border p-4 ${data.payment_method===method.key?'border-teal-600 bg-teal-50':'border-slate-200'}`}><div className="flex gap-3"><input type="radio" value={method.key} checked={data.payment_method===method.key} onChange={(e)=>setData("payment_method",e.target.value)} className="mt-1 text-teal-600 focus:ring-teal-600"/><div><b>{method.label}</b><p className="mt-1 text-xs text-slate-500">{method.account ? `Pay to ${method.account}` : method.key === 'cod' ? 'Pay when the parcel arrives' : 'Secure online payment'}</p></div></div></label>)}</div>
                {["bkash","nagad"].includes(data.payment_method) && <Field label="Transaction / reference number" value={data.payment_reference} onChange={(e)=>setData("payment_reference",e.target.value)} error={errors.payment_reference} className="mt-4" required/>}
            </section>
        </div>
        <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm lg:sticky lg:top-6"><h2 className="text-xl font-black">Order summary</h2><div className="mt-5 max-h-72 space-y-4 overflow-auto pr-1">{items.map(item=><div key={item.id} className="flex gap-3"><img src={item.image||"https://placehold.co/100x100?text=Nuha Mart BD"} className="h-16 w-16 rounded-lg border object-contain"/><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{item.name}</p><p className="text-xs text-slate-500">Qty {item.quantity}</p></div><b className="text-sm">{money(itemPrice(item)*item.quantity)}</b></div>)}</div><div className="mt-5 space-y-3 border-t pt-5 text-sm"><div className="flex justify-between"><span>Subtotal</span><b>{money(subtotal)}</b></div><div className="flex justify-between"><span>Shipping</span><b>{money(shipping)}</b></div><div className="flex justify-between border-t pt-4 text-lg"><span className="font-black">Total</span><span className="font-black text-teal-700">{money(total)}</span></div></div><button disabled={processing} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3.5 font-black text-white disabled:opacity-50"><LockKeyhole size={18}/>{processing?'Placing order...':'Place order'}</button><p className="mt-3 text-center text-xs text-slate-500">Price and stock are verified securely before the order is created.</p></aside>
    </form></main></StorefrontLayout>;
}

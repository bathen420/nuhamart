import { Head, Link } from "@inertiajs/react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import StorefrontLayout from "@/Layouts/StorefrontLayout";
import useCart from "@/hooks/useCart";

const money = (value) => `৳${Number(value || 0).toLocaleString("en-BD", { maximumFractionDigits: 2 })}`;
const priceOf = (item) => Number(item.sale_price ?? item.price ?? item.ebook_price ?? 0);

export default function CartIndex() {
    const { items, subtotal, increaseQuantity, decreaseQuantity, updateQuantity, removeFromCart, clearCart } = useCart();

    return (
        <StorefrontLayout>
            <Head title="Shopping Cart" />
            <main className="min-h-[70vh] bg-slate-50 py-10">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="mb-8 flex items-end justify-between gap-4">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">Your basket</p>
                            <h1 className="mt-2 text-3xl font-black text-slate-900">Shopping Cart</h1>
                        </div>
                        {items.length > 0 && <button onClick={clearCart} className="text-sm font-bold text-red-600">Clear cart</button>}
                    </div>

                    {items.length === 0 ? (
                        <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
                            <ShoppingBag className="mx-auto h-14 w-14 text-slate-300" />
                            <h2 className="mt-5 text-2xl font-black">Your cart is empty</h2>
                            <p className="mt-2 text-slate-500">Browse books, ebooks and products to get started.</p>
                            <Link href={route("storefront.catalog")} className="mt-6 inline-flex rounded-xl bg-orange-600 px-6 py-3 font-bold text-white">Continue shopping</Link>
                        </div>
                    ) : (
                        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
                            <section className="space-y-4">
                                {items.map((item) => {
                                    const max = item.product_type === "ebook" ? 100 : Math.max(1, Number(item.stock ?? 1));
                                    return <article key={item.id} className="grid gap-4 rounded-2xl bg-white p-4 shadow-sm sm:grid-cols-[110px_1fr_auto] sm:items-center">
                                        <Link href={item.slug ? route("storefront.products.show", item.slug) : "#"} className="overflow-hidden rounded-xl border bg-slate-50">
                                            <img src={item.image || "https://placehold.co/300x300?text=Nuha Mart BD"} alt={item.name} className="aspect-square w-full object-contain p-2" />
                                        </Link>
                                        <div>
                                            <Link href={item.slug ? route("storefront.products.show", item.slug) : "#"} className="text-lg font-black text-slate-900 hover:text-orange-600">{item.name}</Link>
                                            <p className="mt-1 text-sm text-slate-500">{item.product_type === "ebook" ? "Digital ebook" : `${item.stock ?? 0} in stock`}</p>
                                            <p className="mt-3 font-black text-orange-600">{money(priceOf(item))}</p>
                                        </div>
                                        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                                            <button onClick={() => removeFromCart(item.id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50" aria-label={`Remove ${item.name}`}><Trash2 size={18}/></button>
                                            <div className="flex items-center rounded-xl border">
                                                <button onClick={() => decreaseQuantity(item.id)} className="p-2"><Minus size={16}/></button>
                                                <input value={item.quantity} onChange={(e) => updateQuantity(item.id, Math.min(max, Math.max(1, Number(e.target.value))))} className="w-12 border-0 p-0 text-center font-bold focus:ring-0" type="number" min="1" max={max}/>
                                                <button onClick={() => Number(item.quantity) < max && increaseQuantity(item.id)} className="p-2"><Plus size={16}/></button>
                                            </div>
                                            <p className="font-black text-slate-900">{money(priceOf(item) * Number(item.quantity))}</p>
                                        </div>
                                    </article>;
                                })}
                            </section>
                            <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm lg:sticky lg:top-6">
                                <h2 className="text-xl font-black">Order Summary</h2>
                                <div className="mt-6 space-y-3 text-sm">
                                    <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><b>{money(subtotal)}</b></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Shipping</span><span>Calculated at checkout</span></div>
                                </div>
                                <div className="mt-5 border-t pt-5"><div className="flex justify-between text-lg"><span className="font-bold">Estimated total</span><span className="font-black text-orange-600">{money(subtotal)}</span></div></div>
                                <Link href={route("checkout.index")} className="mt-6 flex w-full justify-center rounded-xl bg-orange-600 px-5 py-3.5 font-black text-white hover:bg-orange-700">Proceed to checkout</Link>
                                <Link href={route("storefront.catalog")} className="mt-3 flex w-full justify-center rounded-xl border px-5 py-3 font-bold text-slate-700">Continue shopping</Link>
                            </aside>
                        </div>
                    )}
                </div>
            </main>
        </StorefrontLayout>
    );
}

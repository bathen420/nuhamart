import { Link } from "@inertiajs/react";
import { CheckCircle2, ShoppingCart, X } from "lucide-react";
import useCart from "@/hooks/useCart";
import ProductPrice from "./ProductPrice";
import ProductRating from "./ProductRating";

export default function QuickViewModal({ product, onClose }) {
    const { addToCart } = useCart();
    if (!product) return null;

    const image = product.image || "https://placehold.co/700x700?text=Nuha Mart BD+Product";
    const inStock = Number(product.stock || 0) > 0;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" onMouseDown={onClose}>
            <div className="relative max-h-[92vh] w-full max-w-4xl overflow-auto rounded-3xl bg-white shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
                <button type="button" onClick={onClose} className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white text-slate-700 shadow-lg hover:bg-slate-100" aria-label="Close quick view"><X size={20}/></button>
                <div className="grid gap-7 p-6 md:grid-cols-2 md:p-8">
                    <div className="overflow-hidden rounded-2xl bg-slate-100"><img src={image} alt={product.name} className="aspect-square h-full w-full object-cover"/></div>
                    <div className="flex flex-col justify-center">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-500">{product.category?.name || product.product_type || "Nuha Mart BD"}</p>
                        <h2 className="mt-3 text-3xl font-black leading-tight text-[#102b4e]">{product.name}</h2>
                        {product.author?.name && <p className="mt-2 text-sm text-slate-500">by <span className="font-bold text-slate-700">{product.author.name}</span></p>}
                        <div className="mt-4"><ProductRating rating={Number(product.rating) || 0} reviews={Number(product.review_count) || 0}/></div>
                        <div className="mt-5"><ProductPrice price={Number(product.price) || 0} salePrice={product.sale_price ? Number(product.sale_price) : null}/></div>
                        <div className={`mt-5 flex items-center gap-2 text-sm font-bold ${inStock ? "text-emerald-600" : "text-rose-600"}`}><CheckCircle2 size={18}/>{inStock ? `${product.stock} item available` : "Currently unavailable"}</div>
                        <div className="mt-7 flex flex-wrap gap-3">
                            <button type="button" disabled={!inStock} onClick={() => inStock && addToCart(product)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 font-black text-white shadow-lg hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300"><ShoppingCart size={18}/> Add to Cart</button>
                            <Link href={product.slug ? `/products/${product.slug}` : "#"} className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3.5 font-black text-[#102b4e] hover:border-orange-300 hover:bg-orange-50">View Details</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { Link, router } from "@inertiajs/react";
import { Eye, ShoppingBag } from "lucide-react";
import { memo } from "react";
import ProductBadge from "./ProductBadge";
import ProductPrice from "./ProductPrice";
import ProductRating from "./ProductRating";
import WishlistButton from "./WishlistButton";
import useCart from "@/hooks/useCart";

function ProductCard({
    product,
    showWishlist = true,
    showQuickView = true,
    showDiscount = true,
    showRating = true,
    showProgress = false,
    showStock = true,
    showBadges = true,
    onQuickView,
}) {
    const { addToCart } = useCart();
    const {
        id,
        name = "Unnamed Product",
        slug,
        image,
        brand,
        category,
        author,
        publisher,
        price = 0,
        sale_price = null,
        rating = 0,
        review_count = 0,
        discount = 0,
        stock = 0,
        sold = 0,
        is_new = false,
        is_featured = false,
        product_type = "physical",
    } = product ?? {};

    const productImage = image || "https://placehold.co/700x850?text=Nuha+Mart+BD";
    const safeStock = Number(stock) || 0;
    const safeSold = Number(sold) || 0;
    const isDigital = ["ebook", "digital"].includes(product_type);
    const isOutOfStock = !isDigital && safeStock <= 0;
    const total = Math.max(safeStock + safeSold, 1);
    const progress = Math.min(Math.round((safeSold / total) * 100), 100);
    const productUrl = slug ? route("storefront.products.show", slug) : "#";

    const add = (event) => {
        event?.preventDefault();
        event?.stopPropagation();
        if (!isOutOfStock) addToCart(product);
    };

    const buyNow = (event) => {
        event?.preventDefault();
        event?.stopPropagation();
        if (isOutOfStock) return;
        addToCart(product);
        router.visit(route("checkout.index"));
    };

    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl">
            <div className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100">
                <Link href={productUrl} aria-label={`View ${name}`} className="block">
                    <img src={productImage} alt={name} loading="lazy" decoding="async" className="aspect-[4/5] w-full object-contain p-3 transition duration-500 group-hover:scale-105" />
                </Link>

                <div className="absolute left-3 top-3 flex flex-col items-start gap-2">
                    {showDiscount && Number(discount) > 0 && <ProductBadge color="red">-{discount}%</ProductBadge>}
                    {showBadges && is_new && <ProductBadge color="blue">New</ProductBadge>}
                    {showBadges && is_featured && <ProductBadge color="yellow">Featured</ProductBadge>}
                    {isDigital && <span className="rounded-full bg-violet-600 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white">E-book</span>}
                </div>

                <div className="absolute right-3 top-3 flex flex-col gap-2">
                    {showWishlist && <WishlistButton product={product} />}
                    {showQuickView && (
                        <button type="button" onClick={() => onQuickView?.(product)} aria-label={`Quick view ${name}`} className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-600 shadow-md transition hover:scale-105 hover:bg-[#f59e0b] hover:text-white focus:outline-none focus:ring-4 focus:ring-orange-100">
                            <Eye className="h-[18px] w-[18px]" />
                        </button>
                    )}
                </div>

                {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/45 backdrop-blur-[1px]">
                        <span className="rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-900 shadow-lg">Out of Stock</span>
                    </div>
                )}

                {!isOutOfStock && (
                    <div className="absolute inset-x-3 bottom-3 hidden translate-y-16 grid-cols-2 gap-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:grid">
                        <button type="button" onClick={add} className="rounded-xl bg-white px-3 py-2.5 text-xs font-black text-[#0f766e] shadow-lg transition hover:bg-teal-50">Add to Cart</button>
                        <button type="button" onClick={buyNow} className="rounded-xl bg-[#0f766e] px-3 py-2.5 text-xs font-black text-white shadow-lg transition hover:bg-[#f59e0b]">Buy Now</button>
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col p-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#0f766e]">
                        <span className="truncate">{author?.name || brand?.name || category?.name || "Nuha Mart BD"}</span>
                    </div>
                    <Link href={productUrl} className="mt-2 block">
                        <h3 className="line-clamp-2 min-h-[44px] text-sm font-black leading-[22px] text-slate-900 transition group-hover:text-[#0f766e] sm:text-base">{name}</h3>
                    </Link>
                    {publisher?.name && <p className="mt-1 truncate text-xs text-slate-500">{publisher.name}</p>}
                    {showRating && <div className="mt-2"><ProductRating rating={Number(rating) || 0} reviews={Number(review_count) || 0} /></div>}
                    <div className="mt-3"><ProductPrice price={Number(price) || 0} salePrice={sale_price != null && Number(sale_price) > 0 ? Number(sale_price) : null} /></div>

                    {showStock && !showProgress && (
                        <p className={`mt-3 text-xs font-bold ${isOutOfStock ? "text-rose-600" : safeStock <= 10 && !isDigital ? "text-amber-600" : "text-emerald-600"}`}>
                            {isOutOfStock ? "Currently unavailable" : isDigital ? "Instant digital access" : safeStock <= 10 ? `Only ${safeStock} left` : "In stock"}
                        </p>
                    )}

                    {showProgress && (
                        <div className="mt-4">
                            <div className="mb-1.5 flex justify-between text-[11px] font-semibold text-slate-500"><span>Sold {safeSold}</span><span>{progress}%</span></div>
                            <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-orange-400" style={{ width: `${progress}%` }} /></div>
                        </div>
                    )}
                </div>

                <div className="mt-4 grid grid-cols-[1fr_auto] gap-2 sm:hidden">
                    <button type="button" onClick={add} disabled={isOutOfStock} className="rounded-xl bg-[#0f766e] px-3 py-2.5 text-xs font-black text-white disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500">{isOutOfStock ? "Out of Stock" : "Add to Cart"}</button>
                    {!isOutOfStock && <button type="button" onClick={buyNow} aria-label="Buy now" className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500 text-white"><ShoppingBag size={17} /></button>}
                </div>
            </div>
        </article>
    );
}

export default memo(ProductCard);

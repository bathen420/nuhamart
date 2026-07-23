import { Eye } from "lucide-react";
import { memo } from "react";

import AddToCartButton from "./AddToCartButton";
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
    showBrand = true,
    showCategory = true,
    showProgress = false,
    showStock = true,
    showBadges = true,
    onAddToCart,
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
        price = 0,
        sale_price = null,
        rating = 0,
        review_count = 0,
        discount = 0,
        stock = 0,
        sold = 0,
        is_new = false,
        is_featured = false,
        free_shipping = false,
    } = product ?? {};

   

    const productImage =
        image ||
        "https://placehold.co/700x700?text=NuhaMart+Product";

    const safeStock = Number(stock) || 0;
    const safeSold = Number(sold) || 0;

    const totalStock = Math.max(safeStock, safeSold);

    const progress =
        totalStock > 0
            ? Math.min(Math.round((safeSold / totalStock) * 100), 100)
            : 0;

    const availableStock = Math.max(safeStock - safeSold, 0);

    const isOutOfStock = safeStock <= 0 || availableStock <= 0;

    const productUrl = slug ? `/products/${slug}` : "#";

    const handleAddToCart = () => {
        if (isOutOfStock) {
            return;
        }

        // Global Cart Context
        addToCart(product);

        // Optional callback
        if (typeof onAddToCart === "function") {
            onAddToCart(product);
        }

        console.log("Added to cart:", {
            id,
            product,
        });
    };

    const handleQuickView = () => {
        if (typeof onQuickView === "function") {
            onQuickView(product);
            return;
        }

        console.log("Quick view:", {
            id,
            product,
        });
    };

    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl">
            {/* Product image area */}
            <div className="relative overflow-hidden bg-slate-100">
                <a
                    href={productUrl}
                    aria-label={`View ${name}`}
                    className="block"
                >
                    <img
                        src={productImage}
                        alt={name}
                        loading="lazy"
                        className="aspect-square w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                </a>

                {/* Left badges */}
                <div className="absolute left-3 top-3 flex flex-col items-start gap-2">
                    {showDiscount && Number(discount) > 0 && (
                        <ProductBadge color="red">
                            -{discount}%
                        </ProductBadge>
                    )}

                    {showBadges && is_new && (
                        <ProductBadge color="blue">
                            New
                        </ProductBadge>
                    )}

                    {showBadges && is_featured && (
                        <ProductBadge color="yellow">
                            Featured
                        </ProductBadge>
                    )}
                </div>

                {/* Right action buttons */}
                <div className="absolute right-3 top-3 flex flex-col gap-2">
                    {showWishlist && (
                        <WishlistButton product={product} />
                    )}

                    {showQuickView && (
                        <button
                            type="button"
                            onClick={handleQuickView}
                            aria-label={`Quick view ${name}`}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-600 shadow-md transition hover:scale-105 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-4 focus:ring-indigo-100"
                        >
                            <Eye className="h-[18px] w-[18px]" />
                        </button>
                    )}
                </div>

                {/* Out of stock overlay */}
                {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/45 backdrop-blur-[1px]">
                        <span className="rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-900 shadow-lg">
                            Out of Stock
                        </span>
                    </div>
                )}

                {/* Desktop add-to-cart overlay */}
                {!isOutOfStock && (
                    <div className="absolute inset-x-3 bottom-3 hidden translate-y-16 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:block">
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            className="flex w-full items-center justify-center rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-200"
                        >
                            Add To Cart
                        </button>
                    </div>
                )}
            </div>

            {/* Product information */}
            <div className="flex flex-1 flex-col p-5">
                <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        {showBrand && brand?.name && (
                            <p className="text-xs font-black uppercase tracking-wider text-indigo-600">
                                {brand.name}
                            </p>
                        )}

                        {showBrand &&
                            brand?.name &&
                            showCategory &&
                            category?.name && (
                                <span className="text-xs text-slate-300">
                                    /
                                </span>
                            )}

                        {showCategory && category?.name && (
                            <p className="text-xs font-medium text-slate-500">
                                {category.name}
                            </p>
                        )}
                    </div>

                    <a
                        href={productUrl}
                        className="mt-3 block"
                    >
                        <h3 className="line-clamp-2 min-h-[48px] text-base font-black leading-6 text-slate-900 transition group-hover:text-indigo-600">
                            {name}
                        </h3>
                    </a>

                    {showRating && (
                        <div className="mt-3">
                            <ProductRating
                                rating={Number(rating) || 0}
                                reviews={Number(review_count) || 0}
                            />
                        </div>
                    )}

                    <div className="mt-4">
                        <ProductPrice
                            price={Number(price) || 0}
                            salePrice={
                                sale_price !== null &&
                                sale_price !== undefined &&
                                Number(sale_price) > 0
                                    ? Number(sale_price)
                                    : null
                            }
                        />
                    </div>

                    {/* Product labels */}
                    {showBadges && free_shipping && (
                        <div className="mt-4">
                            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
                                Free Shipping
                            </span>
                        </div>
                    )}

                    {/* Stock status */}
                    {showStock && !showProgress && (
                        <div className="mt-4">
                            {isOutOfStock ? (
                                <p className="text-xs font-bold text-rose-600">
                                    Currently unavailable
                                </p>
                            ) : availableStock <= 10 ? (
                                <p className="text-xs font-bold text-amber-600">
                                    Only {availableStock} items left
                                </p>
                            ) : (
                                <p className="text-xs font-bold text-emerald-600">
                                    In stock
                                </p>
                            )}
                        </div>
                    )}

                    {/* Sold progress */}
                    {showProgress && (
                        <div className="mt-5">
                            <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                                <span className="font-semibold text-slate-500">
                                    Sold: {safeSold}
                                </span>

                                <span className="font-semibold text-slate-500">
                                    Available: {availableStock}
                                </span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-rose-500 to-orange-400 transition-all duration-500"
                                    style={{
                                        width: `${progress}%`,
                                    }}
                                />
                            </div>

                            <p className="mt-2 text-right text-[11px] font-bold text-slate-400">
                                {progress}% sold
                            </p>
                        </div>
                    )}
                </div>

                {/* Mobile/default add-to-cart button */}
                <div className="mt-5">
                    {isOutOfStock ? (
                        <button
                            type="button"
                            disabled
                            className="flex w-full cursor-not-allowed items-center justify-center rounded-xl bg-slate-200 py-3 font-semibold text-slate-500"
                        >
                            Out of Stock
                        </button>
                    ) : (
                        <AddToCartButton onClick={handleAddToCart} />
                    )}
                </div>
            </div>
        </article>
    );
}

export default memo(ProductCard);
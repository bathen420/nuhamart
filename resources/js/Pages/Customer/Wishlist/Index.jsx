import axios from "axios";
import { Head, Link, usePage } from "@inertiajs/react";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import CustomerAccountLayout from "@/Layouts/CustomerAccountLayout";
import StorefrontLayout from "@/Layouts/StorefrontLayout";
import ProductPrice from "@/Components/Storefront/ProductPrice";
import useCart from "@/hooks/useCart";
import useWishlist from "@/hooks/useWishlist";

export default function Index({
    products: initialProducts = [],
    isAuthenticated = false,
}) {
    const { auth = {} } = usePage().props;
    const wishlist = useWishlist(auth?.user ?? null);
    const { addToCart } = useCart();

    const [products, setProducts] = useState(initialProducts);
    const [loading, setLoading] = useState(!isAuthenticated);

    useEffect(() => {
        if (isAuthenticated) {
            setProducts(initialProducts);
            setLoading(false);
            return;
        }

        const loadGuestProducts = async () => {
            setLoading(true);

            try {
                const response = await axios.post(route("wishlist.resolve"), {
                    product_ids: [...wishlist.ids],
                });

                setProducts(response.data.products || []);
            } finally {
                setLoading(false);
            }
        };

        loadGuestProducts();
    }, [isAuthenticated, initialProducts, wishlist.ids]);

    const remove = async (product) => {
        await wishlist.remove(product);
        setProducts((current) =>
            current.filter((item) => item.id !== product.id),
        );
    };

    const moveToCart = async (product) => {
        const isDigital = ["ebook", "digital"].includes(product.product_type);
        const available = isDigital || Number(product.stock) > 0;

        if (!available) return;

        addToCart(product);
        await remove(product);
    };

    const content = (
        <div className="rounded-3xl bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                    <p className="text-xs font-black uppercase tracking-[.2em] text-teal-700">
                        Saved products
                    </p>
                    <h1 className="mt-2 text-3xl font-black text-slate-900">
                        My Wishlist
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        {wishlist.count} saved{" "}
                        {wishlist.count === 1 ? "product" : "products"}
                    </p>
                </div>

                {!isAuthenticated && (
                    <Link
                        href={route("customer.login")}
                        className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-black text-white transition hover:bg-teal-700"
                    >
                        Sign in to sync wishlist
                    </Link>
                )}
            </div>

            {loading ? (
                <div className="py-20 text-center text-sm font-bold text-slate-500">
                    Loading your wishlist...
                </div>
            ) : products.length === 0 ? (
                <div className="py-20 text-center">
                    <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-rose-50 text-rose-500">
                        <Heart size={34} />
                    </span>
                    <h2 className="mt-5 text-xl font-black text-slate-900">
                        Your wishlist is empty
                    </h2>
                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                        Save products you love and return to them whenever you
                        are ready to shop.
                    </p>
                    <Link
                        href={route("storefront.catalog")}
                        className="mt-6 inline-flex rounded-xl bg-teal-700 px-6 py-3 text-sm font-black text-white transition hover:bg-teal-800"
                    >
                        Explore products
                    </Link>
                </div>
            ) : (
                <div className="mt-6 grid gap-4">
                    {products.map((product) => {
                        const isDigital = ["ebook", "digital"].includes(
                            product.product_type,
                        );
                        const outOfStock =
                            !isDigital && Number(product.stock) <= 0;
                        const image =
                            product.image ||
                            "https://placehold.co/300x360?text=Nuha+Mart+BD";

                        return (
                            <article
                                key={product.id}
                                className="grid gap-4 rounded-2xl border border-slate-200 p-4 sm:grid-cols-[110px_1fr_auto] sm:items-center"
                            >
                                <Link
                                    href={route(
                                        "storefront.products.show",
                                        product.slug,
                                    )}
                                    className="overflow-hidden rounded-xl bg-slate-50"
                                >
                                    <img
                                        src={image}
                                        alt={product.name}
                                        className="aspect-square h-full w-full object-contain p-2"
                                    />
                                </Link>

                                <div className="min-w-0">
                                    <p className="text-xs font-black uppercase tracking-wider text-teal-700">
                                        {product.author?.name ||
                                            product.brand?.name ||
                                            product.category?.name ||
                                            "Nuha Mart BD"}
                                    </p>

                                    <Link
                                        href={route(
                                            "storefront.products.show",
                                            product.slug,
                                        )}
                                        className="mt-1 block"
                                    >
                                        <h2 className="line-clamp-2 text-lg font-black text-slate-900 transition hover:text-teal-700">
                                            {product.name}
                                        </h2>
                                    </Link>

                                    <div className="mt-2">
                                        <ProductPrice
                                            price={Number(product.price) || 0}
                                            salePrice={
                                                product.sale_price != null
                                                    ? Number(
                                                          product.sale_price,
                                                      )
                                                    : null
                                            }
                                        />
                                    </div>

                                    <p
                                        className={`mt-2 text-xs font-bold ${
                                            outOfStock
                                                ? "text-rose-600"
                                                : "text-emerald-600"
                                        }`}
                                    >
                                        {outOfStock
                                            ? "Currently out of stock"
                                            : isDigital
                                              ? "Instant digital access"
                                              : "In stock"}
                                    </p>
                                </div>

                                <div className="flex gap-2 sm:flex-col">
                                    <button
                                        type="button"
                                        disabled={outOfStock}
                                        onClick={() => moveToCart(product)}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-3 text-xs font-black text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                                    >
                                        <ShoppingCart size={16} />
                                        Move to cart
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => remove(product)}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-xs font-black text-rose-600 transition hover:bg-rose-100"
                                    >
                                        <Trash2 size={16} />
                                        Remove
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );

    if (isAuthenticated) {
        return (
            <CustomerAccountLayout title="My Wishlist">
                <Head title="My Wishlist" />
                {content}
            </CustomerAccountLayout>
        );
    }

    return (
        <StorefrontLayout>
            <Head title="Wishlist" />
            <main className="bg-slate-50 py-10">
                <div className="mx-auto max-w-6xl px-4">{content}</div>
            </main>
        </StorefrontLayout>
    );
}

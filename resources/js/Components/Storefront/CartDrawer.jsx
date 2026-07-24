import { Link } from "@inertiajs/react";
import {
    ArrowRight,
    ShoppingBag,
    ShoppingCart,
    Trash2,
    X,
} from "lucide-react";
import { useEffect } from "react";
import useCart from "@/hooks/useCart";
import CartItem from "./CartItem";

function formatCurrency(amount) {
    return new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(Number(amount || 0));
}

export default function CartDrawer({ open, onClose }) {
    const {
        cartItems,
        totalItems,
        subtotal,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
    } = useCart();

    useEffect(() => {
        if (!open) {
            return undefined;
        }

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = previousOverflow;
        };
    }, [open, onClose]);

    return (
        <div
            className={`fixed inset-0 z-[80] transition ${
                open ? "pointer-events-auto" : "pointer-events-none"
            }`}
            aria-hidden={!open}
        >
            <button
                type="button"
                aria-label="Close shopping cart"
                onClick={onClose}
                className={`absolute inset-0 bg-slate-950/50 backdrop-blur-sm transition-opacity duration-300 ${
                    open ? "opacity-100" : "opacity-0"
                }`}
            />

            <aside
                role="dialog"
                aria-modal="true"
                aria-label="Shopping cart"
                className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
                    open ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex min-h-20 items-center justify-between border-b border-slate-200 px-5 sm:px-6">
                    <div>
                        <div className="flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5 text-indigo-600" />

                            <h2 className="text-lg font-black text-slate-900">
                                Shopping Cart
                            </h2>
                        </div>

                        <p className="mt-1 text-xs font-medium text-slate-500">
                            {totalItems}{" "}
                            {totalItems === 1 ? "item" : "items"} in your cart
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close cart drawer"
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition hover:bg-slate-200 hover:text-slate-950"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {cartItems.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                            <ShoppingBag className="h-11 w-11" />
                        </div>

                        <h3 className="mt-6 text-xl font-black text-slate-900">
                            Your cart is empty
                        </h3>

                        <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                            আপনার পছন্দের পণ্য Cart-এ যোগ করুন এবং সহজে
                            Checkout সম্পন্ন করুন।
                        </p>

                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
                        >
                            Continue Shopping
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3 sm:px-6">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Cart products
                            </p>

                            <button
                                type="button"
                                onClick={clearCart}
                                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-bold text-rose-600 transition hover:bg-rose-50"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                Clear cart
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-5 sm:px-6">
                            {cartItems.map((item) => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    onIncrease={increaseQuantity}
                                    onDecrease={decreaseQuantity}
                                    onRemove={removeFromCart}
                                />
                            ))}
                        </div>

                        <div className="border-t border-slate-200 bg-white px-5 py-5 shadow-[0_-8px_30px_rgba(15,23,42,0.06)] sm:px-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-slate-500">
                                        Subtotal
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Shipping charge calculated at checkout
                                    </p>
                                </div>

                                <p className="text-xl font-black text-slate-950">
                                    {formatCurrency(subtotal)}
                                </p>
                            </div>

                            <div className="mt-5 grid gap-3">
                                <Link
                                    href="/cart"
                                    onClick={onClose}
                                    className="flex min-h-12 items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50 px-4 text-sm font-bold text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-100"
                                >
                                    View Cart
                                </Link>

                                <Link
                                    href="/checkout"
                                    onClick={onClose}
                                    className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-bold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
                                >
                                    Proceed to Checkout
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </aside>
        </div>
    );
}
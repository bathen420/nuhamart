import useCart from "@/hooks/useCart";
import CartSummaryItem from "./CartSummaryItem";

export default function OrderSummary() {
    const { cartItems = [], subtotal = 0 } = useCart();

    const safeSubtotal = Number(subtotal) || 0;
    const shipping = safeSubtotal >= 1500 ? 0 : 80;
    const total = safeSubtotal + shipping;

    return (
        <div className="sticky top-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-900">
                Order Summary
            </h2>

            {cartItems.length === 0 ? (
                <div className="py-10 text-center text-sm text-slate-500">
                    Your cart is empty.
                </div>
            ) : (
                <div className="mt-4">
                    {cartItems.map((item) => (
                        <CartSummaryItem
                            key={item.id}
                            item={item}
                        />
                    ))}
                </div>
            )}

            <div className="mt-6 space-y-3 border-t border-slate-200 pt-5">
                <div className="flex justify-between text-sm text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">
                        BDT {safeSubtotal.toLocaleString()}
                    </span>
                </div>

                <div className="flex justify-between text-sm text-slate-600">
                    <span>Shipping</span>
                    <span className="font-semibold text-slate-900">
                        {shipping === 0
                            ? "Free"
                            : `BDT ${shipping.toLocaleString()}`}
                    </span>
                </div>

                <div className="flex justify-between border-t border-slate-200 pt-4 text-xl font-black text-slate-900">
                    <span>Total</span>
                    <span>BDT {total.toLocaleString()}</span>
                </div>
            </div>

            <button
                type="button"
                disabled={cartItems.length === 0}
                className="mt-6 w-full rounded-xl bg-indigo-600 px-5 py-4 font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
                Place Order
            </button>
        </div>
    );
}
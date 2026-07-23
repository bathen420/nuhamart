import { ShoppingCart } from "lucide-react";

export default function AddToCartButton({
    onClick,
}) {
    return (
        <button
            onClick={onClick}
            type="button"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700"
        >
            <ShoppingCart size={18} />

            Add To Cart
        </button>
    );
}
import { ShoppingCart } from "lucide-react";

export default function AddToCartButton({
    onClick,
    disabled = false,
    label = "Add to Cart",
    className = "",
}) {
    const handleClick = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (disabled) {
            return;
        }

        onClick?.(event);
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={disabled}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 ${className}`}
        >
            <ShoppingCart className="h-4 w-4" />
            {label}
        </button>
    );
}
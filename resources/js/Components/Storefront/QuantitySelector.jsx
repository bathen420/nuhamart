import { Minus, Plus } from "lucide-react";

export default function QuantitySelector({
    quantity,
    onIncrease,
    onDecrease,
    disabled = false,
}) {
    return (
        <div
            className="inline-flex items-center overflow-hidden rounded-xl border border-slate-200 bg-white"
            aria-label="Product quantity controls"
        >
            <button
                type="button"
                onClick={onDecrease}
                disabled={disabled}
                aria-label="Decrease quantity"
                className="flex h-9 w-9 items-center justify-center text-slate-600 transition hover:bg-slate-100 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
                <Minus className="h-4 w-4" />
            </button>

            <span className="min-w-10 border-x border-slate-200 px-2 text-center text-sm font-bold text-slate-800">
                {quantity}
            </span>

            <button
                type="button"
                onClick={onIncrease}
                disabled={disabled}
                aria-label="Increase quantity"
                className="flex h-9 w-9 items-center justify-center text-slate-600 transition hover:bg-slate-100 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
                <Plus className="h-4 w-4" />
            </button>
        </div>
    );
}
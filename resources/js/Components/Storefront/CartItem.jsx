import { Trash2 } from "lucide-react";
import QuantitySelector from "./QuantitySelector";

function formatCurrency(amount) {
    return new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(Number(amount || 0));
}

export default function CartItem({
    item,
    onIncrease,
    onDecrease,
    onRemove,
}) {
    const unitPrice = Number(item.sale_price ?? item.price ?? 0);
    const lineTotal = unitPrice * Number(item.quantity ?? 1);

    const image =
        item.image ??
        item.thumbnail ??
        item.featured_image ??
        "/images/product-placeholder.png";

    return (
        <article className="flex gap-4 border-b border-slate-100 py-5 last:border-b-0">
            <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                <img
                    src={image}
                    alt={item.name ?? "Cart product"}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    onError={(event) => {
                        event.currentTarget.src =
                            "/images/product-placeholder.png";
                    }}
                />
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h3 className="line-clamp-2 text-sm font-bold leading-5 text-slate-800">
                            {item.name}
                        </h3>

                        {item.brand?.name && (
                            <p className="mt-1 text-xs text-slate-500">
                                {item.brand.name}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => onRemove(item.id)}
                        aria-label={`Remove ${item.name} from cart`}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>

                <p className="mt-2 text-sm font-bold text-indigo-700">
                    {formatCurrency(unitPrice)}
                </p>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <QuantitySelector
                        quantity={item.quantity}
                        onIncrease={() => onIncrease(item.id)}
                        onDecrease={() => onDecrease(item.id)}
                    />

                    <p className="text-sm font-extrabold text-slate-900">
                        {formatCurrency(lineTotal)}
                    </p>
                </div>
            </div>
        </article>
    );
}
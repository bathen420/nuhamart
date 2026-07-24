export default function CartSummaryItem({ item }) {
    const unitPrice = Number(
        item.sale_price && Number(item.sale_price) > 0
            ? item.sale_price
            : item.price,
    ) || 0;

    const quantity = Number(item.quantity) || 1;
    const lineTotal = unitPrice * quantity;

    return (
        <div className="flex gap-4 border-b border-slate-200 py-4 last:border-b-0">
            <img
                src={
                    item.image ||
                    "https://placehold.co/160x160?text=Product"
                }
                alt={item.name || "Product"}
                onError={(event) => {
                    event.currentTarget.src =
                        "https://placehold.co/160x160?text=Product";
                }}
                className="h-20 w-20 shrink-0 rounded-xl object-cover"
            />

            <div className="min-w-0 flex-1">
                <h3 className="line-clamp-2 font-bold text-slate-900">
                    {item.name}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                    Quantity: {quantity}
                </p>

                <p className="mt-2 font-bold text-indigo-600">
                    BDT {lineTotal.toLocaleString()}
                </p>
            </div>
        </div>
    );
}
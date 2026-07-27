const money = (value) =>
    new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: 'BDT',
        maximumFractionDigits: 2,
    }).format(Number(value || 0));

export default function CartItem({ item, onIncrease, onDecrease, onRemove }) {
    return (
        <div className="rounded-xl border border-gray-200 p-3">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{money(item.price)} each</p>
                </div>

                <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    className="rounded-md px-2 py-1 text-sm text-red-600 hover:bg-red-50"
                >
                    Remove
                </button>
            </div>

            <div className="mt-3 flex items-center justify-between">
                <div className="inline-flex items-center rounded-lg border border-gray-300">
                    <button
                        type="button"
                        onClick={() => onDecrease(item.id)}
                        className="px-3 py-1.5 text-lg hover:bg-gray-100"
                    >
                        −
                    </button>
                    <span className="min-w-10 px-2 text-center font-semibold">{item.quantity}</span>
                    <button
                        type="button"
                        onClick={() => onIncrease(item.id)}
                        disabled={item.quantity >= item.stock}
                        className="px-3 py-1.5 text-lg hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        +
                    </button>
                </div>

                <p className="font-bold text-gray-900">
                    {money(item.price * item.quantity)}
                </p>
            </div>
        </div>
    );
}

import CartItem from './CartItem';

export default function Cart({ items, onIncrease, onDecrease, onRemove, onClear }) {
    return (
        <section>
            <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">
                    Cart ({items.reduce((sum, item) => sum + item.quantity, 0)})
                </h2>

                {items.length > 0 && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="text-sm font-medium text-red-600 hover:text-red-700"
                    >
                        Clear cart
                    </button>
                )}
            </div>

            <div className="max-h-[36vh] space-y-3 overflow-y-auto pr-1">
                {items.length ? (
                    items.map((item) => (
                        <CartItem
                            key={item.id}
                            item={item}
                            onIncrease={onIncrease}
                            onDecrease={onDecrease}
                            onRemove={onRemove}
                        />
                    ))
                ) : (
                    <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
                        Select a product to begin the sale.
                    </div>
                )}
            </div>
        </section>
    );
}

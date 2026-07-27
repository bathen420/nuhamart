const money = (value) =>
    new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: 'BDT',
        maximumFractionDigits: 2,
    }).format(Number(value || 0));

export default function ProductCard({ product, onAdd }) {
    const unavailable = Number(product.stock) <= 0;

    return (
        <button
            type="button"
            disabled={unavailable}
            onClick={() => onAdd(product)}
            className="group rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
        >
            <div className="mb-3 flex h-28 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                {product.image ? (
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                    <span className="text-4xl font-bold text-gray-300">
                        {product.name?.charAt(0)?.toUpperCase() || 'P'}
                    </span>
                )}
            </div>

            <h3 className="line-clamp-2 min-h-12 font-semibold text-gray-900">
                {product.name}
            </h3>

            <div className="mt-2 flex items-end justify-between gap-2">
                <div>
                    <p className="font-bold text-indigo-600">{money(product.price)}</p>
                    <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                </div>
                <span className="rounded-lg bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white">
                    Add
                </span>
            </div>
        </button>
    );
}

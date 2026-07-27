import ProductCard from './ProductCard';

export default function ProductGrid({ products, onAdd }) {
    if (!products.length) {
        return (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500">
                No matching products found.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} onAdd={onAdd} />
            ))}
        </div>
    );
}

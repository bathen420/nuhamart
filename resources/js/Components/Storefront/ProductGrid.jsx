import ProductCard from "@/Components/Storefront/ProductCard";

export default function ProductGrid({ products = [], showProgress = false, onQuickView }) {
    return products.length ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => <ProductCard key={product.id} product={product} showProgress={showProgress} onQuickView={onQuickView}/>) }
        </div>
    ) : (
        <div className="rounded-2xl border border-dashed bg-white p-12 text-center text-slate-500">No products found.</div>
    );
}

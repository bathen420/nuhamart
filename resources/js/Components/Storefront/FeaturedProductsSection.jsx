import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { featuredProducts } from "@/data/featuredProducts";


export default function FeaturedProductsSection() {
    const handleAddToCart = (product) => {
        console.log("Featured Product:", product);
    };

    return (
        <section className="px-4 py-14 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-wider text-indigo-600">
                            Featured Collection
                        </p>

                        <h2 className="mt-2 text-3xl font-black text-slate-900">
                            Featured Products
                        </h2>
                    </div>

                    <a
                        href="#"
                        className="flex items-center gap-2 font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                        View All
                        <ArrowRight size={18} />
                    </a>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {featuredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            showProgress={false}
                            showWishlist
                            showQuickView
                            showBrand
                            showCategory
                            showRating
                            showDiscount
                            showBadges
                            onAddToCart={handleAddToCart}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
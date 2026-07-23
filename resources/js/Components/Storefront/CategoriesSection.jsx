import { ArrowRight } from "lucide-react";

const categories = [
    {
        id: 1,
        name: "Electronics",
        productCount: 125,
        href: "#electronics",
        image:
            "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 2,
        name: "Fashion",
        productCount: 240,
        href: "#fashion",
        image:
            "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 3,
        name: "Home & Living",
        productCount: 98,
        href: "#home-living",
        image:
            "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 4,
        name: "Beauty",
        productCount: 86,
        href: "#beauty",
        image:
            "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 5,
        name: "Books",
        productCount: 310,
        href: "#books",
        image:
            "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 6,
        name: "Sports",
        productCount: 72,
        href: "#sports",
        image:
            "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80",
    },
];

export default function CategoriesSection() {
    return (
        <section
            id="categories"
            className="px-4 py-14 sm:px-6 lg:px-8"
        >
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-wider text-indigo-600">
                            Shop by category
                        </p>

                        <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
                            Explore Popular Categories
                        </h2>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                            আপনার প্রয়োজনীয় পণ্য দ্রুত খুঁজে পেতে পছন্দের
                            ক্যাটাগরি নির্বাচন করুন।
                        </p>
                    </div>

                    <a
                        href="#all-categories"
                        className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 transition hover:text-indigo-800"
                    >
                        View All Categories
                        <ArrowRight className="h-4 w-4" />
                    </a>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                    {categories.map((category) => (
                        <a
                            key={category.id}
                            href={category.href}
                            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl"
                        >
                            <div className="aspect-square overflow-hidden rounded-xl bg-slate-100">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    loading="lazy"
                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                                />
                            </div>

                            <div className="px-1 pb-1 pt-4 text-center">
                                <h3 className="text-sm font-bold text-slate-900 transition group-hover:text-indigo-600">
                                    {category.name}
                                </h3>

                                <p className="mt-1 text-xs text-slate-500">
                                    {category.productCount} Products
                                </p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
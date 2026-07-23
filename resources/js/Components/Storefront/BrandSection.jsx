import { ArrowRight } from "lucide-react";
import { brands } from "@/data/brands";


export default function BrandSection() {
    return (
        <section className="px-4 py-14 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">

                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-wider text-indigo-600">
                            Trusted Brands
                        </p>

                        <h2 className="mt-2 text-3xl font-black text-slate-900">
                            Shop by Brand
                        </h2>
                    </div>

                    <a
                        href="#"
                        className="flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-800"
                    >
                        View All
                        <ArrowRight size={18} />
                    </a>
                </div>

                <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                    {brands.map((brand) => (
                        <a
                            key={brand.id}
                            href="#"
                            className="group flex h-36 flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
                        >
                            <img
                                src={brand.logo}
                                alt={brand.name}
                                className="h-14 object-contain transition duration-300 group-hover:scale-110"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                }}
                            />

                            <span className="mt-4 text-lg font-bold text-slate-800">
                                {brand.name}
                            </span>
                        </a>
                    ))}
                </div>

            </div>
        </section>
    );
}
import { ArrowRight, PackageCheck, ShoppingBag, Sparkles } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                {/* Main hero banner */}
                <div className="relative min-h-[470px] overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-violet-600 to-purple-700 px-6 py-12 text-white sm:px-10 lg:px-14 lg:py-16">
                    {/* Decorative elements */}
                    <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" />
                    <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-rose-400/20 blur-3xl" />
                    <div className="absolute bottom-0 right-0 h-64 w-64 rounded-tl-[120px] bg-white/5" />

                    <ShoppingBag className="absolute bottom-8 right-8 hidden h-56 w-56 rotate-[-8deg] text-white/10 sm:block" />

                    <div className="relative z-10 flex h-full max-w-2xl flex-col justify-center">
                        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider backdrop-blur">
                            <Sparkles className="h-4 w-4" />
                            New season collection
                        </div>

                        <h1 className="mt-6 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                            প্রয়োজনের সবকিছু,
                            <span className="block text-amber-300">
                                এখন এক জায়গায়
                            </span>
                        </h1>

                        <p className="mt-5 max-w-xl text-base leading-7 text-indigo-100 sm:text-lg">
                            Electronics, fashion, books, beauty products এবং
                            দৈনন্দিন প্রয়োজনীয় পণ্য কিনুন সহজে, নিরাপদে ও
                            সাশ্রয়ী মূল্যে।
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <a
                                href="#flash-sale"
                                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-indigo-700 shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-indigo-50"
                            >
                                Shop Now
                                <ArrowRight className="h-4 w-4" />
                            </a>

                            <a
                                href="#categories"
                                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
                            >
                                Browse Categories
                            </a>
                        </div>

                        <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-indigo-100">
                            <div className="flex items-center gap-2">
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                                    <PackageCheck className="h-4 w-4" />
                                </span>

                                <span>
                                    <strong className="block text-white">
                                        100% Authentic
                                    </strong>
                                    Quality products
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                                    <ShoppingBag className="h-4 w-4" />
                                </span>

                                <span>
                                    <strong className="block text-white">
                                        Easy Shopping
                                    </strong>
                                    Simple checkout
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Side promotional cards */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                    <article className="group relative min-h-[220px] overflow-hidden rounded-3xl bg-amber-100 p-7">
                        <div className="relative z-10">
                            <p className="text-sm font-bold uppercase tracking-wider text-amber-700">
                                Weekend Deal
                            </p>

                            <h2 className="mt-3 max-w-[220px] text-3xl font-black leading-tight text-slate-900">
                                Up to 40% off
                            </h2>

                            <p className="mt-3 max-w-[230px] text-sm leading-6 text-slate-600">
                                Selected electronics, gadgets and accessories.
                            </p>

                            <a
                                href="#offers"
                                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-slate-900 transition group-hover:gap-3"
                            >
                                Explore Deals
                                <ArrowRight className="h-4 w-4" />
                            </a>
                        </div>

                        <PackageCheck className="absolute -bottom-6 -right-5 h-36 w-36 rotate-[-10deg] text-amber-700/10 transition duration-500 group-hover:scale-110" />
                    </article>

                    <article className="group relative min-h-[220px] overflow-hidden rounded-3xl bg-rose-100 p-7">
                        <div className="relative z-10">
                            <p className="text-sm font-bold uppercase tracking-wider text-rose-700">
                                Fashion Week
                            </p>

                            <h2 className="mt-3 max-w-[220px] text-3xl font-black leading-tight text-slate-900">
                                Fresh styles for you
                            </h2>

                            <p className="mt-3 max-w-[230px] text-sm leading-6 text-slate-600">
                                Discover the latest fashion and lifestyle
                                collection.
                            </p>

                            <a
                                href="#fashion"
                                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-slate-900 transition group-hover:gap-3"
                            >
                                Shop Fashion
                                <ArrowRight className="h-4 w-4" />
                            </a>
                        </div>

                        <ShoppingBag className="absolute -bottom-6 -right-5 h-36 w-36 rotate-12 text-rose-700/10 transition duration-500 group-hover:scale-110" />
                    </article>
                </div>
            </div>
        </section>
    );
}
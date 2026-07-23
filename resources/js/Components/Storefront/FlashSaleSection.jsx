import { useEffect, useState } from "react";
import { ArrowRight, Clock3 } from "lucide-react";

import ProductCard from "./ProductCard";
import { flashSaleProducts } from "@/data/flashSaleProducts";


function getCountdownTarget() {
    const target = new Date();

    target.setHours(23, 59, 59, 999);

    return target.getTime();
}

function calculateTimeLeft(targetTime) {
    const difference = Math.max(targetTime - Date.now(), 0);

    return {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
    };
}

function CountdownBox({ value, label }) {
    return (
        <div className="min-w-[66px] rounded-2xl bg-white px-3 py-3 text-center shadow-sm ring-1 ring-slate-200">
            <span className="block text-xl font-black text-slate-900">
                {String(value).padStart(2, "0")}
            </span>

            <span className="mt-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {label}
            </span>
        </div>
    );
}

export default function FlashSaleSection() {
    const [targetTime, setTargetTime] = useState(() => getCountdownTarget());

    const [timeLeft, setTimeLeft] = useState(() =>
        calculateTimeLeft(targetTime),
    );

    useEffect(() => {
        const interval = window.setInterval(() => {
            const remaining = calculateTimeLeft(targetTime);

            const saleEnded =
                remaining.hours === 0 &&
                remaining.minutes === 0 &&
                remaining.seconds === 0;

            if (saleEnded) {
                const newTargetTime = getCountdownTarget();

                setTargetTime(newTargetTime);
                setTimeLeft(calculateTimeLeft(newTargetTime));

                return;
            }

            setTimeLeft(remaining);
        }, 1000);

        return () => {
            window.clearInterval(interval);
        };
    }, [targetTime]);

    const handleAddToCart = (product) => {
        console.log("Flash sale product added to cart:", product);
    };

    const handleQuickView = (product) => {
        console.log("Flash sale quick view:", product);
    };

    return (
        <section
            id="flash-sale"
            className="px-4 py-14 sm:px-6 lg:px-8"
        >
            <div className="mx-auto max-w-7xl">
                <div className="overflow-hidden rounded-[32px] bg-gradient-to-br from-rose-50 via-white to-orange-50 p-5 ring-1 ring-rose-100 sm:p-8">
                    <div className="mb-8 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-rose-600">
                                <Clock3 className="h-5 w-5" />

                                <p className="text-sm font-black uppercase tracking-wider">
                                    Limited time offer
                                </p>
                            </div>

                            <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
                                Flash Sale
                            </h2>

                            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                                সীমিত সময়ের জন্য নির্বাচিত পণ্যে বিশেষ ছাড়।
                                স্টক শেষ হওয়ার আগেই পছন্দের পণ্যটি অর্ডার করুন।
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-2">
                                <CountdownBox
                                    value={timeLeft.hours}
                                    label="Hours"
                                />

                                <span className="text-xl font-black text-rose-500">
                                    :
                                </span>

                                <CountdownBox
                                    value={timeLeft.minutes}
                                    label="Minutes"
                                />

                                <span className="text-xl font-black text-rose-500">
                                    :
                                </span>

                                <CountdownBox
                                    value={timeLeft.seconds}
                                    label="Seconds"
                                />
                            </div>

                            <a
                                href="#all-flash-sale-products"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-600"
                            >
                                View All
                                <ArrowRight className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {flashSaleProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                showWishlist
                                showQuickView
                                showDiscount
                                showRating
                                showBrand
                                showCategory
                                showProgress
                                showStock={false}
                                showBadges={false}
                                onAddToCart={handleAddToCart}
                                onQuickView={handleQuickView}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
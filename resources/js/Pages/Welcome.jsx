import { Head } from "@inertiajs/react";

import CategoriesSection from "@/Components/Storefront/CategoriesSection";
import FeaturesSection from "@/Components/Storefront/FeaturesSection";
import FlashSaleSection from "@/Components/Storefront/FlashSaleSection";
import Header from "@/Components/Storefront/Header";
import HeroSection from "@/Components/Storefront/HeroSection";
import FeaturedProductsSection from "@/Components/Storefront/FeaturedProductsSection";
import BrandSection from "@/Components/Storefront/BrandSection";

export default function Welcome({
    auth = {},
    canLogin = true,
    canRegister = true,
}) {
    return (
        <>
            <Head title="NuhaMart - Online Shopping in Bangladesh">
                <meta
                    name="description"
                    content="Shop electronics, fashion, books, beauty products and daily essentials from NuhaMart."
                />
            </Head>

            <div className="min-h-screen bg-slate-50 text-slate-900">
                <Header
                    auth={auth}
                    canLogin={canLogin}
                    canRegister={canRegister}
                    cartCount={0}
                    wishlistCount={0}
                />

                <main>
                    <HeroSection />

                    <FeaturesSection />

                    <CategoriesSection />

                    <FlashSaleSection />

                    <FeaturedProductsSection />

                    <BrandSection />
                </main>
            </div>
        </>
    );
}
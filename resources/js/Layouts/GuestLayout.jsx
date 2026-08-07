import { Link, usePage } from "@inertiajs/react";
import { BookOpen, ShieldCheck, ShoppingBag, Truck } from "lucide-react";

export default function GuestLayout({ children }) {
    const businessSettings = usePage().props.businessSettings || {};
    const companyName = businessSettings.company_name || "Nuha Mart BD";
    const tagline =
        businessSettings.company_tagline ||
        "Everything You Need, All in One Place";

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 sm:py-12">
            <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl lg:grid-cols-[1.05fr_.95fr]">
                <section className="relative hidden overflow-hidden bg-gradient-to-br from-[#0f766e] to-[#092b2a] p-10 text-white lg:flex lg:flex-col lg:justify-between">
                    <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#f59e0b]/20 blur-2xl" />
                    <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />

                    <Link href={route("home")} className="relative flex items-center gap-3">
                        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-[#0f766e] shadow-lg">
                            <BookOpen size={30} />
                        </span>
                        <div>
                            <h1 className="text-2xl font-black">
                                {companyName}
                            </h1>
                            <p className="mt-1 text-xs font-semibold text-teal-100">
                                {tagline}
                            </p>
                        </div>
                    </Link>

                    <div className="relative py-12">
                        <p className="text-sm font-black uppercase tracking-[.25em] text-amber-300">
                            Customer Account
                        </p>
                        <h2 className="mt-4 max-w-md text-4xl font-black leading-tight">
                            Shop smarter and manage every order in one place.
                        </h2>
                        <p className="mt-5 max-w-md text-sm leading-7 text-teal-50/85">
                            Sign in to view orders, save delivery addresses and enjoy a faster checkout experience.
                        </p>
                    </div>

                    <div className="relative grid grid-cols-3 gap-3 text-center text-xs font-bold">
                        <div className="rounded-2xl bg-white/10 p-3 backdrop-blur">
                            <Truck className="mx-auto mb-2 text-amber-300" size={22} />
                            Fast Delivery
                        </div>
                        <div className="rounded-2xl bg-white/10 p-3 backdrop-blur">
                            <ShieldCheck className="mx-auto mb-2 text-amber-300" size={22} />
                            Secure Login
                        </div>
                        <div className="rounded-2xl bg-white/10 p-3 backdrop-blur">
                            <ShoppingBag className="mx-auto mb-2 text-amber-300" size={22} />
                            Easy Orders
                        </div>
                    </div>
                </section>

                <section className="flex min-h-[620px] items-center p-6 sm:p-10">
                    <div className="w-full">
                        <Link href={route("home")} className="mb-8 flex items-center gap-3 lg:hidden">
                            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0f766e] text-white">
                                <BookOpen size={25} />
                            </span>
                            <div>
                                <h1 className="text-xl font-black text-slate-900">
                                    {companyName}
                                </h1>
                                <p className="text-xs font-semibold text-[#0f766e]">{tagline}</p>
                            </div>
                        </Link>

                        {children}
                    </div>
                </section>
            </div>
        </div>
    );
}

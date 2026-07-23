import {
    Headphones,
    PackageCheck,
    ShieldCheck,
    Truck,
} from "lucide-react";

const features = [
    {
        id: 1,
        title: "Fast Delivery",
        description: "বাংলাদেশের সব জেলায় দ্রুত ডেলিভারি",
        icon: Truck,
    },
    {
        id: 2,
        title: "Secure Payment",
        description: "নিরাপদ ও বিশ্বস্ত পেমেন্ট ব্যবস্থা",
        icon: ShieldCheck,
    },
    {
        id: 3,
        title: "Easy Return",
        description: "সহজ এবং ঝামেলামুক্ত রিটার্ন সুবিধা",
        icon: PackageCheck,
    },
    {
        id: 4,
        title: "Customer Support",
        description: "প্রয়োজনে দ্রুত কাস্টমার সাপোর্ট",
        icon: Headphones,
    },
];

export default function FeaturesSection() {
    return (
        <section className="px-4 pb-8 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
                {features.map((feature) => {
                    const Icon = feature.icon;

                    return (
                        <article
                            key={feature.id}
                            className="group flex items-center gap-4 rounded-2xl p-3 transition hover:bg-slate-50"
                        >
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition duration-300 group-hover:bg-indigo-600 group-hover:text-white">
                                <Icon className="h-6 w-6" />
                            </div>

                            <div>
                                <h3 className="font-bold text-slate-900">
                                    {feature.title}
                                </h3>

                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    {feature.description}
                                </p>
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
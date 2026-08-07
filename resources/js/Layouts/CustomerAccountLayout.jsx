import { Link, usePage } from "@inertiajs/react";
import { Heart, Home, MapPin, Package, UserRound } from "lucide-react";
import StorefrontLayout from "@/Layouts/StorefrontLayout";

const links = [
    ["customer.dashboard", "Overview", Home],
    ["customer.orders.index", "My Orders", Package],
    ["customer.wishlist.index", "Wishlist", Heart],
    ["customer.addresses.index", "Addresses", MapPin],
    ["customer.profile.edit", "Profile", UserRound],
];

export default function CustomerAccountLayout({ children, title }) {
    const { url } = usePage();

    return (
        <StorefrontLayout>
            <main className="bg-slate-50 py-8">
                <div className="mx-auto grid max-w-7xl gap-6 px-4 lg:grid-cols-[250px_1fr]">
                    <aside className="h-fit rounded-2xl bg-white p-3 shadow-sm">
                        <div className="px-3 py-4">
                            <p className="text-xs font-black uppercase tracking-[.2em] text-teal-700">
                                Customer account
                            </p>
                            <h1 className="mt-1 text-xl font-black">{title}</h1>
                        </div>

                        {links.map(([name, label, Icon]) => {
                            const href = route(name);
                            const pathname = new URL(href, window.location.origin).pathname;
                            const active = url === pathname || url.startsWith(`${pathname}/`);

                            return (
                                <Link
                                    key={name}
                                    href={href}
                                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold ${
                                        active
                                            ? "bg-teal-50 text-teal-700"
                                            : "text-slate-600 hover:bg-slate-50"
                                    }`}
                                >
                                    <Icon size={18} />
                                    {label}
                                </Link>
                            );
                        })}
                    </aside>

                    <section>{children}</section>
                </div>
            </main>
        </StorefrontLayout>
    );
}

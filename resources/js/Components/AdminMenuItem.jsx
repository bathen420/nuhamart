import { Link } from "@inertiajs/react";

export default function AdminMenuItem({
    href,
    active = false,
    icon: Icon,
    children,
}) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                active
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
            }`}
        >
            {Icon && <Icon size={20} />}
            <span>{children}</span>
        </Link>
    );
}
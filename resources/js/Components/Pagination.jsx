import { Link } from "@inertiajs/react";

export default function Pagination({ links }) {
    if (links.length <= 3) return null;

    return (
        <div className="border-t bg-white px-6 py-4">
            <div className="flex flex-wrap gap-2">
                {links.map((link, index) => (
                    <Link
                        key={index}
                        href={link.url || "#"}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                        className={`rounded border px-3 py-2 text-sm ${
                            link.active
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                        } ${!link.url ? "pointer-events-none opacity-50" : ""}`}
                    />
                ))}
            </div>
        </div>
    );
}
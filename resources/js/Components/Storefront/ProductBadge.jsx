export default function ProductBadge({
    children,
    color = "red",
}) {
    const colors = {
        red: "bg-red-600 text-white",
        green: "bg-green-600 text-white",
        blue: "bg-blue-600 text-white",
        yellow: "bg-yellow-500 text-black",
        gray: "bg-gray-800 text-white",
    };

    return (
        <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold shadow ${colors[color]}`}
        >
            {children}
        </span>
    );
}
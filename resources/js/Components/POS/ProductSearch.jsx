export default function ProductSearch({ value, onChange }) {
    return (
        <div className="relative">
            <input
                type="search"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder="Search by product, SKU or barcode..."
                className="w-full rounded-xl border-gray-300 py-3 pl-11 pr-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <svg
                className="absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />
            </svg>
        </div>
    );
}

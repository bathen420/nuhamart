const money = (value) =>
    new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: 'BDT',
        maximumFractionDigits: 2,
    }).format(Number(value || 0));

export default function SummaryCard({ subtotal, discount, tax, shipping, total, paid, due }) {
    const rows = [
        ['Subtotal', subtotal],
        ['Discount', -discount],
        ['Tax', tax],
        ['Shipping', shipping],
    ];

    return (
        <div className="space-y-2 rounded-xl bg-gray-50 p-4">
            {rows.map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm text-gray-600">
                    <span>{label}</span>
                    <span>{money(value)}</span>
                </div>
            ))}

            <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>{money(total)}</span>
                </div>
                <div className="mt-1 flex justify-between text-sm text-emerald-700">
                    <span>Paid</span>
                    <span>{money(paid)}</span>
                </div>
                <div className="mt-1 flex justify-between font-semibold text-red-600">
                    <span>Due</span>
                    <span>{money(due)}</span>
                </div>
            </div>
        </div>
    );
}

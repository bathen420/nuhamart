export default function CustomerSelect({ customers, value, onChange }) {
    return (
        <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
                Customer
            </label>
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
                <option value="">Walk-in customer</option>
                {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                        {customer.name}{customer.phone ? ` — ${customer.phone}` : ''}
                    </option>
                ))}
            </select>
        </div>
    );
}

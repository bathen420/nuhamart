import CustomerSelect from './CustomerSelect';
import SummaryCard from './SummaryCard';

const NumberField = ({ label, value, onChange, min = 0, max }) => (
    <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
        <input
            type="number"
            min={min}
            max={max}
            step="0.01"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
    </div>
);

export default function PaymentPanel({
    customers,
    form,
    setFormValue,
    totals,
    processing,
    hasItems,
    onSubmit,
}) {
    return (
        <form onSubmit={onSubmit} className="mt-5 space-y-4">
            <CustomerSelect
                customers={customers}
                value={form.customer_id}
                onChange={(value) => setFormValue('customer_id', value)}
            />

            <div className="grid grid-cols-2 gap-3">
                <NumberField
                    label="Discount"
                    value={form.discount}
                    onChange={(value) => setFormValue('discount', value)}
                />
                <NumberField
                    label="Tax"
                    value={form.tax}
                    onChange={(value) => setFormValue('tax', value)}
                />
                <NumberField
                    label="Shipping"
                    value={form.shipping}
                    onChange={(value) => setFormValue('shipping', value)}
                />
                <NumberField
                    label="Paid amount"
                    value={form.paid_amount}
                    max={totals.total}
                    onChange={(value) => setFormValue('paid_amount', value)}
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Payment method
                </label>
                <select
                    value={form.payment_method}
                    onChange={(event) => setFormValue('payment_method', event.target.value)}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="bank">Bank transfer</option>
                    <option value="mobile_banking">Mobile banking</option>
                </select>
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Note</label>
                <textarea
                    rows="2"
                    value={form.note}
                    onChange={(event) => setFormValue('note', event.target.value)}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Optional sale note"
                />
            </div>

            <SummaryCard {...totals} />

            <button
                type="submit"
                disabled={!hasItems || processing}
                className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {processing ? 'Completing sale...' : 'Complete Sale'}
            </button>
        </form>
    );
}

import InputError from "@/Components/InputError";

export default function PaymentMethod({
    data,
    setData,
    errors = {},
}) {
    const methods = [
        {
            value: "cod",
            label: "Cash On Delivery",
        },
        {
            value: "sslcommerz",
            label: "SSLCommerz",
        },
        {
            value: "bkash",
            label: "bKash",
        },
        {
            value: "nagad",
            label: "Nagad",
        },
    ];

    return (
        <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">
                Payment Method
            </h2>

            <div className="space-y-4">
                {methods.map((method) => (
                    <label
                        key={method.value}
                        className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50"
                    >
                        <input
                            type="radio"
                            name="payment_method"
                            value={method.value}
                            checked={
                                data.payment_method === method.value
                            }
                            onChange={(event) =>
                                setData(
                                    "payment_method",
                                    event.target.value,
                                )
                            }
                        />

                        <span className="font-medium text-slate-800">
                            {method.label}
                        </span>
                    </label>
                ))}
            </div>

            <InputError
                message={errors.payment_method}
                className="mt-2"
            />
        </div>
    );
}
export default function PaymentMethod({
    data,
    setData,
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
        <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm">

            <h2 className="mb-6 text-2xl font-bold">
                Payment Method
            </h2>

            <div className="space-y-4">

                {methods.map((method) => (

                    <label
                        key={method.value}
                        className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 hover:bg-gray-50"
                    >

                        <input
                            type="radio"
                            name="payment_method"
                            value={method.value}
                            checked={
                                data.payment_method === method.value
                            }
                            onChange={(e) =>
                                setData(
                                    "payment_method",
                                    e.target.value,
                                )
                            }
                        />

                        <span>
                            {method.label}
                        </span>

                    </label>

                ))}

            </div>

        </div>
    );
}
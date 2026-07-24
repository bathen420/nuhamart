import { Head } from "@inertiajs/react";

import CheckoutLayout from "@/Components/Checkout/CheckoutLayout";
import OrderSummary from "@/Components/Checkout/OrderSummary";

export default function CheckoutIndex() {
    return (
        <>
            <Head title="Checkout" />

            <CheckoutLayout
                left={
                    <div className="rounded-2xl bg-white p-8 shadow-sm">
                        <h1 className="text-3xl font-black text-slate-900">
                            Checkout
                        </h1>

                        <p className="mt-3 text-slate-500">
                            Customer and delivery information form will be added here.
                        </p>
                    </div>
                }
                right={<OrderSummary />}
            />
        </>
    );
}
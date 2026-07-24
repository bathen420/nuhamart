import { Head, useForm } from "@inertiajs/react";

import CheckoutLayout from "@/Components/Checkout/CheckoutLayout";
import CustomerForm from "@/Components/Checkout/CustomerForm";
import PaymentMethod from "@/Components/Checkout/PaymentMethod";
import OrderSummary from "@/Components/Checkout/OrderSummary";

export default function CheckoutIndex() {
    const {
        data,
        setData,
        post,
        processing,
        errors,
    } = useForm({
        name: "",
        phone: "",
        email: "",
        division: "",
        district: "",
        area: "",
        address: "",
        note: "",
        payment_method: "cod",
    });

    const submit = (event) => {
        event.preventDefault();

        post(route("checkout.store"), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Checkout" />

            <CheckoutLayout
                left={
                    <form
                        id="checkout-form"
                        onSubmit={submit}
                        className="space-y-6"
                    >
                        <CustomerForm
                            data={data}
                            setData={setData}
                            errors={errors}
                        />

                        <PaymentMethod
                            data={data}
                            setData={setData}
                            errors={errors}
                        />
                    </form>
                }
                right={
                    <OrderSummary
                        processing={processing}
                        formId="checkout-form"
                    />
                }
            />
        </>
    );
}
import { Head, useForm } from "@inertiajs/react";
import { useState, useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Create({ auth, products }) {

    const [items, setItems] = useState([
        {
            product_id: "",
            quantity: 1,
            price: 0,
            subtotal: 0,
        },
    ]);

    const { data, setData, post, processing, errors } = useForm({

        order_number: "",

        customer_name: "",

        customer_phone: "",

        customer_email: "",

        customer_address: "",

        payment_method: "Cash On Delivery",

        payment_status: "Pending",

        order_status: "Pending",

        discount: 0,

        shipping: 0,

        note: "",

    });

    const addItem = () => {

        setItems([
            ...items,
            {
                product_id: "",
                quantity: 1,
                price: 0,
                subtotal: 0,
            },
        ]);

    };

    const removeItem = (index) => {

        if (items.length === 1) return;

        setItems(items.filter((_, i) => i !== index));

    };

    const updateProduct = (index, productId) => {

        const product = products.find(
            p => p.id == productId
        );

        const updated = [...items];

        updated[index].product_id = productId;
        updated[index].price = product ? Number(product.price) : 0;
        updated[index].subtotal =
            updated[index].price *
            updated[index].quantity;

        setItems(updated);

    };

    const updateQuantity = (index, qty) => {

        const updated = [...items];

        updated[index].quantity = Number(qty);

        updated[index].subtotal =
            updated[index].price *
            updated[index].quantity;

        setItems(updated);

    };

    const subtotal = useMemo(() => {

        return items.reduce((sum, item) => {

            return sum + Number(item.subtotal);

        }, 0);

    }, [items]);

    const grandTotal = useMemo(() => {

        return subtotal
            - Number(data.discount)
            + Number(data.shipping);

    }, [subtotal, data.discount, data.shipping]);

    const submit = (e) => {

        e.preventDefault();

       post(route("orders.store"), {
        data: {
            ...data,
            subtotal,
            total: grandTotal,
            items,
        },
    });

    };

    
    return (

        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold text-gray-800">
                    Create Order
                </h2>
            }
        >

            <Head title="Create Order" />

            <div className="mx-auto max-w-7xl">

                <form
                    onSubmit={submit}
                    className="space-y-8"
                >

                    {/* Customer Information */}

                    <div className="rounded-xl bg-white p-6 shadow">

                        <h3 className="mb-6 text-lg font-semibold">
                            Customer Information
                        </h3>

                        <div className="grid grid-cols-2 gap-6">

                            <div>

                                <label className="mb-2 block">
                                    Order Number
                                </label>

                                <input
                                    type="text"
                                    value={data.order_number}
                                    onChange={(e) =>
                                        setData(
                                            "order_number",
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border px-4 py-2"
                                />

                            </div>

                            <div>

                                <label className="mb-2 block">
                                    Customer Name
                                </label>

                                <input
                                    type="text"
                                    value={data.customer_name}
                                    onChange={(e) =>
                                        setData(
                                            "customer_name",
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border px-4 py-2"
                                />

                            </div>

                            <div>

                                <label className="mb-2 block">
                                    Phone
                                </label>

                                <input
                                    type="text"
                                    value={data.customer_phone}
                                    onChange={(e) =>
                                        setData(
                                            "customer_phone",
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border px-4 py-2"
                                />

                            </div>

                            <div>

                                <label className="mb-2 block">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    value={data.customer_email}
                                    onChange={(e) =>
                                        setData(
                                            "customer_email",
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border px-4 py-2"
                                />

                            </div>

                        </div>

                        <div className="mt-6">

                            <label className="mb-2 block">
                                Address
                            </label>

                            <textarea
                                rows="3"
                                value={data.customer_address}
                                onChange={(e) =>
                                    setData(
                                        "customer_address",
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-lg border px-4 py-2"
                            />

                        </div>

                    </div>

                    {/* Products */}

                    <div className="rounded-xl bg-white p-6 shadow">

                        <div className="mb-5 flex items-center justify-between">

                            <h3 className="text-lg font-semibold">
                                Products
                            </h3>

                            <button
                                type="button"
                                onClick={addItem}
                                className="rounded-lg bg-blue-600 px-5 py-2 text-white"
                            >
                                + Add Product
                            </button>

                        </div>

                        <div className="overflow-x-auto">

                            <table className="min-w-full border">

                                <thead className="bg-gray-100">

                                    <tr>

                                        <th className="border px-4 py-3">
                                            Product
                                        </th>

                                        <th className="border px-4 py-3">
                                            Qty
                                        </th>

                                        <th className="border px-4 py-3">
                                            Price
                                        </th>

                                        <th className="border px-4 py-3">
                                            Subtotal
                                        </th>

                                        <th className="border px-4 py-3">
                                            Action
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {items.map((item, index) => (

                                        <tr key={index}>

                                            <td className="border p-3">

                                                <select
                                                    value={item.product_id}
                                                    onChange={(e) =>
                                                        updateProduct(
                                                            index,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full rounded border px-3 py-2"
                                                >

                                                    <option value="">
                                                        Select Product
                                                    </option>

                                                    {products.map(
                                                        (product) => (

                                                            <option
                                                                key={product.id}
                                                                value={product.id}
                                                            >
                                                                {product.name}
                                                            </option>

                                                        )
                                                    )}

                                                </select>

                                            </td>

                                            <td className="border p-3">

                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) =>
                                                        updateQuantity(
                                                            index,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-24 rounded border px-3 py-2"
                                                />

                                            </td>

                                            <td className="border p-3">

                                                ৳ {item.price}

                                            </td>

                                            <td className="border p-3 font-semibold">

                                                ৳ {item.subtotal}

                                            </td>

                                            <td className="border p-3">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeItem(index)
                                                    }
                                                    className="rounded bg-red-600 px-3 py-2 text-white"
                                                >
                                                    Remove
                                                </button>

                                            </td>

                                        </tr>

                                    ))}

                                                                    </tbody>

                            </table>

                        </div>

                    </div>

                    {/* Order Summary */}

                    <div className="rounded-xl bg-white p-6 shadow">

                        <h3 className="mb-6 text-lg font-semibold">
                            Order Summary
                        </h3>

                        <div className="grid grid-cols-2 gap-6">

                            <div>

                                <label className="mb-2 block">
                                    Discount
                                </label>

                                <input
                                    type="number"
                                    value={data.discount}
                                    onChange={(e) =>
                                        setData("discount", e.target.value)
                                    }
                                    className="w-full rounded-lg border px-4 py-2"
                                />

                            </div>

                            <div>

                                <label className="mb-2 block">
                                    Shipping
                                </label>

                                <input
                                    type="number"
                                    value={data.shipping}
                                    onChange={(e) =>
                                        setData("shipping", e.target.value)
                                    }
                                    className="w-full rounded-lg border px-4 py-2"
                                />

                            </div>

                            <div>

                                <label className="mb-2 block">
                                    Payment Method
                                </label>

                                <select
                                    value={data.payment_method}
                                    onChange={(e) =>
                                        setData("payment_method", e.target.value)
                                    }
                                    className="w-full rounded-lg border px-4 py-2"
                                >
                                    <option>Cash On Delivery</option>
                                    <option>BKash</option>
                                    <option>Nagad</option>
                                    <option>Rocket</option>
                                    <option>Bank Transfer</option>
                                </select>

                            </div>

                            <div>

                                <label className="mb-2 block">
                                    Payment Status
                                </label>

                                <select
                                    value={data.payment_status}
                                    onChange={(e) =>
                                        setData("payment_status", e.target.value)
                                    }
                                    className="w-full rounded-lg border px-4 py-2"
                                >
                                    <option>Pending</option>
                                    <option>Paid</option>
                                    <option>Failed</option>
                                </select>

                            </div>

                            <div>

                                <label className="mb-2 block">
                                    Order Status
                                </label>

                                <select
                                    value={data.order_status}
                                    onChange={(e) =>
                                        setData("order_status", e.target.value)
                                    }
                                    className="w-full rounded-lg border px-4 py-2"
                                >
                                    <option>Pending</option>
                                    <option>Processing</option>
                                    <option>Shipped</option>
                                    <option>Delivered</option>
                                    <option>Cancelled</option>
                                </select>

                            </div>

                        </div>

                        <div className="mt-6">

                            <label className="mb-2 block">
                                Note
                            </label>

                            <textarea
                                rows="4"
                                value={data.note}
                                onChange={(e) =>
                                    setData("note", e.target.value)
                                }
                                className="w-full rounded-lg border px-4 py-2"
                            />

                        </div>

                        <div className="mt-8 rounded-lg bg-gray-100 p-6">

                            <div className="mb-3 flex justify-between">

                                <span>Subtotal</span>

                                <span className="font-semibold">
                                    ৳ {subtotal}
                                </span>

                            </div>

                            <div className="mb-3 flex justify-between">

                                <span>Discount</span>

                                <span>
                                    ৳ {data.discount}
                                </span>

                            </div>

                            <div className="mb-3 flex justify-between">

                                <span>Shipping</span>

                                <span>
                                    ৳ {data.shipping}
                                </span>

                            </div>

                            <hr className="my-4" />

                            <div className="flex justify-between text-xl font-bold">

                                <span>Grand Total</span>

                                <span>
                                    ৳ {grandTotal}
                                </span>

                            </div>

                        </div>

                        <div className="mt-8">

                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-green-600 px-8 py-3 text-white hover:bg-green-700 disabled:opacity-50"
                            >
                                {processing
                                    ? "Saving..."
                                    : "Save Order"}
                            </button>

                        </div>

                    </div>

                </form>

            </div>

        </AuthenticatedLayout>

    );

}
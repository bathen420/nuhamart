import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Create({
    auth,
    suppliers,
    products,
}) {

    const { data, setData, post, processing, errors } = useForm({

        purchase_number:
            "PUR-" + Date.now(),

        supplier_id: "",

        subtotal: 0,

        discount: 0,

        shipping: 0,

        total: 0,

        note: "",

        items: [
            {
                product_id: "",
                quantity: 1,
                price: 0,
                subtotal: 0,
            },
        ],

    });

    const addRow = () => {

        setData("items", [
            ...data.items,
            {
                product_id: "",
                quantity: 1,
                price: 0,
                subtotal: 0,
            },
        ]);

    };

    // ==========================
    // Update Product Row
    // ==========================
    const updateItem = (index, field, value) => {

        const items = [...data.items];

        items[index][field] = value;

        if (field === "product_id") {

            const product = products.find(
                p => p.id == value
            );

            if (product) {
                items[index].price = Number(product.price);
            }
        }

        items[index].subtotal =
            Number(items[index].price) *
            Number(items[index].quantity);

        calculateTotal(items);

    };

    // ==========================
    // Calculate Total
    // ==========================
    const calculateTotal = (items) => {

        const subtotal = items.reduce(
            (sum, item) => sum + Number(item.subtotal),
            0
        );

        const total =
            subtotal -
            Number(data.discount) +
            Number(data.shipping);

        setData({
            ...data,
            items,
            subtotal,
            total,
        });

    };

    // ==========================
    // Remove Product Row
    // ==========================
    const removeRow = (index) => {

        const items = [...data.items];

        items.splice(index, 1);

        calculateTotal(items);

    };

    // ==========================
    // Submit Purchase
    // ==========================
    const submit = (e) => {

        e.preventDefault();

        post(route("purchases.store"));

    };

    return (

        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold">
                    New Purchase
                </h2>
            }
        >

            <Head title="New Purchase" />

            <div className="mx-auto max-w-7xl">

                <div className="rounded-xl bg-white p-6 shadow">

                    <h1 className="mb-6 text-3xl font-bold">
                        Create Purchase
                    </h1>

                    {/* Purchase Number */}

                    <div className="mb-5">

                        <label className="mb-2 block font-semibold">
                            Purchase Number
                        </label>

                        <input
                            type="text"
                            value={data.purchase_number}
                            readOnly
                            className="w-full rounded border bg-gray-100 p-3"
                        />

                    </div>

                    {/* Supplier */}

                    <div className="mb-5">

                        <label className="mb-2 block font-semibold">
                            Supplier
                        </label>

                        <select
                            value={data.supplier_id}
                            onChange={(e) =>
                                setData(
                                    "supplier_id",
                                    e.target.value
                                )
                            }
                            className="w-full rounded border p-3"
                        >

                            <option value="">
                                Select Supplier
                            </option>

                            {suppliers.map((supplier) => (

                                <option
                                    key={supplier.id}
                                    value={supplier.id}
                                >
                                    {supplier.name}
                                </option>

                            ))}

                        </select>

                    </div>

                   {/* Products */}

                    <div className="mt-8">

                        <div className="mb-4 flex items-center justify-between">

                            <h2 className="text-xl font-bold">
                                Products
                            </h2>

                            <button
                                type="button"
                                onClick={addRow}
                                className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                            >
                                + Add Product
                            </button>

                        </div>

                        <div className="overflow-x-auto">

                            <table className="min-w-full border">

                                <thead className="bg-gray-100">

                                    <tr>

                                        <th className="border p-3">
                                            Product
                                        </th>

                                        <th className="border p-3 w-32">
                                            Qty
                                        </th>

                                        <th className="border p-3 w-40">
                                            Buy Price
                                        </th>

                                        <th className="border p-3 w-44">
                                            Subtotal
                                        </th>

                                        <th className="border p-3 w-24">
                                            Action
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {data.items.map((item, index) => (

                                        <tr key={index}>

                                            <td className="border p-2">

                                                <select
                                                    value={item.product_id}
                                                    onChange={(e) =>
                                                        updateItem(
                                                            index,
                                                            "product_id",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full rounded border p-2"
                                                >

                                                    <option value="">
                                                        Select Product
                                                    </option>

                                                    {products.map((product) => (

                                                        <option
                                                            key={product.id}
                                                            value={product.id}
                                                        >
                                                            {product.name}
                                                        </option>

                                                    ))}

                                                </select>

                                            </td>

                                            <td className="border p-2">

                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) =>
                                                        updateItem(
                                                            index,
                                                            "quantity",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full rounded border p-2"
                                                />

                                            </td>

                                            <td className="border p-2">

                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={item.price}
                                                    onChange={(e) =>
                                                        updateItem(
                                                            index,
                                                            "price",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full rounded border p-2"
                                                />
                                            </td>

                                            <td className="border p-2 text-right font-bold">

                                                ৳ {Number(item.subtotal).toFixed(2)}

                                            </td>

                                            <td className="border p-2 text-center">

                                                <button
                                                    type="button"
                                                    onClick={() => removeRow(index)}
                                                    className="rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700"
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

            </div>

        </AuthenticatedLayout>

    );

}
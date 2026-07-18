import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Dashboard({
        auth,
        stats,
        recentProducts,
    }) {

    const cards = [
        {
            title: "Products",
            value: stats.products,
            color: "bg-blue-500",
            icon: "📦",
        },
        {
            title: "Categories",
            value: stats.categories,
            color: "bg-green-500",
            icon: "📂",
        },
        {
            title: "Brands",
            value: stats.brands,
            color: "bg-purple-500",
            icon: "🏷️",
        },
        {
            title: "Orders",
            value: stats.orders,
            color: "bg-orange-500",
            icon: "🛒",
        },
        {
            title: "Customers",
            value: stats.customers,
            color: "bg-pink-500",
            icon: "👥",
        },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-2xl font-bold">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">

                {cards.map((card) => (

                    <div
                        key={card.title}
                        className="overflow-hidden rounded-xl bg-white shadow transition hover:shadow-xl"
                    >

                        <div className={`${card.color} p-4 text-4xl text-white`}>
                            {card.icon}
                        </div>

                        <div className="p-5">

                            <p className="text-gray-500">
                                {card.title}
                            </p>

                            <h2 className="mt-2 text-3xl font-bold">
                                {card.value}
                            </h2>

                        </div>

                    </div>

                ))}

            </div>

            {/* এখানে Recent Products শুরু */}

            <div className="mt-8 rounded-xl bg-white shadow">

                <div className="border-b px-6 py-4">

                    <h2 className="text-xl font-semibold">
                        Recent Products
                    </h2>

                </div>

                <table className="min-w-full">

                    <thead>

                        <tr className="bg-gray-100">

                            <th className="px-4 py-3 text-left">Name</th>
                            <th className="px-4 py-3 text-left">Price</th>
                            <th className="px-4 py-3 text-left">Stock</th>

                        </tr>

                    </thead>

                    <tbody>

                        {recentProducts.length > 0 ? (

                            recentProducts.map((product) => (

                                <tr
                                    key={product.id}
                                    className="border-t"
                                >

                                    <td className="px-4 py-3">
                                        {product.name}
                                    </td>

                                    <td className="px-4 py-3">
                                        ৳ {product.price}
                                    </td>

                                    <td className="px-4 py-3">
                                        {product.stock_quantity}
                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td
                                    colSpan="3"
                                    className="py-6 text-center"
                                >
                                    No Products Found
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </AuthenticatedLayout>
    );
}
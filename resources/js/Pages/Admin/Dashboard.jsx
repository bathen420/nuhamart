export default function Dashboard({ stats }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <div className="mx-auto max-w-7xl p-8">

                <h1 className="text-3xl font-bold text-gray-800">
                    NuhaMart Admin Dashboard
                </h1>

                <p className="mt-2 text-gray-500">
                    Welcome to the Professional Admin Panel
                </p>

                <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-5">

                    <div className="rounded-xl bg-white p-6 shadow">
                        <h3 className="text-gray-500">Products</h3>
                        <p className="mt-3 text-3xl font-bold">
                            {stats.products}
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow">
                        <h3 className="text-gray-500">Categories</h3>
                        <p className="mt-3 text-3xl font-bold">
                            {stats.categories}
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow">
                        <h3 className="text-gray-500">Brands</h3>
                        <p className="mt-3 text-3xl font-bold">
                            {stats.brands}
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow">
                        <h3 className="text-gray-500">Orders</h3>
                        <p className="mt-3 text-3xl font-bold">
                            {stats.orders}
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow">
                        <h3 className="text-gray-500">Customers</h3>
                        <p className="mt-3 text-3xl font-bold">
                            {stats.customers}
                        </p>
                    </div>

                </div>

            </div>
        </div>
    );
}
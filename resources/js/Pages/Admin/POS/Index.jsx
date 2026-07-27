import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";

export default function Index({
    auth,
    products,
    customers = [],
    categories = [],
    brands = [],
    filters = {},
}) {
    const [search, setSearch] = useState(filters.search ?? "");
    const [categoryId, setCategoryId] = useState(
        filters.category_id ?? ""
    );
    const [brandId, setBrandId] = useState(filters.brand_id ?? "");
    const [cart, setCart] = useState([]);
    const [productList, setProductList] = useState(
        products?.data ?? []
    );
    const [customerList, setCustomerList] = useState(customers);
    const [customerSearch, setCustomerSearch] = useState("");
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [loadingCustomers, setLoadingCustomers] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        customer_id: "",
        subtotal: 0,
        discount: 0,
        tax: 0,
        shipping: 0,
        total: 0,
        paid_amount: 0,
        payment_method: "Cash",
        note: "",
        items: [],
    });

    const subtotal = useMemo(() => {
        return cart.reduce(
            (total, item) => total + item.subtotal,
            0
        );
    }, [cart]);

    const grandTotal = useMemo(() => {
        const calculatedTotal =
            Number(subtotal) -
            Number(data.discount || 0) +
            Number(data.tax || 0) +
            Number(data.shipping || 0);

        return Math.max(calculatedTotal, 0);
    }, [
        subtotal,
        data.discount,
        data.tax,
        data.shipping,
    ]);

    const dueAmount = useMemo(() => {
        return Math.max(
            grandTotal - Number(data.paid_amount || 0),
            0
        );
    }, [grandTotal, data.paid_amount]);

    useEffect(() => {
        setData("subtotal", Number(subtotal.toFixed(2)));
        setData("total", Number(grandTotal.toFixed(2)));
    }, [subtotal, grandTotal]);

    useEffect(() => {
        setData(
            "items",
            cart.map((item) => ({
                product_id: item.product_id,
                quantity: item.quantity,
                price: Number(item.price),
                subtotal: Number(item.subtotal.toFixed(2)),
            }))
        );
    }, [cart]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            searchProducts();
        }, 400);

        return () => clearTimeout(timeout);
    }, [search, categoryId, brandId]);

    useEffect(() => {
        if (customerSearch.trim() === "") {
            setCustomerList(customers);
            return;
        }

        const timeout = setTimeout(() => {
            searchCustomers();
        }, 400);

        return () => clearTimeout(timeout);
    }, [customerSearch]);

    const searchProducts = async () => {
        setLoadingProducts(true);

        try {
            const params = new URLSearchParams();

            if (search.trim() !== "") {
                params.append("search", search.trim());
            }

            if (categoryId !== "") {
                params.append("category_id", categoryId);
            }

            if (brandId !== "") {
                params.append("brand_id", brandId);
            }

            const response = await fetch(
                `/admin/pos/search-products?${params.toString()}`,
                {
                    headers: {
                        Accept: "application/json",
                        "X-Requested-With": "XMLHttpRequest",
                    },
                    credentials: "same-origin",
                }
            );

            if (!response.ok) {
                throw new Error("Unable to load products.");
            }

            const result = await response.json();

            setProductList(result.data ?? []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingProducts(false);
        }
    };

    const searchCustomers = async () => {
        setLoadingCustomers(true);

        try {
            const params = new URLSearchParams({
                search: customerSearch.trim(),
            });

            const response = await fetch(
                `/admin/pos/search-customers?${params.toString()}`,
                {
                    headers: {
                        Accept: "application/json",
                        "X-Requested-With": "XMLHttpRequest",
                    },
                    credentials: "same-origin",
                }
            );

            if (!response.ok) {
                throw new Error("Unable to load customers.");
            }

            const result = await response.json();

            setCustomerList(result.customers ?? []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingCustomers(false);
        }
    };

    const addToCart = (product) => {
        if (Number(product.stock_quantity) <= 0) {
            return;
        }

        setCart((currentCart) => {
            const existingItem = currentCart.find(
                (item) => item.product_id === product.id
            );

            if (existingItem) {
                if (
                    existingItem.quantity >=
                    Number(product.stock_quantity)
                ) {
                    return currentCart;
                }

                return currentCart.map((item) =>
                    item.product_id === product.id
                        ? {
                              ...item,
                              quantity: item.quantity + 1,
                              subtotal:
                                  (item.quantity + 1) *
                                  item.price,
                          }
                        : item
                );
            }

            const sellingPrice = Number(
                product.selling_price ?? product.price
            );

            return [
                ...currentCart,
                {
                    product_id: product.id,
                    name: product.name,
                    sku: product.sku,
                    image: product.image,
                    stock_quantity: Number(
                        product.stock_quantity
                    ),
                    quantity: 1,
                    price: sellingPrice,
                    subtotal: sellingPrice,
                },
            ];
        });
    };

    const increaseQuantity = (productId) => {
        setCart((currentCart) =>
            currentCart.map((item) => {
                if (item.product_id !== productId) {
                    return item;
                }

                if (item.quantity >= item.stock_quantity) {
                    return item;
                }

                const quantity = item.quantity + 1;

                return {
                    ...item,
                    quantity,
                    subtotal: quantity * item.price,
                };
            })
        );
    };

    const decreaseQuantity = (productId) => {
        setCart((currentCart) =>
            currentCart
                .map((item) => {
                    if (item.product_id !== productId) {
                        return item;
                    }

                    const quantity = item.quantity - 1;

                    return {
                        ...item,
                        quantity,
                        subtotal: quantity * item.price,
                    };
                })
                .filter((item) => item.quantity > 0)
        );
    };

    const updateQuantity = (productId, value) => {
        const quantity = Math.max(
            1,
            Number.parseInt(value || "1", 10)
        );

        setCart((currentCart) =>
            currentCart.map((item) => {
                if (item.product_id !== productId) {
                    return item;
                }

                const safeQuantity = Math.min(
                    quantity,
                    item.stock_quantity
                );

                return {
                    ...item,
                    quantity: safeQuantity,
                    subtotal: safeQuantity * item.price,
                };
            })
        );
    };

    const removeFromCart = (productId) => {
        setCart((currentCart) =>
            currentCart.filter(
                (item) => item.product_id !== productId
            )
        );
    };

    const clearCart = () => {
        setCart([]);

        reset(
            "customer_id",
            "discount",
            "tax",
            "shipping",
            "paid_amount",
            "payment_method",
            "note",
            "items"
        );

        setData("payment_method", "Cash");
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (cart.length === 0 || processing) {
            return;
        }

        post("/admin/pos/checkout", {
            preserveScroll: true,
            onSuccess: () => {
                setCart([]);
                reset();
            },
        });
    };

    const formatMoney = (amount) => {
        return new Intl.NumberFormat("en-BD", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(Number(amount || 0));
    };

    const productImage = (image) => {
        if (!image) return "/images/no-image.svg";
        if (image.startsWith("http://") || image.startsWith("https://") || image.startsWith("/")) {
            return image;
        }
        return `/storage/${image}`;
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Point of Sale" />

            <div className="min-h-screen bg-gray-100 py-6">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Point of Sale
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Search products, build the cart and complete
                                sales.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                router.visit("/admin/sales")
                            }
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                            Sales History
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                            <section className="xl:col-span-8">
                                <div className="rounded-xl bg-white p-5 shadow-sm">
                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                                Search product
                                            </label>

                                            <input
                                                type="text"
                                                value={search}
                                                onChange={(event) =>
                                                    setSearch(
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="Name or SKU"
                                                className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                                Category
                                            </label>

                                            <select
                                                value={categoryId}
                                                onChange={(event) =>
                                                    setCategoryId(
                                                        event.target.value
                                                    )
                                                }
                                                className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                            >
                                                <option value="">
                                                    All categories
                                                </option>

                                                {categories.map(
                                                    (category) => (
                                                        <option
                                                            key={
                                                                category.id
                                                            }
                                                            value={
                                                                category.id
                                                            }
                                                        >
                                                            {
                                                                category.name
                                                            }
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                                Brand
                                            </label>

                                            <select
                                                value={brandId}
                                                onChange={(event) =>
                                                    setBrandId(
                                                        event.target.value
                                                    )
                                                }
                                                className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                            >
                                                <option value="">
                                                    All brands
                                                </option>

                                                {brands.map((brand) => (
                                                    <option
                                                        key={brand.id}
                                                        value={brand.id}
                                                    >
                                                        {brand.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mt-5">
                                        {loadingProducts ? (
                                            <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center text-gray-500">
                                                Loading products...
                                            </div>
                                        ) : productList.length === 0 ? (
                                            <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center text-gray-500">
                                                No products found.
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                                                {productList.map(
                                                    (product) => (
                                                        <button
                                                            type="button"
                                                            key={product.id}
                                                            onClick={() =>
                                                                addToCart(
                                                                    product
                                                                )
                                                            }
                                                            className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-400 hover:shadow-md"
                                                        >
                                                            <img
                                                                src={productImage(
                                                                    product.image
                                                                )}
                                                                alt={
                                                                    product.name
                                                                }
                                                                className="h-48 w-full bg-gray-100 object-cover"
                                                                onError={(
                                                                    event
                                                                ) => {
                                                                    event.currentTarget.onerror = null;
                                                                    event.currentTarget.src =
                                                                        "/images/no-image.svg";
                                                                }}
                                                            />

                                                            <div className="p-3">
                                                                <h3 className="line-clamp-2 min-h-10 font-semibold text-gray-900">
                                                                    {
                                                                        product.name
                                                                    }
                                                                </h3>

                                                                <p className="mt-1 text-xs text-gray-500">
                                                                    SKU:{" "}
                                                                    {product.sku ??
                                                                        "N/A"}
                                                                </p>

                                                                <div className="mt-3 flex items-end justify-between gap-2">
                                                                    <span className="font-bold text-indigo-600">
                                                                        ৳{" "}
                                                                        {formatMoney(
                                                                            product.selling_price
                                                                        )}
                                                                    </span>

                                                                    <span className="text-xs font-medium text-green-600">
                                                                        Stock:{" "}
                                                                        {
                                                                            product.stock_quantity
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>

                            <aside className="xl:col-span-4">
                                <div className="sticky top-4 space-y-4">
                                    <div className="rounded-xl bg-white p-5 shadow-sm">
                                        <div className="mb-4 flex items-center justify-between">
                                            <h2 className="text-lg font-bold text-gray-900">
                                                Shopping Cart
                                            </h2>

                                            {cart.length > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={clearCart}
                                                    className="text-sm font-medium text-red-600 hover:text-red-700"
                                                >
                                                    Clear cart
                                                </button>
                                            )}
                                        </div>

                                        {cart.length === 0 ? (
                                            <div className="rounded-lg border border-dashed border-gray-300 py-10 text-center text-sm text-gray-500">
                                                No products added.
                                            </div>
                                        ) : (
                                            <div className="max-h-[360px] space-y-3 overflow-y-auto pr-1">
                                                {cart.map((item) => (
                                                    <div
                                                        key={
                                                            item.product_id
                                                        }
                                                        className="rounded-lg border border-gray-200 p-3"
                                                    >
                                                        <div className="flex gap-3">
                                                            <img
                                                                src={productImage(
                                                                    item.image
                                                                )}
                                                                alt={item.name}
                                                                className="h-14 w-14 rounded-lg bg-gray-100 object-cover"
                                                                onError={(
                                                                    event
                                                                ) => {
                                                                    event.currentTarget.onerror = null;
                                                                    event.currentTarget.src =
                                                                        "/images/no-image.svg";
                                                                }}
                                                            />

                                                            <div className="min-w-0 flex-1">
                                                                <div className="flex items-start justify-between gap-2">
                                                                    <div>
                                                                        <h3 className="truncate text-sm font-semibold text-gray-900">
                                                                            {
                                                                                item.name
                                                                            }
                                                                        </h3>

                                                                        <p className="mt-0.5 text-xs text-gray-500">
                                                                            ৳{" "}
                                                                            {formatMoney(
                                                                                item.price
                                                                            )}{" "}
                                                                            each
                                                                        </p>
                                                                    </div>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            removeFromCart(
                                                                                item.product_id
                                                                            )
                                                                        }
                                                                        className="text-xs font-medium text-red-600"
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                </div>

                                                                <div className="mt-3 flex items-center justify-between gap-3">
                                                                    <div className="flex items-center rounded-lg border border-gray-300">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                decreaseQuantity(
                                                                                    item.product_id
                                                                                )
                                                                            }
                                                                            className="px-3 py-1 text-gray-700 hover:bg-gray-100"
                                                                        >
                                                                            −
                                                                        </button>

                                                                        <input
                                                                            type="number"
                                                                            min="1"
                                                                            max={
                                                                                item.stock_quantity
                                                                            }
                                                                            value={
                                                                                item.quantity
                                                                            }
                                                                            onChange={(
                                                                                event
                                                                            ) =>
                                                                                updateQuantity(
                                                                                    item.product_id,
                                                                                    event
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            className="w-14 border-0 px-1 py-1 text-center text-sm focus:ring-0"
                                                                        />

                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                increaseQuantity(
                                                                                    item.product_id
                                                                                )
                                                                            }
                                                                            className="px-3 py-1 text-gray-700 hover:bg-gray-100"
                                                                        >
                                                                            +
                                                                        </button>
                                                                    </div>

                                                                    <span className="text-sm font-bold text-gray-900">
                                                                        ৳{" "}
                                                                        {formatMoney(
                                                                            item.subtotal
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {errors.items && (
                                            <p className="mt-3 text-sm text-red-600">
                                                {errors.items}
                                            </p>
                                        )}
                                    </div>

                                    <div className="rounded-xl bg-white p-5 shadow-sm">
                                        <h2 className="mb-4 text-lg font-bold text-gray-900">
                                            Customer & Payment
                                        </h2>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                                    Search customer
                                                </label>

                                                <input
                                                    type="text"
                                                    value={customerSearch}
                                                    onChange={(event) =>
                                                        setCustomerSearch(
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="Name, phone or email"
                                                    className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                                />

                                                {loadingCustomers && (
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        Searching...
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                                    Customer
                                                </label>

                                                <select
                                                    value={
                                                        data.customer_id
                                                    }
                                                    onChange={(event) =>
                                                        setData(
                                                            "customer_id",
                                                            event.target.value
                                                        )
                                                    }
                                                    className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                                >
                                                    <option value="">
                                                        Walk-in Customer
                                                    </option>

                                                    {customerList.map(
                                                        (customer) => (
                                                            <option
                                                                key={
                                                                    customer.id
                                                                }
                                                                value={
                                                                    customer.id
                                                                }
                                                            >
                                                                {
                                                                    customer.name
                                                                }
                                                                {customer.phone
                                                                    ? ` - ${customer.phone}`
                                                                    : ""}
                                                            </option>
                                                        )
                                                    )}
                                                </select>

                                                {errors.customer_id && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {
                                                            errors.customer_id
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                                        Discount
                                                    </label>

                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={
                                                            data.discount
                                                        }
                                                        onChange={(event) =>
                                                            setData(
                                                                "discount",
                                                                event.target
                                                                    .value
                                                            )
                                                        }
                                                        className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                                        Tax
                                                    </label>

                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={data.tax}
                                                        onChange={(event) =>
                                                            setData(
                                                                "tax",
                                                                event.target
                                                                    .value
                                                            )
                                                        }
                                                        className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                                    Shipping
                                                </label>

                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={data.shipping}
                                                    onChange={(event) =>
                                                        setData(
                                                            "shipping",
                                                            event.target.value
                                                        )
                                                    }
                                                    className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                                    Payment method
                                                </label>

                                                <select
                                                    value={
                                                        data.payment_method
                                                    }
                                                    onChange={(event) =>
                                                        setData(
                                                            "payment_method",
                                                            event.target.value
                                                        )
                                                    }
                                                    className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                                >
                                                    <option value="Cash">
                                                        Cash
                                                    </option>
                                                    <option value="Card">
                                                        Card
                                                    </option>
                                                    <option value="Mobile Banking">
                                                        Mobile Banking
                                                    </option>
                                                    <option value="Bank">
                                                        Bank
                                                    </option>
                                                </select>

                                                {errors.payment_method && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {
                                                            errors.payment_method
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                                    Paid amount
                                                </label>

                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={
                                                        data.paid_amount
                                                    }
                                                    onChange={(event) =>
                                                        setData(
                                                            "paid_amount",
                                                            event.target.value
                                                        )
                                                    }
                                                    className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                                />

                                                {errors.paid_amount && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {
                                                            errors.paid_amount
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                                    Note
                                                </label>

                                                <textarea
                                                    rows="2"
                                                    value={data.note}
                                                    onChange={(event) =>
                                                        setData(
                                                            "note",
                                                            event.target.value
                                                        )
                                                    }
                                                    className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                                    placeholder="Optional note"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-xl bg-gray-900 p-5 text-white shadow-sm">
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-300">
                                                    Subtotal
                                                </span>

                                                <span>
                                                    ৳{" "}
                                                    {formatMoney(subtotal)}
                                                </span>
                                            </div>

                                            <div className="flex justify-between">
                                                <span className="text-gray-300">
                                                    Discount
                                                </span>

                                                <span>
                                                    - ৳{" "}
                                                    {formatMoney(
                                                        data.discount
                                                    )}
                                                </span>
                                            </div>

                                            <div className="flex justify-between">
                                                <span className="text-gray-300">
                                                    Tax
                                                </span>

                                                <span>
                                                    ৳{" "}
                                                    {formatMoney(data.tax)}
                                                </span>
                                            </div>

                                            <div className="flex justify-between">
                                                <span className="text-gray-300">
                                                    Shipping
                                                </span>

                                                <span>
                                                    ৳{" "}
                                                    {formatMoney(
                                                        data.shipping
                                                    )}
                                                </span>
                                            </div>

                                            <div className="border-t border-gray-700 pt-3">
                                                <div className="flex justify-between text-xl font-bold">
                                                    <span>Total</span>

                                                    <span>
                                                        ৳{" "}
                                                        {formatMoney(
                                                            grandTotal
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex justify-between">
                                                <span className="text-gray-300">
                                                    Paid
                                                </span>

                                                <span>
                                                    ৳{" "}
                                                    {formatMoney(
                                                        data.paid_amount
                                                    )}
                                                </span>
                                            </div>

                                            <div className="flex justify-between">
                                                <span className="text-gray-300">
                                                    Due
                                                </span>

                                                <span>
                                                    ৳{" "}
                                                    {formatMoney(
                                                        dueAmount
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={
                                                processing ||
                                                cart.length === 0
                                            }
                                            className="mt-5 w-full rounded-lg bg-indigo-500 px-4 py-3 font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {processing
                                                ? "Processing..."
                                                : "Complete Sale"}
                                        </button>

                                        {errors.total && (
                                            <p className="mt-2 text-sm text-red-300">
                                                {errors.total}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
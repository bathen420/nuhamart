import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "nuhamart_cart";

function getProductPrice(product) {
    return Number(product.sale_price ?? product.price ?? 0);
}

function loadStoredCart() {
    if (typeof window === "undefined") {
        return [];
    }

    try {
        const storedCart = window.localStorage.getItem(STORAGE_KEY);

        return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
        console.error("Unable to load cart:", error);

        return [];
    }
}

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(loadStoredCart);

    useEffect(() => {
        try {
            window.localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(cartItems),
            );
        } catch (error) {
            console.error("Unable to save cart:", error);
        }
    }, [cartItems]);

    const addToCart = useCallback((product, quantity = 1) => {
        if (!product?.id) {
            console.error("Product ID is required to add an item to cart.");

            return;
        }

        const safeQuantity = Math.max(1, Number(quantity) || 1);

        setCartItems((currentItems) => {
            const existingItem = currentItems.find(
                (item) => item.id === product.id,
            );

            if (existingItem) {
                return currentItems.map((item) =>
                    item.id === product.id
                        ? {
                              ...item,
                              quantity: item.quantity + safeQuantity,
                          }
                        : item,
                );
            }

            return [
                ...currentItems,
                {
                    ...product,
                    quantity: safeQuantity,
                },
            ];
        });
    }, []);

    const removeFromCart = useCallback((productId) => {
        setCartItems((currentItems) =>
            currentItems.filter((item) => item.id !== productId),
        );
    }, []);

    const increaseQuantity = useCallback((productId) => {
        setCartItems((currentItems) =>
            currentItems.map((item) =>
                item.id === productId
                    ? {
                          ...item,
                          quantity: item.quantity + 1,
                      }
                    : item,
            ),
        );
    }, []);

    const decreaseQuantity = useCallback((productId) => {
        setCartItems((currentItems) =>
            currentItems
                .map((item) =>
                    item.id === productId
                        ? {
                              ...item,
                              quantity: Math.max(0, item.quantity - 1),
                          }
                        : item,
                )
                .filter((item) => item.quantity > 0),
        );
    }, []);

    const updateQuantity = useCallback((productId, quantity) => {
        const safeQuantity = Number(quantity);

        if (!Number.isInteger(safeQuantity)) {
            return;
        }

        if (safeQuantity <= 0) {
            setCartItems((currentItems) =>
                currentItems.filter((item) => item.id !== productId),
            );

            return;
        }

        setCartItems((currentItems) =>
            currentItems.map((item) =>
                item.id === productId
                    ? {
                          ...item,
                          quantity: safeQuantity,
                      }
                    : item,
            ),
        );
    }, []);

    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    const totalItems = useMemo(
        () =>
            cartItems.reduce(
                (total, item) => total + Number(item.quantity || 0),
                0,
            ),
        [cartItems],
    );

    const subtotal = useMemo(
        () =>
            cartItems.reduce(
                (total, item) =>
                    total +
                    getProductPrice(item) * Number(item.quantity || 0),
                0,
            ),
        [cartItems],
    );

    const value = useMemo(
        () => ({
            items: cartItems,
            
            cartItems,
            totalItems,
            subtotal,
            addToCart,
            removeFromCart,
            increaseQuantity,
            decreaseQuantity,
            updateQuantity,
            clearCart,
        }),
        [
            cartItems,
            totalItems,
            subtotal,
            addToCart,
            removeFromCart,
            increaseQuantity,
            decreaseQuantity,
            updateQuantity,
            clearCart,
        ],
    );

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export function useCartContext() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error(
            "useCartContext must be used inside a CartProvider.",
        );
    }

    return context;
}
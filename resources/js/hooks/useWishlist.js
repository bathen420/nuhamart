import axios from "axios";
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "nuhamart_guest_wishlist";
const listeners = new Set();

let productIds = new Set();
let initializedForUser = null;
let initializing = null;

const readGuestIds = () => {
    try {
        const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

        return Array.isArray(value)
            ? value.map(Number).filter(Number.isInteger)
            : [];
    } catch {
        return [];
    }
};

const writeGuestIds = (ids) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
};

const emit = () => {
    const snapshot = new Set(productIds);
    listeners.forEach((listener) => listener(snapshot));
    window.dispatchEvent(
        new CustomEvent("nuhamart:wishlist-updated", {
            detail: { count: snapshot.size },
        }),
    );
};

const setIds = (ids) => {
    productIds = new Set((ids || []).map(Number).filter(Number.isInteger));
    emit();
};

const routeExists = (name) => {
    try {
        return typeof route === "function" && route().has(name);
    } catch {
        return false;
    }
};

const initialize = async (user) => {
    const userKey = user?.id ? `user:${user.id}` : "guest";

    if (initializedForUser === userKey) return;
    if (initializing) return initializing;

    initializing = (async () => {
        if (!user?.id) {
            setIds(readGuestIds());
            initializedForUser = userKey;
            initializing = null;
            return;
        }

        const guestIds = readGuestIds();

        if (guestIds.length > 0 && routeExists("customer.wishlist.merge")) {
            const response = await axios.post(route("customer.wishlist.merge"), {
                product_ids: guestIds,
            });

            localStorage.removeItem(STORAGE_KEY);
            setIds(response.data.product_ids || []);
        } else if (routeExists("wishlist.state")) {
            const response = await axios.get(route("wishlist.state"));
            setIds(response.data.product_ids || []);
        }

        initializedForUser = userKey;
        initializing = null;
    })().catch((error) => {
        initializing = null;
        throw error;
    });

    return initializing;
};

export default function useWishlist(user = null) {
    const [ids, setLocalIds] = useState(() => new Set(productIds));
    const [processingIds, setProcessingIds] = useState(() => new Set());

    useEffect(() => {
        const listener = (nextIds) => setLocalIds(new Set(nextIds));
        listeners.add(listener);
        initialize(user).catch(() => {});

        return () => listeners.delete(listener);
    }, [user?.id]);

    const toggle = async (product) => {
        const productId = Number(product?.id);

        if (!Number.isInteger(productId)) return;

        setProcessingIds((current) => new Set(current).add(productId));

        try {
            const exists = productIds.has(productId);

            if (!user?.id) {
                const next = new Set(productIds);

                if (exists) next.delete(productId);
                else next.add(productId);

                productIds = next;
                writeGuestIds(productIds);
                emit();
                return;
            }

            const response = exists
                ? await axios.delete(
                      route("customer.wishlist.destroy", productId),
                  )
                : await axios.post(
                      route("customer.wishlist.store", productId),
                  );

            setIds(response.data.product_ids || []);
        } finally {
            setProcessingIds((current) => {
                const next = new Set(current);
                next.delete(productId);
                return next;
            });
        }
    };

    const remove = async (product) => {
        const productId = Number(product?.id);

        if (!productIds.has(productId)) return;
        await toggle(product);
    };

    return useMemo(
        () => ({
            ids,
            count: ids.size,
            has: (productId) => ids.has(Number(productId)),
            toggle,
            remove,
            isProcessing: (productId) =>
                processingIds.has(Number(productId)),
            guestIds: () => readGuestIds(),
        }),
        [ids, processingIds, user?.id],
    );
}

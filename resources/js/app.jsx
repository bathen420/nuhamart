import "./bootstrap";
import "../css/app.css";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";

import { CartProvider } from "@/Context/CartContext";
// import { WishlistProvider } from "@/Context/WishlistContext";
// import { ThemeProvider } from "@/Context/ThemeContext";
// import { ToastProvider } from "@/Context/ToastContext";

createInertiaApp({
    title: (title) => title,

    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),

    setup({ el, App, props }) {
        const root = createRoot(el);
        const companyName = props.initialPage.props?.businessSettings?.company_name || import.meta.env.VITE_APP_NAME || "NuhaMart";
        const pageTitle = props.initialPage.props?.title;
        document.title = pageTitle ? `${pageTitle} - ${companyName}` : companyName;

        root.render(
            <CartProvider>

                {/* Future Providers */}

                {/* <WishlistProvider> */}

                {/* <ThemeProvider> */}

                {/* <ToastProvider> */}

                <App {...props} />

                {/* </ToastProvider> */}

                {/* </ThemeProvider> */}

                {/* </WishlistProvider> */}

            </CartProvider>
        );
    },

    progress: {
        color: "#4F46E5",
        showSpinner: true,
    },
});
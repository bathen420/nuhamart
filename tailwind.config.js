import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import("tailwindcss").Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
    ],

    theme: {
        extend: {
            colors: {
                brand: {
                    50: "rgb(var(--nm-brand-50) / <alpha-value>)",
                    100: "rgb(var(--nm-brand-100) / <alpha-value>)",
                    200: "rgb(var(--nm-brand-200) / <alpha-value>)",
                    300: "rgb(var(--nm-brand-300) / <alpha-value>)",
                    400: "rgb(var(--nm-brand-400) / <alpha-value>)",
                    500: "rgb(var(--nm-brand-500) / <alpha-value>)",
                    600: "rgb(var(--nm-brand-600) / <alpha-value>)",
                    700: "rgb(var(--nm-brand-700) / <alpha-value>)",
                    800: "rgb(var(--nm-brand-800) / <alpha-value>)",
                    900: "rgb(var(--nm-brand-900) / <alpha-value>)",
                    950: "rgb(var(--nm-brand-950) / <alpha-value>)",
                },
                ink: {
                    50: "rgb(var(--nm-ink-50) / <alpha-value>)",
                    100: "rgb(var(--nm-ink-100) / <alpha-value>)",
                    200: "rgb(var(--nm-ink-200) / <alpha-value>)",
                    300: "rgb(var(--nm-ink-300) / <alpha-value>)",
                    400: "rgb(var(--nm-ink-400) / <alpha-value>)",
                    500: "rgb(var(--nm-ink-500) / <alpha-value>)",
                    600: "rgb(var(--nm-ink-600) / <alpha-value>)",
                    700: "rgb(var(--nm-ink-700) / <alpha-value>)",
                    800: "rgb(var(--nm-ink-800) / <alpha-value>)",
                    900: "rgb(var(--nm-ink-900) / <alpha-value>)",
                    950: "rgb(var(--nm-ink-950) / <alpha-value>)",
                },
            },

            fontFamily: {
                sans: [
                    "Inter",
                    "Figtree",
                    ...defaultTheme.fontFamily.sans,
                ],
                display: [
                    "Inter",
                    "Figtree",
                    ...defaultTheme.fontFamily.sans,
                ],
            },

            borderRadius: {
                "4xl": "2rem",
                "5xl": "2.5rem",
            },

            boxShadow: {
                soft: "0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.06)",
                card: "0 1px 2px rgba(15, 23, 42, 0.04), 0 12px 32px rgba(15, 23, 42, 0.07)",
                floating: "0 18px 55px rgba(15, 23, 42, 0.16)",
                brand: "0 10px 30px rgba(13, 148, 136, 0.20)",
            },

            keyframes: {
                "nm-fade-up": {
                    "0%": { opacity: "0", transform: "translateY(6px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                "nm-pulse-soft": {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0.55" },
                },
            },

            animation: {
                "fade-up": "nm-fade-up 220ms ease-out",
                "pulse-soft": "nm-pulse-soft 1.8s ease-in-out infinite",
            },
        },
    },

    plugins: [forms],
};

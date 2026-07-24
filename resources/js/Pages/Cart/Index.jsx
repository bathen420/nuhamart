import { Head } from "@inertiajs/react";

export default function CartIndex() {
    return (
        <>
            <Head title="Shopping Cart" />

            <main className="min-h-screen bg-slate-50 p-10">
                <h1 className="text-3xl font-black text-slate-900">
                    Shopping Cart
                </h1>
            </main>
        </>
    );
}
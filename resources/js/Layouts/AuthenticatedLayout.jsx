import { usePage } from "@inertiajs/react";
import AdminSidebar from "@/Components/AdminSidebar";
import Navbar from "@/Components/Admin/Navbar";

export default function AuthenticatedLayout({ header, children }) {
    const { flash } = usePage().props;

    return (
        <div className="flex min-h-screen bg-gray-100">
            <AdminSidebar />

            <div className="min-w-0 flex-1">
                <Navbar />

                {header && (
                    <header className="border-b bg-white shadow-sm">
                        <div className="px-6 py-4">{header}</div>
                    </header>
                )}

                {flash?.success && (
                    <div className="mx-6 mt-6 rounded-lg border border-green-300 bg-green-100 px-4 py-3 text-green-700">
                        {flash.success}
                    </div>
                )}

                {flash?.error && (
                    <div className="mx-6 mt-6 rounded-lg border border-red-300 bg-red-100 px-4 py-3 text-red-700">
                        {flash.error}
                    </div>
                )}

                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}

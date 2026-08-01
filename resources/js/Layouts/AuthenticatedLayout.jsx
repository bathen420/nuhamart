import { usePage } from "@inertiajs/react";
import AdminSidebar from "@/Components/AdminSidebar";
import Navbar from "@/Components/Admin/Navbar";

export default function AuthenticatedLayout({ header, children }) {
    const { flash = {} } = usePage().props;

    return (
        <div className="flex min-h-screen bg-gray-100">
            <AdminSidebar />

            <div className="flex min-h-screen min-w-0 flex-1 flex-col">
                <Navbar />

                {header && (
                    <header className="shrink-0 border-b border-gray-200 bg-white shadow-sm">
                        <div className="px-4 py-4 sm:px-6">
                            {header}
                        </div>
                    </header>
                )}

                <main className="min-w-0 flex-1 px-4 py-6 sm:px-6">
                    {flash?.success && (
                        <div className="mb-5 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800">
                            {flash.success}
                        </div>
                    )}

                    {flash?.error && (
                        <div className="mb-5 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
                            {flash.error}
                        </div>
                    )}

                    {children}
                </main>
            </div>
        </div>
    );
}

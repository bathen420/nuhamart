import { usePage } from "@inertiajs/react";
import AdminSidebar from "@/Components/AdminSidebar";

export default function AuthenticatedLayout({ header, children }) {

    const { flash } = usePage().props;

    return (
        <div className="flex min-h-screen bg-gray-100">

            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <div className="flex-1">

                {header && (
                    <header className="border-b bg-white shadow-sm">
                        <div className="px-6 py-4">
                            {header}
                        </div>
                    </header>
                )}

                {flash?.success && (
                    <div className="m-6 rounded-lg border border-green-300 bg-green-100 px-4 py-3 text-green-700">
                        {flash.success}
                    </div>
                )}

                <main className="p-6">
                    {children}
                </main>

            </div>

        </div>
    );
}
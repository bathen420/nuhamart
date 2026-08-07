import { useCallback, useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import AdminSidebar from "@/Components/AdminSidebar";
import Navbar from "@/Components/Admin/Navbar";
import CommandPalette from "@/Components/Admin/CommandPalette";
import cn from "@/lib/cn";

function FlashMessage({ tone, children }) {
    const success = tone === "success";
    const Icon = success ? CheckCircle2 : AlertCircle;

    return (
        <div
            className={cn(
                "mb-5 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm shadow-sm",
                success
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-rose-200 bg-rose-50 text-rose-800",
            )}
        >
            <Icon size={18} className="mt-0.5 shrink-0" />
            <span className="min-w-0 flex-1 font-semibold">{children}</span>
        </div>
    );
}

export default function AuthenticatedLayout({ header, children }) {
    const { flash = {} } = usePage().props;
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        try {
            return localStorage.getItem("nm-admin-sidebar-collapsed") === "1";
        } catch {
            return false;
        }
    });
    const [mobileOpen, setMobileOpen] = useState(false);
    const [commandOpen, setCommandOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarCollapsed((value) => {
            const next = !value;
            try {
                localStorage.setItem(
                    "nm-admin-sidebar-collapsed",
                    next ? "1" : "0",
                );
            } catch {
                // Local storage can be unavailable in restricted browsers.
            }
            return next;
        });
    };

    const closeCommand = useCallback(() => setCommandOpen(false), []);

    useEffect(() => {
        const listener = (event) => {
            if (
                (event.ctrlKey || event.metaKey) &&
                event.key.toLowerCase() === "k"
            ) {
                event.preventDefault();
                setCommandOpen(true);
            }
        };

        document.addEventListener("keydown", listener);
        return () => document.removeEventListener("keydown", listener);
    }, []);

    return (
        <div className="flex min-h-screen bg-ink-50">
            <AdminSidebar
                collapsed={sidebarCollapsed}
                mobileOpen={mobileOpen}
                onToggleCollapse={toggleSidebar}
                onCloseMobile={() => setMobileOpen(false)}
                onOpenSearch={() => setCommandOpen(true)}
            />

            <div className="flex min-h-screen min-w-0 flex-1 flex-col">
                <Navbar
                    onOpenMobile={() => setMobileOpen(true)}
                    onOpenSearch={() => setCommandOpen(true)}
                />

                {header && (
                    <div className="shrink-0 border-b border-ink-200 bg-white">
                        <div className="mx-auto w-full max-w-[1700px] px-4 py-5 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </div>
                )}

                <main className="min-w-0 flex-1">
                    <div className="mx-auto w-full max-w-[1700px] px-4 py-6 sm:px-6 lg:px-8">
                        {flash?.success && (
                            <FlashMessage tone="success">
                                {flash.success}
                            </FlashMessage>
                        )}

                        {flash?.error && (
                            <FlashMessage tone="error">
                                {flash.error}
                            </FlashMessage>
                        )}

                        <div className="nm-page">{children}</div>
                    </div>
                </main>
            </div>

            <CommandPalette open={commandOpen} onClose={closeCommand} />
        </div>
    );
}

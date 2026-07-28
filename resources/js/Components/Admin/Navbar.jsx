import { Link, usePage } from "@inertiajs/react";
import { LogOut, UserRound } from "lucide-react";
import NotificationBell from "@/Components/Notifications/NotificationBell";

export default function Navbar() {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <div className="sticky top-0 z-40 flex min-h-16 items-center justify-between border-b bg-white/95 px-6 shadow-sm backdrop-blur">
            <div>
                <p className="text-sm font-semibold text-gray-900">Welcome back, {user?.name || "User"}</p>
                <p className="text-xs text-gray-500">Manage your business from one place.</p>
            </div>

            <div className="flex items-center gap-3">
                <NotificationBell />

                <div className="hidden items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2 sm:flex">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                        <UserRound className="h-4 w-4" />
                    </span>
                    <div className="max-w-36">
                        <p className="truncate text-sm font-semibold text-gray-800">{user?.name}</p>
                        <p className="truncate text-xs text-gray-500">{user?.email}</p>
                    </div>
                </div>

                <Link
                    href={route("logout")}
                    method="post"
                    as="button"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                    aria-label="Log out"
                >
                    <LogOut className="h-4 w-4" />
                </Link>
            </div>
        </div>
    );
}

import { Link, router, usePage } from "@inertiajs/react";
import { Bell, CheckCheck, CircleAlert, Info, TriangleAlert, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const typeIcon = {
    info: Info,
    success: CheckCheck,
    warning: TriangleAlert,
    danger: XCircle,
};

const typeClass = {
    info: "bg-blue-50 text-blue-700",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-red-50 text-red-700",
};

export default function NotificationBell() {
    const { notificationsSummary = {} } = usePage().props;
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);
    const items = notificationsSummary.items || [];
    const unreadCount = Number(notificationsSummary.unread_count || 0);

    useEffect(() => {
        const closeOnOutsideClick = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", closeOnOutsideClick);
        return () => document.removeEventListener("mousedown", closeOnOutsideClick);
    }, []);

    const markAllRead = () => {
        router.patch(route("admin.notifications.read-all"), {}, {
            preserveScroll: true,
            onSuccess: () => setOpen(false),
        });
    };

    const openNotification = (notification) => {
        router.patch(
            route("admin.notifications.read", notification.id),
            { redirect: Boolean(notification.url) },
            { preserveScroll: true },
        );
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                aria-label="Notifications"
                aria-expanded={open}
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 z-50 mt-3 w-[360px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
                    <div className="flex items-center justify-between border-b px-4 py-3">
                        <div>
                            <h3 className="font-bold text-gray-900">Notifications</h3>
                            <p className="text-xs text-gray-500">{unreadCount} unread notification{unreadCount === 1 ? "" : "s"}</p>
                        </div>
                        {unreadCount > 0 && (
                            <button type="button" onClick={markAllRead} className="text-xs font-semibold text-blue-700 hover:underline">
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-[420px] overflow-y-auto">
                        {items.length === 0 ? (
                            <div className="px-6 py-10 text-center">
                                <Bell className="mx-auto h-9 w-9 text-gray-300" />
                                <p className="mt-3 text-sm font-medium text-gray-600">You are all caught up.</p>
                            </div>
                        ) : (
                            items.map((notification) => {
                                const Icon = typeIcon[notification.type] || CircleAlert;
                                return (
                                    <button
                                        type="button"
                                        key={notification.id}
                                        onClick={() => openNotification(notification)}
                                        className="flex w-full gap-3 border-b border-gray-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-gray-50"
                                    >
                                        <span className={`mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${typeClass[notification.type] || typeClass.info}`}>
                                            <Icon className="h-4 w-4" />
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate text-sm font-semibold text-gray-900">{notification.title}</span>
                                            <span className="mt-0.5 line-clamp-2 block text-xs leading-5 text-gray-500">{notification.message}</span>
                                            <span className="mt-1 block text-[11px] text-gray-400">{notification.created_at_human}</span>
                                        </span>
                                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                                    </button>
                                );
                            })
                        )}
                    </div>

                    <Link
                        href={route("admin.notifications.index")}
                        onClick={() => setOpen(false)}
                        className="block border-t bg-gray-50 px-4 py-3 text-center text-sm font-semibold text-blue-700 hover:bg-blue-50"
                    >
                        View all notifications
                    </Link>
                </div>
            )}
        </div>
    );
}

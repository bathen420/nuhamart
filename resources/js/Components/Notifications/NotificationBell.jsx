import { Link, router, usePage } from "@inertiajs/react";
import {
    Bell,
    CheckCheck,
    CircleAlert,
    Info,
    TriangleAlert,
    XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import cn from "@/lib/cn";

const typeIcon = {
    info: Info,
    success: CheckCheck,
    warning: TriangleAlert,
    danger: XCircle,
};

const typeClass = {
    info: "bg-sky-50 text-sky-700",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-rose-50 text-rose-700",
};

export default function NotificationBell() {
    const { notificationsSummary = {} } = usePage().props;
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);
    const items = notificationsSummary.items || [];
    const unreadCount = Number(notificationsSummary.unread_count || 0);

    useEffect(() => {
        const close = (event) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);

    const markAllRead = () => {
        router.patch(
            route("admin.notifications.read-all"),
            {},
            {
                preserveScroll: true,
                onSuccess: () => setOpen(false),
            },
        );
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
                className={cn(
                    "relative grid h-11 w-11 place-items-center rounded-xl border border-ink-200 bg-white text-ink-500 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700",
                    open && "border-brand-300 bg-brand-50 text-brand-700",
                )}
                aria-label="Notifications"
                aria-expanded={open}
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full border-2 border-white bg-rose-600 px-1 text-[9px] font-black text-white">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 z-50 mt-3 w-[min(380px,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-ink-200 bg-white shadow-floating">
                    <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
                        <div>
                            <h3 className="font-black text-ink-900">
                                Notifications
                            </h3>
                            <p className="mt-0.5 text-xs text-ink-400">
                                {unreadCount} unread
                            </p>
                        </div>

                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={markAllRead}
                                className="text-xs font-black text-brand-700 hover:text-brand-900"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="nm-scrollbar max-h-[420px] overflow-y-auto p-2">
                        {items.length === 0 ? (
                            <div className="px-6 py-12 text-center">
                                <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-ink-100 text-ink-300">
                                    <Bell size={23} />
                                </span>
                                <p className="mt-4 text-sm font-black text-ink-700">
                                    You are all caught up
                                </p>
                            </div>
                        ) : (
                            items.map((notification) => {
                                const Icon =
                                    typeIcon[notification.type] || CircleAlert;

                                return (
                                    <button
                                        type="button"
                                        key={notification.id}
                                        onClick={() =>
                                            openNotification(notification)
                                        }
                                        className="group flex w-full gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-ink-50"
                                    >
                                        <span
                                            className={cn(
                                                "mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl",
                                                typeClass[notification.type] ||
                                                    typeClass.info,
                                            )}
                                        >
                                            <Icon className="h-4 w-4" />
                                        </span>

                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate text-sm font-black text-ink-900">
                                                {notification.title}
                                            </span>
                                            <span className="mt-0.5 line-clamp-2 block text-xs leading-5 text-ink-500">
                                                {notification.message}
                                            </span>
                                            <span className="mt-1 block text-[10px] font-semibold text-ink-400">
                                                {
                                                    notification.created_at_human
                                                }
                                            </span>
                                        </span>

                                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-600" />
                                    </button>
                                );
                            })
                        )}
                    </div>

                    <Link
                        href={route("admin.notifications.index")}
                        onClick={() => setOpen(false)}
                        className="block border-t border-ink-100 bg-ink-50 px-5 py-3.5 text-center text-sm font-black text-brand-700 transition hover:bg-brand-50"
                    >
                        View notification center
                    </Link>
                </div>
            )}
        </div>
    );
}

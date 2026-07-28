import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Bell, Check, CheckCheck, Search, Trash2, Undo2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function Index({ notifications, filters = {}, unreadCount = 0 }) {
    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status || "all");
    const [type, setType] = useState(filters.type || "");

    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(route("admin.notifications.index"), {
                search: search || undefined,
                status: status === "all" ? undefined : status,
                type: type || undefined,
            }, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ["notifications", "filters", "unreadCount", "notificationsSummary"],
            });
        }, 350);

        return () => clearTimeout(timer);
    }, [search, status, type]);

    const markRead = (id) => router.patch(route("admin.notifications.read", id), {}, { preserveScroll: true });
    const markUnread = (id) => router.patch(route("admin.notifications.unread", id), {}, { preserveScroll: true });
    const remove = (id) => {
        if (window.confirm("Delete this notification?")) {
            router.delete(route("admin.notifications.destroy", id), { preserveScroll: true });
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-bold text-gray-900">Notification Centre</h2>}>
            <Head title="Notifications" />

            <div className="space-y-5">
                <div className="flex flex-col justify-between gap-3 rounded-2xl border bg-white p-5 shadow-sm md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                        <p className="mt-1 text-sm text-gray-500">Review system alerts, due reminders and security messages.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => router.patch(route("admin.notifications.read-all"), {}, { preserveScroll: true })}
                            disabled={unreadCount === 0}
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <CheckCheck className="h-4 w-4" /> Mark all read
                        </button>
                        <button
                            type="button"
                            onClick={() => window.confirm("Delete all read notifications?") && router.delete(route("admin.notifications.destroy-read"), { preserveScroll: true })}
                            className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                        >
                            <Trash2 className="h-4 w-4" /> Clear read
                        </button>
                    </div>
                </div>

                <div className="grid gap-3 rounded-2xl border bg-white p-4 shadow-sm md:grid-cols-[1fr_180px_180px]">
                    <label className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search notifications..."
                            className="w-full rounded-xl border-gray-300 py-2.5 pl-10 text-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </label>
                    <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-xl border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500">
                        <option value="all">All status</option>
                        <option value="unread">Unread</option>
                        <option value="read">Read</option>
                    </select>
                    <select value={type} onChange={(event) => setType(event.target.value)} className="rounded-xl border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500">
                        <option value="">All types</option>
                        <option value="info">Information</option>
                        <option value="success">Success</option>
                        <option value="warning">Warning</option>
                        <option value="danger">Danger</option>
                    </select>
                </div>

                <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                    {notifications.data.length === 0 ? (
                        <div className="px-6 py-16 text-center">
                            <Bell className="mx-auto h-12 w-12 text-gray-300" />
                            <h3 className="mt-4 font-semibold text-gray-800">No notifications found</h3>
                            <p className="mt-1 text-sm text-gray-500">Try changing your search or filters.</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {notifications.data.map((notification) => (
                                <article key={notification.id} className={`flex flex-col gap-3 p-5 transition md:flex-row md:items-center ${notification.is_read ? "bg-white" : "bg-blue-50/60"}`}>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="font-bold text-gray-900">{notification.title}</h3>
                                            <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold uppercase ${notification.type === "danger" ? "bg-red-100 text-red-700" : notification.type === "warning" ? "bg-amber-100 text-amber-700" : notification.type === "success" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>
                                                {notification.type}
                                            </span>
                                            {!notification.is_read && <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-bold text-white">Unread</span>}
                                        </div>
                                        <p className="mt-1 text-sm leading-6 text-gray-600">{notification.message}</p>
                                        <p className="mt-2 text-xs text-gray-400">{notification.created_at_human}</p>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-2">
                                        {notification.url && (
                                            <Link href={notification.url} className="rounded-lg border px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50">Open</Link>
                                        )}
                                        {notification.is_read ? (
                                            <button type="button" onClick={() => markUnread(notification.id)} className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"><Undo2 className="h-3.5 w-3.5" /> Unread</button>
                                        ) : (
                                            <button type="button" onClick={() => markRead(notification.id)} className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"><Check className="h-3.5 w-3.5" /> Read</button>
                                        )}
                                        <button type="button" onClick={() => remove(notification.id)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    {notifications.links?.length > 3 && (
                        <div className="flex flex-wrap items-center justify-center gap-1 border-t bg-gray-50 px-4 py-4">
                            {notifications.links.map((link, index) => (
                                link.url ? (
                                    <Link key={index} href={link.url} preserveScroll preserveState className={`rounded-lg border px-3 py-1.5 text-sm ${link.active ? "border-blue-600 bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                                ) : (
                                    <span key={index} className="rounded-lg border bg-gray-100 px-3 py-1.5 text-sm text-gray-400" dangerouslySetInnerHTML={{ __html: link.label }} />
                                )
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

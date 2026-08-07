import { Link, usePage } from "@inertiajs/react";
import {
    Activity,
    ArrowUpRight,
    CheckCircle2,
    CircleDot,
} from "lucide-react";

export default function ActivityTimeline({ activities = [] }) {
    const { auth = {} } = usePage().props;
    const canView =
        (auth.roles || []).includes("Super Admin") ||
        (auth.permissions || []).includes("activity-logs.view");

    return (
        <section className="rounded-3xl border border-ink-200 bg-white p-5 shadow-soft">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-sky-50 text-sky-700">
                        <Activity size={19} />
                    </span>
                    <div>
                        <h2 className="font-black text-ink-950">
                            Recent activity
                        </h2>
                        <p className="mt-0.5 text-xs text-ink-400">
                            Latest system and security actions
                        </p>
                    </div>
                </div>

                {canView && (
                    <Link
                        href={route("admin.activity-logs.index")}
                        className="inline-flex items-center gap-1 text-xs font-black text-brand-700"
                    >
                        View all
                        <ArrowUpRight size={13} />
                    </Link>
                )}
            </div>

            <div className="mt-5">
                {activities.length > 0 ? (
                    <div className="relative space-y-1 before:absolute before:bottom-3 before:left-[17px] before:top-3 before:w-px before:bg-ink-200">
                        {activities.slice(0, 7).map((activity, index) => (
                            <div
                                key={activity.id}
                                className="relative flex gap-3 rounded-2xl px-1 py-3"
                            >
                                <span className="relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-brand-100 bg-brand-50 text-brand-700">
                                    {index === 0 ? (
                                        <CircleDot size={16} />
                                    ) : (
                                        <CheckCircle2 size={15} />
                                    )}
                                </span>

                                <div className="min-w-0 flex-1">
                                    <p className="line-clamp-2 text-sm font-bold leading-5 text-ink-700">
                                        {activity.description}
                                    </p>
                                    <p className="mt-1 truncate text-[10px] font-medium capitalize text-ink-400">
                                        {activity.user} · {activity.module} ·{" "}
                                        {activity.created_at}
                                    </p>
                                </div>

                                <span className="h-fit rounded-full bg-ink-100 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-ink-500">
                                    {activity.action}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-ink-200 bg-ink-50/60 px-5 py-10 text-center">
                        <Activity
                            className="mx-auto text-ink-300"
                            size={28}
                        />
                        <p className="mt-3 text-sm font-black text-ink-600">
                            No recent activity
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}

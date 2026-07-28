import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState } from "react";
import { Download, Filter, Printer, RotateCcw, Search } from "lucide-react";

export default function Index({ logs, filters = {}, users = [], modules = [], actions = [] }) {
    const [form, setForm] = useState({
        search: filters.search || "", user_id: filters.user_id || "", module: filters.module || "",
        action: filters.action || "", from: filters.from || "", to: filters.to || "", per_page: filters.per_page || 20,
    });
    const applyFilters = (event) => { event.preventDefault(); router.get(route("admin.activity-logs.index"), form, { preserveState: true, replace: true }); };
    const query = new URLSearchParams(Object.entries(form).filter(([, value]) => value !== "")).toString();
    const badge = (action) => ({ created: "bg-emerald-100 text-emerald-700", updated: "bg-blue-100 text-blue-700", deleted: "bg-rose-100 text-rose-700", login: "bg-violet-100 text-violet-700", logout: "bg-slate-100 text-slate-700" }[action] || "bg-amber-100 text-amber-700");

    return <AuthenticatedLayout><Head title="Activity Logs" /><div id="print-invoice" className="mx-auto max-w-[1600px] space-y-6">
        <section className="flex flex-col gap-4 rounded-2xl bg-slate-950 p-6 text-white shadow-lg md:flex-row md:items-center md:justify-between">
            <div><p className="text-sm font-semibold text-blue-300">Security & Audit</p><h1 className="mt-1 text-3xl font-black">Activity Logs</h1><p className="mt-2 text-sm text-slate-300">Review user actions, logins, IP addresses and system changes.</p></div>
            <div className="flex gap-2 print:hidden"><button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold"><Printer className="h-4 w-4" /> Print</button><a href={`${route("admin.activity-logs.export")}?${query}`} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold"><Download className="h-4 w-4" /> Export CSV</a></div>
        </section>
        <form onSubmit={applyFilters} className="grid gap-3 rounded-2xl border bg-white p-4 shadow-sm md:grid-cols-2 xl:grid-cols-7 print:hidden">
            <div className="relative xl:col-span-2"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input value={form.search} onChange={e => setForm({...form, search:e.target.value})} placeholder="Search description, user or IP" className="w-full rounded-xl border-slate-300 pl-9 text-sm" /></div>
            <select value={form.user_id} onChange={e => setForm({...form,user_id:e.target.value})} className="rounded-xl border-slate-300 text-sm"><option value="">All users</option>{users.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select>
            <select value={form.module} onChange={e => setForm({...form,module:e.target.value})} className="rounded-xl border-slate-300 text-sm"><option value="">All modules</option>{modules.map(x=><option key={x} value={x}>{x}</option>)}</select>
            <select value={form.action} onChange={e => setForm({...form,action:e.target.value})} className="rounded-xl border-slate-300 text-sm"><option value="">All actions</option>{actions.map(x=><option key={x} value={x}>{x}</option>)}</select>
            <input type="date" value={form.from} onChange={e => setForm({...form,from:e.target.value})} className="rounded-xl border-slate-300 text-sm" /><input type="date" value={form.to} onChange={e => setForm({...form,to:e.target.value})} className="rounded-xl border-slate-300 text-sm" />
            <div className="flex gap-2 xl:col-span-7 xl:justify-end"><select value={form.per_page} onChange={e => setForm({...form,per_page:e.target.value})} className="rounded-xl border-slate-300 text-sm"><option value="10">10 rows</option><option value="20">20 rows</option><option value="50">50 rows</option><option value="100">100 rows</option></select><button type="button" onClick={() => router.get(route("admin.activity-logs.index"))} className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold"><RotateCcw className="h-4 w-4" /> Reset</button><button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white"><Filter className="h-4 w-4" /> Apply</button></div>
        </form>
        <section className="overflow-hidden rounded-2xl border bg-white shadow-sm"><div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-200 text-sm"><thead className="bg-slate-50 text-left text-xs uppercase text-slate-500"><tr><th className="px-5 py-4">Date & Time</th><th className="px-5 py-4">User</th><th className="px-5 py-4">Module</th><th className="px-5 py-4">Action</th><th className="px-5 py-4">Description</th><th className="px-5 py-4">IP Address</th></tr></thead><tbody className="divide-y divide-slate-100">
            {logs.data.map(log=><tr key={log.id} className="hover:bg-slate-50"><td className="whitespace-nowrap px-5 py-4 text-slate-600">{new Date(log.created_at).toLocaleString("en-GB")}</td><td className="px-5 py-4"><p className="font-bold">{log.user?.name || "System"}</p><p className="text-xs text-slate-500">{log.user?.email || "Automated event"}</p></td><td className="px-5 py-4 capitalize">{log.module}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${badge(log.action)}`}>{log.action}</span></td><td className="max-w-md px-5 py-4"><p>{log.description}</p>{log.route_name && <p className="mt-1 text-xs text-slate-400">{log.method} · {log.route_name}</p>}</td><td className="whitespace-nowrap px-5 py-4 font-mono text-xs text-slate-500">{log.ip_address || "—"}</td></tr>)}
            {!logs.data.length && <tr><td colSpan="6" className="px-5 py-16 text-center text-slate-500">No activity logs found.</td></tr>}
        </tbody></table></div>{logs.links?.length > 3 && <div className="flex flex-wrap gap-2 border-t p-4 print:hidden">{logs.links.map((link,i)=>link.url?<Link key={i} href={link.url} preserveScroll className={`rounded-lg px-3 py-2 text-sm ${link.active?"bg-blue-600 text-white":"border"}`} dangerouslySetInnerHTML={{__html:link.label}}/>:<span key={i} className="px-3 py-2 text-slate-300" dangerouslySetInnerHTML={{__html:link.label}}/>)}</div>}</section>
    </div></AuthenticatedLayout>;
}

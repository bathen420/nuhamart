import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { Eye, Image, LayoutGrid, Megaphone, Save, Settings, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

const sectionLabels = {
    hero: "Hero & promotions",
    categories: "Popular categories",
    flash_sale: "Flash sale",
    featured: "Featured products",
    best_sellers: "Best sellers",
    new_arrivals: "New arrivals",
    ebooks: "E-book collection",
    authors_publishers: "Authors & publishers",
    trust: "Trust badges",
};

function Field({ label, children }) {
    return <label className="block"><span className="mb-1.5 block text-xs font-bold text-slate-600">{label}</span>{children}</label>;
}

const inputClass = "w-full rounded-xl border-slate-200 text-sm shadow-sm focus:border-teal-500 focus:ring-teal-500";

function BannerForm() {
    const { data, setData, post, processing, reset, errors } = useForm({
        badge: "", badge_bn: "", title: "", title_bn: "", highlight: "", highlight_bn: "",
        subtitle: "", subtitle_bn: "", primary_button_text: "Shop now", primary_button_text_bn: "",
        primary_button_url: "/shop", secondary_button_text: "", secondary_button_text_bn: "",
        secondary_button_url: "", image: null, mobile_image: null, background_from: "#ecfdf5",
        background_to: "#fef3c7", text_color: "#0f172a", sort_order: 0, is_active: true,
        starts_at: "", ends_at: "",
    });

    const submit = (event) => {
        event.preventDefault();
        post(route("admin.homepage-content.banners.store"), { forceFormData: true, preserveScroll: true, onSuccess: () => reset() });
    };

    return <form onSubmit={submit} className="space-y-4 rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3"><Image className="text-teal-700"/><div><h2 className="font-black">New hero slide</h2><p className="text-xs text-slate-500">Desktop/mobile artwork, bilingual copy and schedule.</p></div></div>
        <div className="grid gap-3 md:grid-cols-2">
            <Field label="Title (English)"><input className={inputClass} value={data.title} onChange={e=>setData("title",e.target.value)} required/></Field>
            <Field label="Title (বাংলা)"><input className={inputClass} value={data.title_bn} onChange={e=>setData("title_bn",e.target.value)}/></Field>
            <Field label="Highlight"><input className={inputClass} value={data.highlight} onChange={e=>setData("highlight",e.target.value)}/></Field>
            <Field label="Highlight (বাংলা)"><input className={inputClass} value={data.highlight_bn} onChange={e=>setData("highlight_bn",e.target.value)}/></Field>
            <Field label="Desktop image"><input type="file" accept="image/*" className={inputClass} onChange={e=>setData("image",e.target.files[0])}/></Field>
            <Field label="Mobile image"><input type="file" accept="image/*" className={inputClass} onChange={e=>setData("mobile_image",e.target.files[0])}/></Field>
            <Field label="Button text"><input className={inputClass} value={data.primary_button_text} onChange={e=>setData("primary_button_text",e.target.value)}/></Field>
            <Field label="Button URL"><input className={inputClass} value={data.primary_button_url} onChange={e=>setData("primary_button_url",e.target.value)}/></Field>
            <Field label="Starts at"><input type="datetime-local" className={inputClass} value={data.starts_at} onChange={e=>setData("starts_at",e.target.value)}/></Field>
            <Field label="Ends at"><input type="datetime-local" className={inputClass} value={data.ends_at} onChange={e=>setData("ends_at",e.target.value)}/></Field>
        </div>
        <Field label="Subtitle"><textarea className={inputClass} rows="2" value={data.subtitle} onChange={e=>setData("subtitle",e.target.value)}/></Field>
        {Object.keys(errors).length>0 && <p className="text-xs font-bold text-red-600">Please review the highlighted fields.</p>}
        <div className="flex items-center justify-between"><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={data.is_active} onChange={e=>setData("is_active",e.target.checked)}/> Active</label><button disabled={processing} className="rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-black text-white">Add slide</button></div>
    </form>;
}

function PromotionForm() {
    const { data, setData, post, processing, reset } = useForm({ title:"", title_bn:"", subtitle:"", subtitle_bn:"", button_text:"Explore", button_text_bn:"", button_url:"/shop", image:null, theme:"mint", sort_order:0, is_active:true, starts_at:"", ends_at:"" });
    const submit=(event)=>{event.preventDefault();post(route("admin.homepage-content.promotions.store"),{forceFormData:true,preserveScroll:true,onSuccess:()=>reset()});};
    return <form onSubmit={submit} className="space-y-4 rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3"><Megaphone className="text-amber-600"/><div><h2 className="font-black">New promotion card</h2><p className="text-xs text-slate-500">Small campaign block beside the hero.</p></div></div>
        <div className="grid gap-3 md:grid-cols-2">
            <Field label="Title"><input className={inputClass} required value={data.title} onChange={e=>setData("title",e.target.value)}/></Field>
            <Field label="Title (বাংলা)"><input className={inputClass} value={data.title_bn} onChange={e=>setData("title_bn",e.target.value)}/></Field>
            <Field label="Theme"><select className={inputClass} value={data.theme} onChange={e=>setData("theme",e.target.value)}><option value="mint">Mint</option><option value="purple">Purple</option><option value="orange">Orange</option><option value="blue">Blue</option></select></Field>
            <Field label="Image"><input type="file" accept="image/*" className={inputClass} onChange={e=>setData("image",e.target.files[0])}/></Field>
            <Field label="Button URL"><input className={inputClass} value={data.button_url} onChange={e=>setData("button_url",e.target.value)}/></Field>
            <Field label="Order"><input type="number" className={inputClass} value={data.sort_order} onChange={e=>setData("sort_order",e.target.value)}/></Field>
        </div>
        <Field label="Subtitle"><textarea className={inputClass} rows="2" value={data.subtitle} onChange={e=>setData("subtitle",e.target.value)}/></Field>
        <div className="flex items-center justify-between"><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={data.is_active} onChange={e=>setData("is_active",e.target.checked)}/> Active</label><button disabled={processing} className="rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-black text-white">Add promotion</button></div>
    </form>;
}

function SettingsForm({ settings, presets }) {
    const initialSections = useMemo(() => Object.entries(settings.sections || {}).map(([key,value])=>({key,enabled:value.enabled !== false,order:value.order || 10})), [settings]);
    const { data, setData, put, processing } = useForm({
        preset: settings.general?.preset || "book_store",
        announcement_enabled: settings.general?.announcement_enabled !== false,
        announcement_text: settings.general?.announcement_text || "",
        announcement_text_bn: settings.general?.announcement_text_bn || "",
        announcement_url: settings.general?.announcement_url || "/shop",
        cache_minutes: settings.general?.cache_minutes || 15,
        sections: initialSections,
    });
    const updateSection=(index,field,value)=>setData("sections",data.sections.map((item,i)=>i===index?{...item,[field]:value}:item));
    const submit=(event)=>{event.preventDefault();put(route("admin.homepage-content.settings.update"),{preserveScroll:true});};
    return <form onSubmit={submit} className="space-y-6">
        <section className="rounded-2xl border bg-white p-5 shadow-sm"><div className="mb-4 flex items-center gap-3"><LayoutGrid className="text-teal-700"/><div><h2 className="font-black">Layout preset</h2><p className="text-xs text-slate-500">Choose a business-focused starting layout.</p></div></div><div className="grid gap-3 md:grid-cols-4">{presets.map(preset=><button type="button" key={preset.key} onClick={()=>setData("preset",preset.key)} className={`rounded-2xl border p-4 text-left transition ${data.preset===preset.key?"border-teal-600 bg-teal-50 ring-2 ring-teal-100":"hover:border-slate-300"}`}><b className="block text-sm">{preset.label}</b><span className="mt-1 block text-xs leading-5 text-slate-500">{preset.description}</span></button>)}</div></section>
        <section className="rounded-2xl border bg-white p-5 shadow-sm"><h2 className="font-black">Announcement bar</h2><div className="mt-4 grid gap-3 md:grid-cols-2"><Field label="English"><input className={inputClass} value={data.announcement_text} onChange={e=>setData("announcement_text",e.target.value)}/></Field><Field label="বাংলা"><input className={inputClass} value={data.announcement_text_bn} onChange={e=>setData("announcement_text_bn",e.target.value)}/></Field><Field label="Destination URL"><input className={inputClass} value={data.announcement_url} onChange={e=>setData("announcement_url",e.target.value)}/></Field><Field label="Cache minutes"><input type="number" className={inputClass} value={data.cache_minutes} onChange={e=>setData("cache_minutes",e.target.value)}/></Field></div><label className="mt-4 flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={data.announcement_enabled} onChange={e=>setData("announcement_enabled",e.target.checked)}/> Show announcement</label></section>
        <section className="rounded-2xl border bg-white p-5 shadow-sm"><h2 className="font-black">Homepage sections</h2><p className="mt-1 text-xs text-slate-500">Enable, disable and order customer-facing sections.</p><div className="mt-4 divide-y">{data.sections.map((section,index)=><div key={section.key} className="flex items-center gap-4 py-3"><input type="checkbox" checked={section.enabled} onChange={e=>updateSection(index,"enabled",e.target.checked)}/><span className="flex-1 text-sm font-bold">{sectionLabels[section.key] || section.key}</span><input type="number" min="1" className="w-24 rounded-lg border-slate-200 text-sm" value={section.order} onChange={e=>updateSection(index,"order",Number(e.target.value))}/></div>)}</div></section>
        <button disabled={processing} className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-black text-white"><Save size={17}/> Save homepage settings</button>
    </form>;
}

export default function Index({ banners = [], promotions = [], settings = {}, presets = [] }) {
    const [tab,setTab]=useState("settings");
    const remove=(url)=>{if(confirm("Delete this homepage item?"))router.delete(url,{preserveScroll:true});};
    return <AuthenticatedLayout header={<div><h1 className="text-2xl font-black">Homepage CMS</h1><p className="text-sm text-slate-500">Control layout, campaigns and storefront visibility without editing code.</p></div>}>
        <Head title="Homepage CMS"/>
        <div className="space-y-6 p-6">
            <div className="flex flex-wrap gap-2">{[["settings",Settings,"Settings"],["content",Image,"Banners & promotions"],["preview",Eye,"Preview"]].map(([key,Icon,label])=><button key={key} onClick={()=>setTab(key)} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold ${tab===key?"bg-slate-900 text-white":"border bg-white text-slate-700"}`}><Icon size={16}/>{label}</button>)}</div>
            {tab==="settings" && <SettingsForm settings={settings} presets={presets}/>} 
            {tab==="content" && <><div className="grid gap-6 xl:grid-cols-2"><BannerForm/><PromotionForm/></div><section><h2 className="mb-4 text-xl font-black">Hero slides</h2><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{banners.map(item=><article key={item.id} className="rounded-2xl border bg-white p-5 shadow-sm"><div className="h-24 rounded-xl" style={{background:`linear-gradient(120deg,${item.background_from},${item.background_to})`}}/><h3 className="mt-4 font-black">{item.title} {item.highlight}</h3><p className="mt-1 text-xs text-slate-500">Order {item.sort_order} · {item.is_active?"Active":"Inactive"}</p><button onClick={()=>remove(route("admin.homepage-content.banners.destroy",item.id))} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-red-600"><Trash2 size={16}/> Delete</button></article>)}</div></section><section><h2 className="mb-4 text-xl font-black">Promotion cards</h2><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{promotions.map(item=><article key={item.id} className="rounded-2xl border bg-white p-5 shadow-sm"><h3 className="font-black">{item.title}</h3><p className="mt-2 text-sm text-slate-500">{item.subtitle}</p><button onClick={()=>remove(route("admin.homepage-content.promotions.destroy",item.id))} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-red-600"><Trash2 size={16}/> Delete</button></article>)}</div></section></>}
            {tab==="preview" && <div className="rounded-2xl border bg-white p-8 text-center shadow-sm"><Eye className="mx-auto text-teal-700"/><h2 className="mt-3 text-xl font-black">Storefront preview</h2><p className="mt-2 text-sm text-slate-500">Open the public homepage in a new tab to review published content.</p><a href={route("home")} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-xl bg-teal-700 px-5 py-3 text-sm font-black text-white">Open homepage</a></div>}
        </div>
    </AuthenticatedLayout>;
}

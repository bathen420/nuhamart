import React, { useMemo, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import {
    CreditCard,
    FileImage,
    FileText,
    Image,
    Link2,
    MapPin,
    PackageCheck,
    RefreshCcw,
    Save,
    Search,
    Settings2,
    ShieldCheck,
    ShoppingCart,
    Upload,
    X,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Alert,
    Badge,
    Button,
    Card,
    CardBody,
    CardHeader,
    FormField,
    Input,
    PageHeader,
    Select,
    Textarea,
    Toggle,
} from "@/Components/Admin/UI";
import cn from "@/lib/cn";

const sections = [
    ["general", "General", "Business identity", Settings2, "company name tagline website"],
    ["branding", "Branding", "Logos & visual identity", Image, "logo favicon image"],
    ["contact", "Contact", "Phone, email & address", MapPin, "phone hotline whatsapp email address"],
    ["social", "Social Media", "Public social profiles", Link2, "facebook instagram youtube linkedin twitter tiktok telegram messenger"],
    ["seo", "SEO & Meta", "Search & sharing", Search, "seo meta title description keywords google bing twitter"],
    ["commerce", "Commerce", "Currency, tax & shipping", ShoppingCart, "currency tax shipping threshold"],
    ["payments", "Payments", "Customer payment options", CreditCard, "cod bkash nagad bank sslcommerz payment"],
    ["courier", "Courier", "Delivery integration", PackageCheck, "courier steadfast delivery sync"],
    ["documents", "Documents", "Invoice, POS & email", FileText, "invoice receipt pos email footer prefix"],
    ["advanced", "Advanced", "ERP defaults", ShieldCheck, "timezone erp prefix defaults"],
];

const brandingGroups = [
    ["Website", "Storefront and public website", [
        ["logo", "Main / Header Logo", "320 × 80"],
        ["white_logo", "White Logo", "320 × 80"],
        ["mobile_logo", "Mobile Logo", "180 × 60"],
        ["footer_logo", "Footer Logo", "320 × 80"],
    ]],
    ["Admin & Authentication", "Admin panel and login screens", [
        ["admin_logo", "Admin Logo", "260 × 80"],
        ["login_logo", "Login Logo", "260 × 80"],
        ["dark_logo", "Dark Logo", "320 × 80"],
    ]],
    ["Documents & Communication", "Invoices, receipts and emails", [
        ["invoice_logo", "Invoice / PDF Logo", "260 × 80"],
        ["pos_logo", "POS / Thermal Logo", "220 × 70"],
        ["email_logo", "Email Logo", "260 × 80"],
    ]],
    ["Browser & Social", "Browser icon and shared preview", [
        ["favicon", "Favicon", "64 × 64"],
        ["og_image", "Open Graph Image", "1200 × 630"],
    ]],
];

const imageFields = brandingGroups.flatMap(([, , fields]) =>
    fields.map(([name]) => name),
);

function LogoUploader({ form, setting, previews, setPreviews, name, label, size }) {
    const current = setting[`${name}_url`];
    const preview =
        previews[name] ||
        current ||
        (name !== "logo" ? previews.logo || setting.logo_url : null);

    return (
        <div className="rounded-2xl border border-ink-200 bg-white p-4 shadow-sm transition hover:border-brand-200 hover:shadow-card">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-black text-ink-900">{label}</p>
                    <p className="mt-1 text-xs text-ink-400">{size}</p>
                </div>
                {current && <Badge tone="success">Active</Badge>}
            </div>

            <div className="mt-4 grid h-24 place-items-center rounded-xl border border-dashed border-ink-200 bg-ink-50 p-3">
                {preview ? (
                    <img src={preview} alt={label} className="max-h-16 max-w-full object-contain" />
                ) : (
                    <FileImage size={28} className="text-ink-300" />
                )}
            </div>

            <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-ink-200 px-3 py-2 text-xs font-black text-ink-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700">
                <Upload size={14} />
                Choose file
                <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/x-icon"
                    className="hidden"
                    onChange={(event) => {
                        const file = event.target.files?.[0] || null;
                        form.setData(name, file);
                        if (file) {
                            setPreviews((value) => ({
                                ...value,
                                [name]: URL.createObjectURL(file),
                            }));
                            form.setData(`remove_${name}`, false);
                        }
                    }}
                />
            </label>

            {current && (
                <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs font-bold text-rose-600">
                    <input
                        type="checkbox"
                        checked={Boolean(form.data[`remove_${name}`])}
                        onChange={(event) =>
                            form.setData(`remove_${name}`, event.target.checked)
                        }
                    />
                    Remove current file
                </label>
            )}

            {form.errors[name] && (
                <p className="mt-2 text-xs font-semibold text-rose-600">
                    {form.errors[name]}
                </p>
            )}
        </div>
    );
}

function PreviewWorkspace({ form, setting, previews }) {
    const companyName = form.data.company_name || "NuhaMart";
    const tagline = form.data.company_tagline || "Everything You Need, All in One Place";
    const phone = form.data.hotline || form.data.phone || "01812-345678";
    const email = form.data.support_email || form.data.email || "support@example.com";
    const address = form.data.address || "Dhaka, Bangladesh";
    const logo = (name, fallback = "logo") =>
        previews[name] ||
        setting[`${name}_url`] ||
        (fallback ? previews[fallback] || setting[`${fallback}_url`] : null);

    return (
        <Card>
            <CardHeader title="Live preview" description="Preview changes before saving." />
            <CardBody className="space-y-5">
                <div>
                    <p className="mb-2 text-xs font-black uppercase tracking-[0.12em] text-ink-500">
                        Website header
                    </p>
                    <div className="overflow-hidden rounded-2xl border border-ink-200">
                        <div className="flex items-center justify-between gap-3 bg-white px-4 py-3">
                            <div className="flex items-center gap-2">
                                {logo("logo") ? (
                                    <img src={logo("logo")} alt={companyName} className="h-8 max-w-32 object-contain" />
                                ) : (
                                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-700 text-xs font-black text-white">
                                        {companyName.charAt(0)}
                                    </span>
                                )}
                                {!logo("logo") && (
                                    <span className="text-sm font-black text-ink-900">{companyName}</span>
                                )}
                            </div>
                            <span className="text-[10px] text-ink-400">{phone}</span>
                        </div>
                        <div className="flex gap-4 bg-brand-700 px-4 py-2 text-[10px] font-semibold text-white">
                            <span>Home</span><span>Shop</span><span>Categories</span><span>Offers</span>
                        </div>
                    </div>
                </div>

                <div>
                    <p className="mb-2 text-xs font-black uppercase tracking-[0.12em] text-ink-500">
                        Website footer
                    </p>
                    <div className="rounded-2xl bg-ink-950 p-4 text-white">
                        {logo("footer_logo") || logo("white_logo") ? (
                            <img
                                src={logo("footer_logo") || logo("white_logo")}
                                alt={companyName}
                                className="h-8 max-w-32 object-contain"
                            />
                        ) : (
                            <p className="text-sm font-black">{companyName}</p>
                        )}
                        <p className="mt-3 text-[10px] leading-5 text-slate-300">
                            {form.data.footer_description || tagline}
                        </p>
                        <div className="mt-3 space-y-1 text-[10px] text-slate-400">
                            <p>{phone}</p><p>{email}</p><p>{address}</p>
                        </div>
                    </div>
                </div>

                <div>
                    <p className="mb-2 text-xs font-black uppercase tracking-[0.12em] text-ink-500">
                        Invoice
                    </p>
                    <div className="rounded-2xl border border-ink-200 p-4">
                        <div className="flex items-start justify-between border-b border-ink-100 pb-3">
                            <div>
                                {logo("invoice_logo") ? (
                                    <img src={logo("invoice_logo")} alt={companyName} className="h-7 max-w-28 object-contain" />
                                ) : (
                                    <p className="text-sm font-black text-ink-900">{companyName}</p>
                                )}
                                <p className="mt-1 text-[9px] text-ink-400">{email}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-black text-ink-900">INVOICE</p>
                                <p className="text-[9px] font-bold text-brand-700">#INV-0001</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <p className="mb-2 text-xs font-black uppercase tracking-[0.12em] text-ink-500">
                        Login screen
                    </p>
                    <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-ink-200">
                        <div className="grid min-h-32 place-items-center bg-brand-700 p-4 text-center text-white">
                            {logo("login_logo") ? (
                                <img src={logo("login_logo")} alt={companyName} className="mx-auto h-8 max-w-28 object-contain" />
                            ) : (
                                <p className="text-sm font-black">{companyName}</p>
                            )}
                        </div>
                        <div className="space-y-2 bg-white p-4">
                            <div className="h-7 rounded-md bg-ink-100" />
                            <div className="h-7 rounded-md bg-ink-100" />
                            <div className="h-7 rounded-md bg-brand-600" />
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}

export default function Edit({ setting, timezones = [] }) {
    const defaults = {
        company_name: "", short_name: "", company_tagline: "", address: "",
        google_map_embed: "", phone: "", hotline: "", whatsapp: "", email: "",
        support_email: "", reply_to_email: "", support_hours: "", website: "",
        facebook_url: "", instagram_url: "", youtube_url: "", linkedin_url: "",
        twitter_url: "", tiktok_url: "", telegram_url: "", messenger_url: "",
        seo_title: "", seo_description: "", seo_keywords: "",
        google_verification: "", bing_verification: "",
        twitter_card: "summary_large_image", footer_description: "",
        copyright_text: "", invoice_footer: "", receipt_footer: "",
        email_footer: "", currency_code: "BDT", currency_symbol: "৳",
        timezone: "Asia/Dhaka", tax_rate: 0, tax_enabled: false,
        shipping_dhaka: 60, shipping_outside_dhaka: 120,
        free_shipping_threshold: "", default_payment_method: "Cash",
        cod_enabled: true, bkash_enabled: false, nagad_enabled: false,
        bank_enabled: false, sslcommerz_enabled: false,
        store_pickup_enabled: true, bkash_number: "", nagad_number: "",
        bank_payment_instructions: "", sales_prefix: "INV",
        purchase_prefix: "PUR", sales_return_prefix: "SRN",
        purchase_return_prefix: "PRN", steadfast_enabled: false,
        default_courier: "steadfast", courier_sync_minutes: 15, _method: "patch",
    };

    imageFields.forEach((name) => {
        defaults[name] = null;
        defaults[`remove_${name}`] = false;
    });

    const form = useForm({
        ...defaults,
        ...setting,
        ...Object.fromEntries(imageFields.map((name) => [name, null])),
    });

    const [active, setActive] = useState("general");
    const [query, setQuery] = useState("");
    const [previews, setPreviews] = useState({});

    const filteredSections = useMemo(() => {
        const term = query.trim().toLowerCase();
        if (!term) return sections;
        return sections.filter(([key, label, description, , keywords]) =>
            `${key} ${label} ${description} ${keywords}`.toLowerCase().includes(term),
        );
    }, [query]);

    const submit = (event) => {
        event.preventDefault();
        form.post(route("admin.settings.update"), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const valueField = (name, label, type = "text") => (
        <FormField label={label} error={form.errors[name]}>
            <Input
                type={type}
                value={form.data[name] || ""}
                onChange={(event) => form.setData(name, event.target.value)}
                invalid={Boolean(form.errors[name])}
            />
        </FormField>
    );

    return (
        <AuthenticatedLayout>
            <Head title="Enterprise Business Settings" />

            <form onSubmit={submit} className="space-y-6">
                <PageHeader
                    eyebrow="System configuration"
                    title="Business Settings"
                    description="Manage company identity, branding, payments, delivery, SEO and document preferences from one workspace."
                    actions={
                        <>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                    form.setData({
                                        ...defaults,
                                        ...setting,
                                        ...Object.fromEntries(
                                            imageFields.map((name) => [name, null]),
                                        ),
                                    });
                                    setPreviews({});
                                }}
                            >
                                <RefreshCcw size={16} />
                                Reset
                            </Button>
                            <Button type="submit" loading={form.processing}>
                                <Save size={16} />
                                Save changes
                            </Button>
                        </>
                    }
                >
                    <div className="mt-3 flex flex-wrap gap-2">
                        <Badge tone="brand">Enterprise v6.3</Badge>
                        <Badge tone={form.isDirty ? "warning" : "success"} dot>
                            {form.isDirty ? "Unsaved changes" : "All changes saved"}
                        </Badge>
                    </div>
                </PageHeader>

                {Object.keys(form.errors).length > 0 && (
                    <Alert variant="danger" title="Some fields need attention">
                        Review the highlighted fields before saving.
                    </Alert>
                )}

                <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)] 2xl:grid-cols-[250px_minmax(0,1fr)_390px]">
                    <aside className="h-fit lg:sticky lg:top-28">
                        <Card>
                            <CardBody className="p-3">
                                <div className="relative mb-3">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                                    <Input
                                        value={query}
                                        onChange={(event) => setQuery(event.target.value)}
                                        placeholder="Search settings..."
                                        className="pl-9 pr-9"
                                    />
                                    {query && (
                                        <button
                                            type="button"
                                            onClick={() => setQuery("")}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700"
                                        >
                                            <X size={15} />
                                        </button>
                                    )}
                                </div>

                                <nav className="space-y-1">
                                    {filteredSections.map(([key, label, description, Icon]) => {
                                        const selected = active === key;
                                        return (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => setActive(key)}
                                                className={cn(
                                                    "flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition",
                                                    selected
                                                        ? "border-brand-200 bg-brand-50 text-brand-800"
                                                        : "border-transparent text-ink-600 hover:bg-ink-50",
                                                )}
                                            >
                                                <span className={cn(
                                                    "grid h-9 w-9 shrink-0 place-items-center rounded-xl",
                                                    selected ? "bg-white text-brand-700 shadow-sm" : "bg-ink-50 text-ink-500",
                                                )}>
                                                    <Icon size={18} />
                                                </span>
                                                <span className="min-w-0">
                                                    <span className="block text-sm font-black">{label}</span>
                                                    <span className="mt-0.5 block truncate text-[11px] text-ink-400">
                                                        {description}
                                                    </span>
                                                </span>
                                            </button>
                                        );
                                    })}
                                </nav>
                            </CardBody>
                        </Card>
                    </aside>

                    <main className="min-w-0 space-y-6">
                        {active === "general" && (
                            <Card>
                                <CardHeader title="General information" description="Core identity and website information." />
                                <CardBody className="grid gap-5 md:grid-cols-2">
                                    {valueField("company_name", "Company name")}
                                    {valueField("short_name", "Short name")}
                                    <div className="md:col-span-2">{valueField("company_tagline", "Tagline")}</div>
                                    {valueField("website", "Website URL")}
                                    {valueField("support_hours", "Support hours")}
                                    <FormField label="Footer description" className="md:col-span-2">
                                        <Textarea
                                            value={form.data.footer_description}
                                            onChange={(event) => form.setData("footer_description", event.target.value)}
                                        />
                                    </FormField>
                                    <div className="md:col-span-2">{valueField("copyright_text", "Copyright text")}</div>
                                </CardBody>
                            </Card>
                        )}

                        {active === "branding" && (
                            <div className="space-y-6">
                                <Alert variant="info" title="Smart logo fallback">
                                    Dedicated logo না দিলে Main Logo স্বয়ংক্রিয়ভাবে ব্যবহার হবে।
                                </Alert>
                                {brandingGroups.map(([title, subtitle, fields]) => (
                                    <Card key={title}>
                                        <CardHeader title={title} description={subtitle} />
                                        <CardBody className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                            {fields.map(([name, label, size]) => (
                                                <LogoUploader
                                                    key={name}
                                                    form={form}
                                                    setting={setting}
                                                    previews={previews}
                                                    setPreviews={setPreviews}
                                                    name={name}
                                                    label={label}
                                                    size={size}
                                                />
                                            ))}
                                        </CardBody>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {active === "contact" && (
                            <Card>
                                <CardHeader title="Contact information" description="Public phone, email and business location details." />
                                <CardBody className="grid gap-5 md:grid-cols-2">
                                    {valueField("phone", "Phone")}
                                    {valueField("hotline", "Hotline")}
                                    {valueField("whatsapp", "WhatsApp")}
                                    {valueField("email", "Business email", "email")}
                                    {valueField("support_email", "Support email", "email")}
                                    {valueField("reply_to_email", "Reply-to email", "email")}
                                    <FormField label="Office address" className="md:col-span-2">
                                        <Textarea value={form.data.address} onChange={(event) => form.setData("address", event.target.value)} />
                                    </FormField>
                                    <FormField label="Google Map embed" className="md:col-span-2">
                                        <Textarea rows={5} value={form.data.google_map_embed} onChange={(event) => form.setData("google_map_embed", event.target.value)} />
                                    </FormField>
                                </CardBody>
                            </Card>
                        )}

                        {active === "social" && (
                            <Card>
                                <CardHeader title="Social media" description="Public profile links displayed across your storefront." />
                                <CardBody className="grid gap-5 md:grid-cols-2">
                                    {[
                                        ["facebook_url", "Facebook URL"], ["instagram_url", "Instagram URL"],
                                        ["youtube_url", "YouTube URL"], ["linkedin_url", "LinkedIn URL"],
                                        ["twitter_url", "X / Twitter URL"], ["tiktok_url", "TikTok URL"],
                                        ["telegram_url", "Telegram URL"], ["messenger_url", "Messenger URL"],
                                    ].map(([name, label]) => (
                                        <React.Fragment key={name}>{valueField(name, label)}</React.Fragment>
                                    ))}
                                </CardBody>
                            </Card>
                        )}

                        {active === "seo" && (
                            <Card>
                                <CardHeader title="SEO & social sharing" description="Default search-engine and social-preview metadata." />
                                <CardBody className="space-y-5">
                                    {valueField("seo_title", "Default site title")}
                                    <FormField label="Meta description">
                                        <Textarea value={form.data.seo_description} onChange={(event) => form.setData("seo_description", event.target.value)} />
                                    </FormField>
                                    <FormField label="Meta keywords">
                                        <Textarea rows={3} value={form.data.seo_keywords} onChange={(event) => form.setData("seo_keywords", event.target.value)} />
                                    </FormField>
                                    <div className="grid gap-5 md:grid-cols-2">
                                        {valueField("google_verification", "Google verification")}
                                        {valueField("bing_verification", "Bing verification")}
                                    </div>
                                    <FormField label="Twitter card">
                                        <Select value={form.data.twitter_card} onChange={(event) => form.setData("twitter_card", event.target.value)}>
                                            <option value="summary_large_image">Summary with large image</option>
                                            <option value="summary">Summary</option>
                                        </Select>
                                    </FormField>
                                </CardBody>
                            </Card>
                        )}

                        {active === "commerce" && (
                            <Card>
                                <CardHeader title="Commerce" description="Currency, tax and delivery-charge configuration." />
                                <CardBody className="space-y-6">
                                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                        {valueField("currency_code", "Currency code")}
                                        {valueField("currency_symbol", "Currency symbol")}
                                        {valueField("tax_rate", "Tax rate", "number")}
                                        {valueField("shipping_dhaka", "Shipping — Dhaka", "number")}
                                        {valueField("shipping_outside_dhaka", "Shipping — Outside Dhaka", "number")}
                                        {valueField("free_shipping_threshold", "Free shipping threshold", "number")}
                                    </div>
                                    <Toggle
                                        checked={form.data.tax_enabled}
                                        onChange={(checked) => form.setData("tax_enabled", checked)}
                                        label="Enable tax calculation"
                                        description="Apply the configured tax rate during checkout."
                                    />
                                </CardBody>
                            </Card>
                        )}

                        {active === "payments" && (
                            <Card>
                                <CardHeader title="Payment options" description="Choose which payment methods customers can use." />
                                <CardBody className="space-y-6">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {[
                                            ["cod_enabled", "Cash on Delivery"], ["sslcommerz_enabled", "SSLCommerz"],
                                            ["bkash_enabled", "bKash"], ["nagad_enabled", "Nagad"],
                                            ["bank_enabled", "Bank Transfer"], ["store_pickup_enabled", "Store Pickup"],
                                        ].map(([name, label]) => (
                                            <Toggle
                                                key={name}
                                                checked={form.data[name]}
                                                onChange={(checked) => form.setData(name, checked)}
                                                label={label}
                                            />
                                        ))}
                                    </div>
                                    <div className="grid gap-5 md:grid-cols-2">
                                        {valueField("bkash_number", "bKash number")}
                                        {valueField("nagad_number", "Nagad number")}
                                        <FormField label="Bank payment instructions" className="md:col-span-2">
                                            <Textarea
                                                value={form.data.bank_payment_instructions}
                                                onChange={(event) => form.setData("bank_payment_instructions", event.target.value)}
                                            />
                                        </FormField>
                                    </div>
                                </CardBody>
                            </Card>
                        )}

                        {active === "courier" && (
                            <Card>
                                <CardHeader title="Courier" description="Courier visibility and synchronization." />
                                <CardBody className="grid gap-5 md:grid-cols-2">
                                    <Toggle
                                        checked={form.data.steadfast_enabled}
                                        onChange={(checked) => form.setData("steadfast_enabled", checked)}
                                        label="Enable Steadfast"
                                        description="Allow courier operations from the admin panel."
                                    />
                                    {valueField("courier_sync_minutes", "Sync interval (minutes)", "number")}
                                </CardBody>
                            </Card>
                        )}

                        {active === "documents" && (
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader title="Invoice & ERP prefixes" description="Numbering prefixes used by operational documents." />
                                    <CardBody className="grid gap-5 md:grid-cols-2">
                                        {valueField("sales_prefix", "Sales prefix")}
                                        {valueField("purchase_prefix", "Purchase prefix")}
                                        {valueField("sales_return_prefix", "Sales return prefix")}
                                        {valueField("purchase_return_prefix", "Purchase return prefix")}
                                    </CardBody>
                                </Card>
                                <Card>
                                    <CardHeader title="Document footers" description="Custom footer text for invoices, POS receipts and emails." />
                                    <CardBody className="space-y-5">
                                        <FormField label="Invoice footer">
                                            <Textarea value={form.data.invoice_footer} onChange={(event) => form.setData("invoice_footer", event.target.value)} />
                                        </FormField>
                                        <FormField label="POS / receipt footer">
                                            <Textarea value={form.data.receipt_footer} onChange={(event) => form.setData("receipt_footer", event.target.value)} />
                                        </FormField>
                                        <FormField label="Email footer">
                                            <Textarea value={form.data.email_footer} onChange={(event) => form.setData("email_footer", event.target.value)} />
                                        </FormField>
                                    </CardBody>
                                </Card>
                            </div>
                        )}

                        {active === "advanced" && (
                            <Card>
                                <CardHeader title="Advanced defaults" description="Localization and administrative defaults." />
                                <CardBody className="grid gap-5 md:grid-cols-2">
                                    <FormField label="Timezone">
                                        <Select value={form.data.timezone} onChange={(event) => form.setData("timezone", event.target.value)}>
                                            {timezones.map((timezone) => (
                                                <option key={timezone} value={timezone}>{timezone}</option>
                                            ))}
                                        </Select>
                                    </FormField>
                                    <FormField label="Default payment method">
                                        <Select
                                            value={form.data.default_payment_method}
                                            onChange={(event) => form.setData("default_payment_method", event.target.value)}
                                        >
                                            <option value="Cash">Cash</option>
                                            <option value="Card">Card</option>
                                            <option value="Bank Transfer">Bank Transfer</option>
                                            <option value="Mobile Banking">Mobile Banking</option>
                                        </Select>
                                    </FormField>
                                </CardBody>
                            </Card>
                        )}
                    </main>

                    <aside className="hidden h-fit 2xl:sticky 2xl:top-28 2xl:block">
                        <PreviewWorkspace form={form} setting={setting} previews={previews} />
                    </aside>
                </div>

                <div className="sticky bottom-4 z-20 flex justify-end 2xl:hidden">
                    <div className="flex items-center gap-3 rounded-2xl border border-ink-200 bg-white/95 p-2 shadow-floating backdrop-blur">
                        <span className="hidden px-2 text-xs font-bold text-ink-500 sm:block">
                            {form.isDirty ? "Unsaved changes" : "Settings are current"}
                        </span>
                        <Button type="submit" loading={form.processing}>
                            <Save size={16} />
                            Save
                        </Button>
                    </div>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}

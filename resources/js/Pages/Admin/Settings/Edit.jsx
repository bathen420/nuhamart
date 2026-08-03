import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const FieldError = ({ message }) => message ? <p className="mt-1 text-sm text-red-600">{message}</p> : null;

export default function Edit({ auth, setting, timezones }) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        company_name: setting.company_name ?? "Nuha Mart BD",
        company_tagline: setting.company_tagline ?? "",
        logo: null,
        remove_logo: false,
        address: setting.address ?? "",
        phone: setting.phone ?? "",
        email: setting.email ?? "",
        website: setting.website ?? "",
        facebook_url: setting.facebook_url ?? "",
        youtube_url: setting.youtube_url ?? "",
        currency_code: setting.currency_code ?? "BDT",
        currency_symbol: setting.currency_symbol ?? "৳",
        timezone: setting.timezone ?? "Asia/Dhaka",
        sales_prefix: setting.sales_prefix ?? "INV",
        purchase_prefix: setting.purchase_prefix ?? "PUR",
        sales_return_prefix: setting.sales_return_prefix ?? "SRN",
        purchase_return_prefix: setting.purchase_return_prefix ?? "PRN",
        tax_rate: setting.tax_rate ?? 0,
        shipping_dhaka: setting.shipping_dhaka ?? 60,
        shipping_outside_dhaka: setting.shipping_outside_dhaka ?? 120,
        free_shipping_threshold: setting.free_shipping_threshold ?? "",
        default_payment_method: setting.default_payment_method ?? "Cash",
        bkash_number: setting.bkash_number ?? "",
        nagad_number: setting.nagad_number ?? "",
        bank_payment_instructions: setting.bank_payment_instructions ?? "",
        steadfast_enabled: Boolean(setting.steadfast_enabled),
        default_courier: setting.default_courier ?? "steadfast",
        courier_sync_minutes: setting.courier_sync_minutes ?? 15,
        invoice_footer: setting.invoice_footer ?? "",
        _method: "patch",
    });

    const submit = (event) => {
        event.preventDefault();
        post(route("admin.settings.update"), { forceFormData: true, preserveScroll: true });
    };

    const inputClass = "mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500";

    return (
        <AuthenticatedLayout user={auth?.user} header={<h2 className="text-xl font-semibold text-gray-800">Business Settings</h2>}>
            <Head title="Business Settings" />
            <div className="py-8">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-6">
                        <section className="rounded-xl bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
                            <div className="mt-5 grid gap-5 md:grid-cols-2">
                                <label className="block">Company Name<input className={inputClass} value={data.company_name} onChange={e => setData("company_name", e.target.value)} /><FieldError message={errors.company_name} /></label>
                                <label className="block">Tagline<input className={inputClass} value={data.company_tagline} onChange={e => setData("company_tagline", e.target.value)} /><FieldError message={errors.company_tagline} /></label>
                                <label className="block">Phone<input className={inputClass} value={data.phone} onChange={e => setData("phone", e.target.value)} /><FieldError message={errors.phone} /></label>
                                <label className="block">Email<input type="email" className={inputClass} value={data.email} onChange={e => setData("email", e.target.value)} /><FieldError message={errors.email} /></label>
                                <label className="block">Website<input placeholder="https://example.com" className={inputClass} value={data.website} onChange={e => setData("website", e.target.value)} /><FieldError message={errors.website} /></label>
                                <label className="block">Logo<input type="file" accept="image/png,image/jpeg,image/webp" className={inputClass} onChange={e => setData("logo", e.target.files[0])} /><FieldError message={errors.logo} /></label>
                                <label className="block">Facebook URL<input className={inputClass} value={data.facebook_url} onChange={e => setData("facebook_url", e.target.value)} /><FieldError message={errors.facebook_url} /></label>
                                <label className="block">YouTube URL<input className={inputClass} value={data.youtube_url} onChange={e => setData("youtube_url", e.target.value)} /><FieldError message={errors.youtube_url} /></label>
                                <label className="block md:col-span-2">Address<textarea rows="3" className={inputClass} value={data.address} onChange={e => setData("address", e.target.value)} /><FieldError message={errors.address} /></label>
                            </div>
                            {setting.logo && <div className="mt-4 flex items-center gap-4"><img src={setting.logo} className="h-16 w-16 rounded-lg border object-contain" alt="Business logo" /><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={data.remove_logo} onChange={e => setData("remove_logo", e.target.checked)} /> Remove current logo</label></div>}
                        </section>

                        <section className="rounded-xl bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900">Currency, Tax & Time</h3>
                            <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                                <label>Currency Code<input className={inputClass} value={data.currency_code} onChange={e => setData("currency_code", e.target.value.toUpperCase())} /><FieldError message={errors.currency_code} /></label>
                                <label>Currency Symbol<input className={inputClass} value={data.currency_symbol} onChange={e => setData("currency_symbol", e.target.value)} /><FieldError message={errors.currency_symbol} /></label>
                                <label>Tax Rate (%)<input type="number" min="0" max="100" step="0.01" className={inputClass} value={data.tax_rate} onChange={e => setData("tax_rate", e.target.value)} /><FieldError message={errors.tax_rate} /></label>
                                <label>Shipping — Dhaka<input type="number" min="0" step="0.01" className={inputClass} value={data.shipping_dhaka} onChange={e => setData("shipping_dhaka", e.target.value)} /><FieldError message={errors.shipping_dhaka} /></label>
                                <label>Shipping — Outside Dhaka<input type="number" min="0" step="0.01" className={inputClass} value={data.shipping_outside_dhaka} onChange={e => setData("shipping_outside_dhaka", e.target.value)} /><FieldError message={errors.shipping_outside_dhaka} /></label>
                                <label>Free Shipping Threshold<input type="number" min="0" step="0.01" className={inputClass} value={data.free_shipping_threshold} onChange={e => setData("free_shipping_threshold", e.target.value)} /><FieldError message={errors.free_shipping_threshold} /></label>
                                <label>Timezone<select className={inputClass} value={data.timezone} onChange={e => setData("timezone", e.target.value)}>{timezones.map(zone => <option key={zone}>{zone}</option>)}</select><FieldError message={errors.timezone} /></label>
                            </div>
                        </section>

                        <section className="rounded-xl bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900">Launch Payment Settings</h3>
                            <p className="mt-1 text-sm text-gray-500">Show customers the correct manual payment account information.</p>
                            <div className="mt-5 grid gap-5 md:grid-cols-2">
                                <label>bKash Number<input className={inputClass} value={data.bkash_number} onChange={e => setData("bkash_number", e.target.value)} /><FieldError message={errors.bkash_number} /></label>
                                <label>Nagad Number<input className={inputClass} value={data.nagad_number} onChange={e => setData("nagad_number", e.target.value)} /><FieldError message={errors.nagad_number} /></label>
                                <label className="md:col-span-2">Bank Payment Instructions<textarea rows="4" className={inputClass} value={data.bank_payment_instructions} onChange={e => setData("bank_payment_instructions", e.target.value)} /><FieldError message={errors.bank_payment_instructions} /></label>
                            </div>
                        </section>


                        <section className="rounded-xl bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900">Courier Settings</h3>
                            <p className="mt-1 text-sm text-gray-500">Credentials remain in .env. This panel controls whether the integration is available to admins.</p>
                            <div className="mt-5 grid gap-5 md:grid-cols-3">
                                <label className="flex items-center gap-3 rounded-lg border p-4">
                                    <input type="checkbox" checked={data.steadfast_enabled} onChange={e => setData("steadfast_enabled", e.target.checked)} />
                                    <span><span className="block font-semibold">Enable Steadfast</span><span className="text-xs text-gray-500">Requires STEADFAST_API_KEY and STEADFAST_SECRET_KEY in .env</span></span>
                                </label>
                                <label>Default Courier<select className={inputClass} value={data.default_courier} onChange={e => setData("default_courier", e.target.value)}><option value="steadfast">Steadfast</option></select><FieldError message={errors.default_courier} /></label>
                                <label>Sync Interval (minutes)<input type="number" min="5" max="1440" className={inputClass} value={data.courier_sync_minutes} onChange={e => setData("courier_sync_minutes", e.target.value)} /><FieldError message={errors.courier_sync_minutes} /></label>
                            </div>
                        </section>

                        <section className="rounded-xl bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900">Invoice & POS Defaults</h3>
                            <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                                <label>Sales Prefix<input className={inputClass} value={data.sales_prefix} onChange={e => setData("sales_prefix", e.target.value.toUpperCase())} /><FieldError message={errors.sales_prefix} /></label>
                                <label>Purchase Prefix<input className={inputClass} value={data.purchase_prefix} onChange={e => setData("purchase_prefix", e.target.value.toUpperCase())} /><FieldError message={errors.purchase_prefix} /></label>
                                <label>Sales Return Prefix<input className={inputClass} value={data.sales_return_prefix} onChange={e => setData("sales_return_prefix", e.target.value.toUpperCase())} /><FieldError message={errors.sales_return_prefix} /></label>
                                <label>Purchase Return Prefix<input className={inputClass} value={data.purchase_return_prefix} onChange={e => setData("purchase_return_prefix", e.target.value.toUpperCase())} /><FieldError message={errors.purchase_return_prefix} /></label>
                                <label className="lg:col-span-2">Default Payment Method<select className={inputClass} value={data.default_payment_method} onChange={e => setData("default_payment_method", e.target.value)}>{["Cash", "Card", "Bank Transfer", "Mobile Banking"].map(method => <option key={method}>{method}</option>)}</select><FieldError message={errors.default_payment_method} /></label>
                                <label className="md:col-span-2 lg:col-span-4">Invoice Footer<textarea rows="3" className={inputClass} value={data.invoice_footer} onChange={e => setData("invoice_footer", e.target.value)} /><FieldError message={errors.invoice_footer} /></label>
                            </div>
                        </section>

                        <div className="flex items-center justify-end gap-4">
                            {recentlySuccessful && <span className="text-sm font-medium text-green-600">Settings saved.</span>}
                            <button disabled={processing} className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50">{processing ? "Saving..." : "Save Settings"}</button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

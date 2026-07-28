import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";

export default function Form({ data, setData, errors, processing, submit, buttonText }) {
    return <form onSubmit={submit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
            <div><InputLabel htmlFor="name" value="Supplier Group Name" /><TextInput id="name" className="mt-1 block w-full" value={data.name} onChange={(e) => setData("name", e.target.value)} required /><InputError className="mt-2" message={errors.name} /></div>
            <div><InputLabel htmlFor="code" value="Code" /><TextInput id="code" className="mt-1 block w-full uppercase" value={data.code} onChange={(e) => setData("code", e.target.value.toUpperCase().replace(/\s+/g, "-"))} required /><InputError className="mt-2" message={errors.code} /></div>
            <div><InputLabel htmlFor="payment_terms_days" value="Payment Terms (Days)" /><TextInput id="payment_terms_days" type="number" min="0" max="3650" className="mt-1 block w-full" value={data.payment_terms_days} onChange={(e) => setData("payment_terms_days", e.target.value)} required /><InputError className="mt-2" message={errors.payment_terms_days} /></div>
            <div><InputLabel htmlFor="status" value="Status" /><select id="status" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value={data.status} onChange={(e) => setData("status", Number(e.target.value))}><option value={1}>Active</option><option value={0}>Inactive</option></select><InputError className="mt-2" message={errors.status} /></div>
        </div>
        <div><InputLabel htmlFor="description" value="Description" /><textarea id="description" rows="4" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value={data.description} onChange={(e) => setData("description", e.target.value)} /><InputError className="mt-2" message={errors.description} /></div>
        <PrimaryButton disabled={processing}>{buttonText}</PrimaryButton>
    </form>;
}

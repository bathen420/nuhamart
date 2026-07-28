import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";

export default function Form({ data, setData, errors, processing, submit, buttonText }) {
    return <form onSubmit={submit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
            <div><InputLabel htmlFor="name" value="Customer Group Name" /><TextInput id="name" className="mt-1 block w-full" value={data.name} onChange={(e) => setData("name", e.target.value)} required /><InputError className="mt-2" message={errors.name} /></div>
            <div><InputLabel htmlFor="code" value="Code" /><TextInput id="code" className="mt-1 block w-full uppercase" value={data.code} onChange={(e) => setData("code", e.target.value.toUpperCase().replace(/\s+/g, "-"))} required /><InputError className="mt-2" message={errors.code} /></div>
            <div><InputLabel htmlFor="discount_type" value="Discount Type" /><select id="discount_type" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value={data.discount_type} onChange={(e) => setData("discount_type", e.target.value)}><option value="percentage">Percentage</option><option value="fixed">Fixed</option></select><InputError className="mt-2" message={errors.discount_type} /></div>
                <div><InputLabel htmlFor="discount_value" value="Discount Value" /><TextInput id="discount_value" type="number" min="0" step="0.01" className="mt-1 block w-full" value={data.discount_value} onChange={(e) => setData("discount_value", e.target.value)} required /><InputError className="mt-2" message={errors.discount_value} /></div>
                <div><InputLabel htmlFor="credit_limit" value="Credit Limit" /><TextInput id="credit_limit" type="number" min="0" step="0.01" className="mt-1 block w-full" value={data.credit_limit} onChange={(e) => setData("credit_limit", e.target.value)} required /><InputError className="mt-2" message={errors.credit_limit} /></div>
            <div><InputLabel htmlFor="status" value="Status" /><select id="status" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value={data.status} onChange={(e) => setData("status", Number(e.target.value))}><option value={1}>Active</option><option value={0}>Inactive</option></select><InputError className="mt-2" message={errors.status} /></div>
        </div>
        <div><InputLabel htmlFor="description" value="Description" /><textarea id="description" rows="4" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value={data.description} onChange={(e) => setData("description", e.target.value)} /><InputError className="mt-2" message={errors.description} /></div>
        <PrimaryButton disabled={processing}>{buttonText}</PrimaryButton>
    </form>;
}

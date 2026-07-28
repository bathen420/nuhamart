import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";

export default function Form({ data, setData, errors, processing, submit, buttonText }) {
    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                <div>
                    <InputLabel htmlFor="name" value="Warehouse Name" />
                    <TextInput id="name" className="mt-1 block w-full" value={data.name} onChange={(e) => setData("name", e.target.value)} required />
                    <InputError className="mt-2" message={errors.name} />
                </div>
                <div>
                    <InputLabel htmlFor="code" value="Warehouse Code" />
                    <TextInput id="code" className="mt-1 block w-full uppercase" value={data.code} onChange={(e) => setData("code", e.target.value.toUpperCase().replace(/\s+/g, "-"))} required />
                    <InputError className="mt-2" message={errors.code} />
                </div>
                <div>
                    <InputLabel htmlFor="contact_person" value="Contact Person" />
                    <TextInput id="contact_person" className="mt-1 block w-full" value={data.contact_person} onChange={(e) => setData("contact_person", e.target.value)} />
                    <InputError className="mt-2" message={errors.contact_person} />
                </div>
                <div>
                    <InputLabel htmlFor="phone" value="Phone" />
                    <TextInput id="phone" className="mt-1 block w-full" value={data.phone} onChange={(e) => setData("phone", e.target.value)} />
                    <InputError className="mt-2" message={errors.phone} />
                </div>
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput id="email" type="email" className="mt-1 block w-full" value={data.email} onChange={(e) => setData("email", e.target.value)} />
                    <InputError className="mt-2" message={errors.email} />
                </div>
                <div>
                    <InputLabel htmlFor="status" value="Status" />
                    <select id="status" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value={data.status} onChange={(e) => setData("status", Number(e.target.value))}>
                        <option value={1}>Active</option>
                        <option value={0}>Inactive</option>
                    </select>
                    <InputError className="mt-2" message={errors.status} />
                </div>
            </div>

            <div>
                <InputLabel htmlFor="address" value="Address" />
                <textarea id="address" rows="4" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value={data.address} onChange={(e) => setData("address", e.target.value)} />
                <InputError className="mt-2" message={errors.address} />
            </div>

            <label className="flex items-center gap-3 rounded-lg border p-4">
                <input type="checkbox" checked={Boolean(data.is_default)} onChange={(e) => setData("is_default", e.target.checked ? 1 : 0)} className="rounded border-gray-300" />
                <span>
                    <span className="block font-medium text-gray-800">Default warehouse</span>
                    <span className="text-sm text-gray-500">Only one warehouse can be default at a time.</span>
                </span>
            </label>
            <InputError className="mt-2" message={errors.is_default} />

            <PrimaryButton disabled={processing}>{buttonText}</PrimaryButton>
        </form>
    );
}

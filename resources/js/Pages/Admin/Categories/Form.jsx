import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";

export default function Form({
    data,
    setData,
    errors,
    processing,
    submit,
    buttonText = "Save",
}) {
    return (
        <form onSubmit={submit} className="space-y-6">

            {/* Category Name */}
            <div>
                <InputLabel
                    htmlFor="name"
                    value="Category Name"
                />

                <TextInput
                    id="name"
                    className="mt-1 block w-full"
                    value={data.name}
                    onChange={(e) =>
                        setData("name", e.target.value)
                    }
                />

                <InputError
                    className="mt-2"
                    message={errors.name}
                />
            </div>

            <div><InputLabel value="Name (Bangla)"/><TextInput className="mt-1 block w-full" value={data.name_bn ?? ""} onChange={(e)=>setData("name_bn",e.target.value)}/><InputError message={errors.name_bn} className="mt-2"/></div>

            {/* Description */}
            <div>
                <InputLabel
                    htmlFor="description"
                    value="Description"
                />

                <textarea
                    id="description"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    rows="4"
                    value={data.description}
                    onChange={(e) =>
                        setData("description", e.target.value)
                    }
                />

                <InputError
                    className="mt-2"
                    message={errors.description}
                />
            </div>

            <div><InputLabel value="Description (Bangla)"/><textarea rows="5" className="mt-1 block w-full rounded-md border-gray-300" value={data.description_bn ?? ""} onChange={(e)=>setData("description_bn",e.target.value)}/><InputError message={errors.description_bn} className="mt-2"/></div>

            {/* Status */}
            <div>
                <InputLabel
                    htmlFor="status"
                    value="Status"
                />

                <select
                    id="status"
                    className="mt-1 block w-full rounded-md border-gray-300"
                    value={data.status}
                    onChange={(e) =>
                        setData("status", Number(e.target.value))
                    }
                >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                </select>

                <InputError
                    className="mt-2"
                    message={errors.status}
                />
            </div>

            {/* Sort Order */}
            <div>
                <InputLabel
                    htmlFor="sort_order"
                    value="Sort Order"
                />

                <TextInput
                    id="sort_order"
                    type="number"
                    className="mt-1 block w-full"
                    value={data.sort_order}
                    onChange={(e) =>
                        setData("sort_order", e.target.value)
                    }
                />

                <InputError
                    className="mt-2"
                    message={errors.sort_order}
                />
            </div>

            <PrimaryButton disabled={processing}>
                {buttonText}
            </PrimaryButton>

        </form>
    );
}
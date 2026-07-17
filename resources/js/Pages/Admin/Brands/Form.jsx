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

            {/* Brand Name */}
            <div>
                <InputLabel
                    htmlFor="name"
                    value="Brand Name"
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


            {/* Description */}
            <div>
                <InputLabel
                    htmlFor="description"
                    value="Description"
                />

                <textarea
                    id="description"
                    rows="4"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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

                    <option value={1}>
                        Active
                    </option>

                    <option value={0}>
                        Inactive
                    </option>

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
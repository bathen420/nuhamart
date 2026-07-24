import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";

export default function CustomerForm({
    data,
    setData,
    errors = {},
}) {
    return (
        <div className="rounded-2xl bg-white p-8 shadow-sm">

            <h2 className="mb-6 text-2xl font-bold">
                Customer Information
            </h2>

            <div className="grid gap-6 md:grid-cols-2">

                <div>
                    <InputLabel value="Full Name" />

                    <TextInput
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) =>
                            setData("name", e.target.value)
                        }
                    />

                    <InputError message={errors.name} />
                </div>

                <div>
                    <InputLabel value="Phone Number" />

                    <TextInput
                        className="mt-1 block w-full"
                        value={data.phone}
                        onChange={(e) =>
                            setData("phone", e.target.value)
                        }
                    />

                    <InputError message={errors.phone} />
                </div>

                <div>
                    <InputLabel value="Email Address" />

                    <TextInput
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) =>
                            setData("email", e.target.value)
                        }
                    />

                    <InputError message={errors.email} />
                </div>

                <div>
                    <InputLabel value="Division" />

                    <TextInput
                        className="mt-1 block w-full"
                        value={data.division}
                        onChange={(e) =>
                            setData("division", e.target.value)
                        }
                    />
                </div>

                <div>
                    <InputLabel value="District" />

                    <TextInput
                        className="mt-1 block w-full"
                        value={data.district}
                        onChange={(e) =>
                            setData("district", e.target.value)
                        }
                    />
                </div>

                <div>
                    <InputLabel value="Area" />

                    <TextInput
                        className="mt-1 block w-full"
                        value={data.area}
                        onChange={(e) =>
                            setData("area", e.target.value)
                        }
                    />
                </div>

            </div>

            <div className="mt-6">

                <InputLabel value="Full Address" />

                <textarea
                    rows={4}
                    className="mt-1 w-full rounded-lg border-gray-300"
                    value={data.address}
                    onChange={(e) =>
                        setData("address", e.target.value)
                    }
                />

            </div>

            <div className="mt-6">

                <InputLabel value="Order Note" />

                <textarea
                    rows={3}
                    className="mt-1 w-full rounded-lg border-gray-300"
                    value={data.note}
                    onChange={(e) =>
                        setData("note", e.target.value)
                    }
                />

            </div>

        </div>
    );
}
import { Link } from "@inertiajs/react";
import {
    Save,
    X,
    User,
    Phone,
    Mail,
    MapPin,
    Wallet,
    FileText,
} from "lucide-react";

export default function CustomerForm({
    data,
    setData,
    errors,
    processing,
    submitLabel = "Save Customer",
    onSubmit,
}) {
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Customer Information
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Enter the customer&apos;s basic and account details.
                    </p>
                </div>

                <div className="grid gap-6 p-6 md:grid-cols-2">
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Customer Name
                            <span className="ml-1 text-red-500">*</span>
                        </label>

                        <div className="relative">
                            <User
                                size={18}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(event) =>
                                    setData("name", event.target.value)
                                }
                                placeholder="Enter customer name"
                                className={`w-full rounded-lg border py-2.5 pl-10 pr-3 outline-none transition focus:ring-2 ${
                                    errors.name
                                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                                }`}
                            />
                        </div>

                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="phone"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Phone Number
                            <span className="ml-1 text-red-500">*</span>
                        </label>

                        <div className="relative">
                            <Phone
                                size={18}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                id="phone"
                                type="text"
                                value={data.phone}
                                onChange={(event) =>
                                    setData("phone", event.target.value)
                                }
                                placeholder="Enter phone number"
                                className={`w-full rounded-lg border py-2.5 pl-10 pr-3 outline-none transition focus:ring-2 ${
                                    errors.phone
                                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                                }`}
                            />
                        </div>

                        {errors.phone && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.phone}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Email Address
                        </label>

                        <div className="relative">
                            <Mail
                                size={18}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(event) =>
                                    setData("email", event.target.value)
                                }
                                placeholder="Enter email address"
                                className={`w-full rounded-lg border py-2.5 pl-10 pr-3 outline-none transition focus:ring-2 ${
                                    errors.email
                                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                                }`}
                            />
                        </div>

                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="opening_balance"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Opening Balance
                        </label>

                        <div className="relative">
                            <Wallet
                                size={18}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                id="opening_balance"
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.opening_balance}
                                onChange={(event) =>
                                    setData(
                                        "opening_balance",
                                        event.target.value,
                                    )
                                }
                                placeholder="0.00"
                                className={`w-full rounded-lg border py-2.5 pl-10 pr-3 outline-none transition focus:ring-2 ${
                                    errors.opening_balance
                                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                                }`}
                            />
                        </div>

                        {errors.opening_balance && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.opening_balance}
                            </p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <label
                            htmlFor="address"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Address
                        </label>

                        <div className="relative">
                            <MapPin
                                size={18}
                                className="pointer-events-none absolute left-3 top-3 text-gray-400"
                            />

                            <textarea
                                id="address"
                                rows="3"
                                value={data.address}
                                onChange={(event) =>
                                    setData("address", event.target.value)
                                }
                                placeholder="Enter customer address"
                                className={`w-full rounded-lg border py-2.5 pl-10 pr-3 outline-none transition focus:ring-2 ${
                                    errors.address
                                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                                }`}
                            />
                        </div>

                        {errors.address && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.address}
                            </p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <label
                            htmlFor="notes"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Notes
                        </label>

                        <div className="relative">
                            <FileText
                                size={18}
                                className="pointer-events-none absolute left-3 top-3 text-gray-400"
                            />

                            <textarea
                                id="notes"
                                rows="4"
                                value={data.notes}
                                onChange={(event) =>
                                    setData("notes", event.target.value)
                                }
                                placeholder="Write optional notes"
                                className={`w-full rounded-lg border py-2.5 pl-10 pr-3 outline-none transition focus:ring-2 ${
                                    errors.notes
                                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                                }`}
                            />
                        </div>

                        {errors.notes && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.notes}
                            </p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                            <input
                                type="checkbox"
                                checked={Boolean(data.status)}
                                onChange={(event) =>
                                    setData("status", event.target.checked)
                                }
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />

                            <div>
                                <p className="text-sm font-medium text-gray-800">
                                    Active Customer
                                </p>

                                <p className="text-xs text-gray-500">
                                    Inactive customers can remain in records but
                                    may be excluded from future transactions.
                                </p>
                            </div>
                        </label>

                        {errors.status && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.status}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Link
                    href={route("customers.index")}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                    <X size={18} />
                    Cancel
                </Link>

                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <Save size={18} />

                    {processing ? "Saving..." : submitLabel}
                </button>
            </div>
        </form>
    );
}
import { Head, Link, router, useForm } from "@inertiajs/react";
import { Camera, CheckCircle2, ShieldCheck, Trash2, UserRound } from "lucide-react";
import CustomerAccountLayout from "@/Layouts/CustomerAccountLayout";
import UpdatePasswordForm from "@/Pages/Profile/Partials/UpdatePasswordForm";
import DeleteUserForm from "@/Pages/Profile/Partials/DeleteUserForm";

const genders = [
    ["", "Select gender"],
    ["male", "Male"],
    ["female", "Female"],
    ["other", "Other"],
    ["prefer_not_to_say", "Prefer not to say"],
];

export default function Edit({ profile, mustVerifyEmail, status }) {
    const form = useForm({
        name: profile.name ?? "",
        email: profile.email ?? "",
        phone: profile.phone ?? "",
        date_of_birth: profile.date_of_birth ?? "",
        gender: profile.gender ?? "",
        avatar: null,
    });

    const submit = (event) => {
        event.preventDefault();

        form.transform((data) => ({ ...data, _method: "patch" })).post(
            route("customer.profile.update"),
            {
                forceFormData: true,
                preserveScroll: true,
                onFinish: () => form.transform((data) => data),
            },
        );
    };

    const removeAvatar = () => {
        if (!confirm("Remove your profile photo?")) return;

        router.delete(route("customer.profile.avatar.destroy"), {
            preserveScroll: true,
        });
    };

    const initials = (profile.name || "Customer")
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <CustomerAccountLayout title="My Profile">
            <Head title="My Profile" />

            <div className="space-y-6">
                {(status === "profile-updated" || status === "avatar-removed") && (
                    <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-700">
                        <CheckCircle2 size={20} />
                        {status === "avatar-removed"
                            ? "Profile photo removed."
                            : "Profile information updated successfully."}
                    </div>
                )}

                <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
                    <div className="bg-gradient-to-r from-teal-800 to-teal-600 px-6 py-8 text-white">
                        <p className="text-xs font-black uppercase tracking-[.2em] text-teal-100">
                            Personal details
                        </p>
                        <h2 className="mt-2 text-3xl font-black">Manage your profile</h2>
                        <p className="mt-2 max-w-2xl text-sm text-teal-50">
                            Keep your contact details updated for faster checkout,
                            delivery updates and account recovery.
                        </p>
                    </div>

                    <form onSubmit={submit} className="p-6 lg:p-8">
                        <div className="grid gap-8 xl:grid-cols-[220px_1fr]">
                            <div>
                                <div className="relative mx-auto h-36 w-36 overflow-hidden rounded-full border-4 border-white bg-teal-100 shadow-lg">
                                    {profile.avatar_url ? (
                                        <img
                                            src={profile.avatar_url}
                                            alt={profile.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="grid h-full w-full place-items-center text-4xl font-black text-teal-700">
                                            {initials}
                                        </div>
                                    )}
                                </div>

                                <label className="mt-5 flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-black text-white transition hover:bg-teal-700">
                                    <Camera size={18} />
                                    Choose photo
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        className="hidden"
                                        onChange={(event) =>
                                            form.setData("avatar", event.target.files?.[0] ?? null)
                                        }
                                    />
                                </label>

                                {profile.avatar_url && (
                                    <button
                                        type="button"
                                        onClick={removeAvatar}
                                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm font-black text-rose-600"
                                    >
                                        <Trash2 size={17} />
                                        Remove photo
                                    </button>
                                )}

                                <p className="mt-3 text-center text-xs leading-5 text-slate-500">
                                    JPG, PNG or WebP. Maximum 2 MB.
                                </p>
                                {form.errors.avatar && (
                                    <p className="mt-2 text-center text-xs font-bold text-rose-600">
                                        {form.errors.avatar}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <Field label="Full name" error={form.errors.name}>
                                    <input
                                        value={form.data.name}
                                        onChange={(e) => form.setData("name", e.target.value)}
                                        className="w-full rounded-xl border-slate-300 focus:border-teal-600 focus:ring-teal-600"
                                        autoComplete="name"
                                        required
                                    />
                                </Field>

                                <Field label="Phone number" error={form.errors.phone}>
                                    <input
                                        value={form.data.phone}
                                        onChange={(e) => form.setData("phone", e.target.value)}
                                        className="w-full rounded-xl border-slate-300 focus:border-teal-600 focus:ring-teal-600"
                                        placeholder="01XXXXXXXXX"
                                        autoComplete="tel"
                                    />
                                </Field>

                                <Field label="Email address" error={form.errors.email}>
                                    <input
                                        type="email"
                                        value={form.data.email}
                                        onChange={(e) => form.setData("email", e.target.value)}
                                        className="w-full rounded-xl border-slate-300 focus:border-teal-600 focus:ring-teal-600"
                                        autoComplete="email"
                                        required
                                    />
                                </Field>

                                <Field label="Date of birth" error={form.errors.date_of_birth}>
                                    <input
                                        type="date"
                                        value={form.data.date_of_birth}
                                        onChange={(e) =>
                                            form.setData("date_of_birth", e.target.value)
                                        }
                                        className="w-full rounded-xl border-slate-300 focus:border-teal-600 focus:ring-teal-600"
                                    />
                                </Field>

                                <Field label="Gender" error={form.errors.gender}>
                                    <select
                                        value={form.data.gender}
                                        onChange={(e) => form.setData("gender", e.target.value)}
                                        className="w-full rounded-xl border-slate-300 focus:border-teal-600 focus:ring-teal-600"
                                    >
                                        {genders.map(([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                </Field>

                                <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4">
                                    <div className="flex items-start gap-3">
                                        <ShieldCheck className="mt-0.5 text-teal-700" size={20} />
                                        <div>
                                            <p className="font-black text-teal-900">Account security</p>
                                            <p className="mt-1 text-xs leading-5 text-teal-700">
                                                Your personal details are used only for account,
                                                order and delivery services.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {mustVerifyEmail && !profile.email_verified_at && (
                                    <div className="md:col-span-2 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
                                        Your email address is unverified.{" "}
                                        <Link
                                            href={route("verification.send")}
                                            method="post"
                                            as="button"
                                            className="font-black underline"
                                        >
                                            Send verification email
                                        </Link>
                                    </div>
                                )}

                                <div className="md:col-span-2 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-5">
                                    <button
                                        disabled={form.processing}
                                        className="rounded-xl bg-teal-700 px-6 py-3 font-black text-white transition hover:bg-teal-800 disabled:opacity-50"
                                    >
                                        {form.processing ? "Saving..." : "Save profile"}
                                    </button>

                                    {form.recentlySuccessful && (
                                        <span className="text-sm font-bold text-emerald-600">
                                            Saved successfully.
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="rounded-3xl bg-white p-6 shadow-sm lg:p-8">
                    <UpdatePasswordForm className="max-w-2xl" />
                </div>

                <div className="rounded-3xl border border-rose-100 bg-white p-6 shadow-sm lg:p-8">
                    <DeleteUserForm className="max-w-2xl" />
                </div>
            </div>
        </CustomerAccountLayout>
    );
}

function Field({ label, error, children }) {
    return (
        <label className="block">
            <span className="mb-2 block text-sm font-black text-slate-700">
                {label}
            </span>
            {children}
            {error && <span className="mt-2 block text-xs font-bold text-rose-600">{error}</span>}
        </label>
    );
}

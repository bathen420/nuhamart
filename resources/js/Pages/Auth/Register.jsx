import InputError from "@/Components/InputError";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { LockKeyhole, Mail, User, UserPlus } from "lucide-react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (event) => {
        event.preventDefault();
        post(route("customer.register.store"), {
            preserveScroll: true,
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    const fields = [
        { key: "name", label: "Full name", type: "text", icon: User, autoComplete: "name", placeholder: "Your full name" },
        { key: "email", label: "Email address", type: "email", icon: Mail, autoComplete: "username", placeholder: "you@example.com" },
        { key: "password", label: "Password", type: "password", icon: LockKeyhole, autoComplete: "new-password", placeholder: "Create a secure password" },
        { key: "password_confirmation", label: "Confirm password", type: "password", icon: LockKeyhole, autoComplete: "new-password", placeholder: "Repeat your password" },
    ];

    return (
        <GuestLayout>
            <Head title="Create Customer Account" />

            <p className="text-sm font-black uppercase tracking-[.2em] text-[#0f766e]">
                Customer Registration
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">Create your account</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
                Register to track orders and enjoy a faster checkout.
            </p>

            <form onSubmit={submit} className="mt-7 space-y-4">
                {fields.map((field, index) => {
                    const Icon = field.icon;
                    return (
                        <div key={field.key}>
                            <label htmlFor={field.key} className="text-sm font-bold text-slate-700">
                                {field.label}
                            </label>
                            <div className="relative mt-2">
                                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
                                <input
                                    id={field.key}
                                    type={field.type}
                                    value={data[field.key]}
                                    onChange={(e) => setData(field.key, e.target.value)}
                                    autoComplete={field.autoComplete}
                                    autoFocus={index === 0}
                                    required
                                    className="h-12 w-full rounded-xl border-slate-300 pl-11 focus:border-[#0f766e] focus:ring-[#0f766e]"
                                    placeholder={field.placeholder}
                                />
                            </div>
                            <InputError message={errors[field.key]} className="mt-2" />
                        </div>
                    );
                })}

                <button
                    type="submit"
                    disabled={processing}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0f766e] font-black text-white transition hover:bg-[#115e59] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <UserPlus size={19} />
                    {processing ? "Creating account..." : "Create account"}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
                Already registered?{" "}
                <Link href={route("customer.login")} className="font-black text-[#0f766e] hover:underline">
                    Sign in
                </Link>
            </p>
        </GuestLayout>
    );
}

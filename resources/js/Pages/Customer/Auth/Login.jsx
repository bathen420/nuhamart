import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, usePage, Link, useForm } from "@inertiajs/react";
import { LockKeyhole, LogIn, Mail } from "lucide-react";

export default function CustomerLogin({
    status,
    canResetPassword = true,
    canRegister = true,
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (event) => {
        event.preventDefault();

        post(route("customer.login.store"), {
            preserveScroll: true,
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Customer Login" />

            <p className="text-sm font-black uppercase tracking-[.2em] text-[#0f766e]">
                Customer Login
            </p>

            <h2 className="mt-2 text-3xl font-black text-slate-900">
                Welcome back
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
                Sign in to view orders, manage addresses and enjoy a faster
                checkout experience.
            </p>

            {status && (
                <div className="mt-5 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="mt-7 space-y-5">
                <div>
                    <label
                        htmlFor="email"
                        className="text-sm font-bold text-slate-700"
                    >
                        Email address
                    </label>

                    <div className="relative mt-2">
                        <Mail
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            size={19}
                        />

                        <input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(event) =>
                                setData("email", event.target.value)
                            }
                            autoComplete="username"
                            autoFocus
                            required
                            className="h-12 w-full rounded-xl border-slate-300 pl-11 focus:border-[#0f766e] focus:ring-[#0f766e]"
                            placeholder="you@example.com"
                        />
                    </div>

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <div className="flex items-center justify-between gap-3">
                        <label
                            htmlFor="password"
                            className="text-sm font-bold text-slate-700"
                        >
                            Password
                        </label>

                        {canResetPassword && (
                            <Link
                                href={route("password.request")}
                                className="text-xs font-black text-[#0f766e] hover:underline"
                            >
                                Forgot password?
                            </Link>
                        )}
                    </div>

                    <div className="relative mt-2">
                        <LockKeyhole
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            size={19}
                        />

                        <input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(event) =>
                                setData("password", event.target.value)
                            }
                            autoComplete="current-password"
                            required
                            className="h-12 w-full rounded-xl border-slate-300 pl-11 focus:border-[#0f766e] focus:ring-[#0f766e]"
                            placeholder="Enter your password"
                        />
                    </div>

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <label className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                    <Checkbox
                        name="remember"
                        checked={data.remember}
                        onChange={(event) =>
                            setData("remember", event.target.checked)
                        }
                    />
                    Remember me
                </label>

                <button
                    type="submit"
                    disabled={processing}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0f766e] font-black text-white transition hover:bg-[#115e59] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <LogIn size={19} />
                    {processing ? "Signing in..." : "Sign in"}
                </button>
            </form>

            {canRegister && (
                <p className="mt-6 text-center text-sm text-slate-500">
                    New to {companyName}?{" "}
                    <Link
                        href="/customer/register"
                        className="font-black text-[#0f766e] hover:underline"
                    >
                        Create an account
                    </Link>
                </p>
            )}
        </GuestLayout>
    );
}

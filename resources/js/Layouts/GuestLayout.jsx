import { Link, usePage } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    const businessSettings = usePage().props.businessSettings || {};
    const companyName = businessSettings.company_name || 'NuhaMart';

    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 px-4 pt-6 sm:justify-center sm:pt-0">
            <Link href="/" className="flex flex-col items-center text-center">
                {businessSettings.logo ? (
                    <img src={businessSettings.logo} alt={companyName} className="h-24 w-24 rounded-2xl border bg-white object-contain p-2 shadow-sm" />
                ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-600 text-3xl font-black text-white shadow">
                        {companyName.charAt(0).toUpperCase()}
                    </div>
                )}
                <h1 className="mt-4 text-2xl font-black text-gray-900">{companyName}</h1>
                <p className="mt-1 text-sm text-gray-500">{businessSettings.company_tagline || 'Inventory & POS System'}</p>
            </Link>

            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-5 shadow-md sm:max-w-md sm:rounded-xl">
                {children}
            </div>
        </div>
    );
}

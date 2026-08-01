import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Labels({ variants = [] }) {
    return (
        <AuthenticatedLayout>
            <Head title="Variant Labels" />
            <div className="space-y-5">
                <div className="flex items-center justify-between print:hidden">
                    <h1 className="text-2xl font-bold">Product Variant Labels</h1>
                    <div className="flex gap-2">
                        <button onClick={() => window.print()} className="rounded-lg bg-blue-600 px-4 py-2 text-white">Print</button>
                        <Link href={route("admin.product-variants.index")} className="rounded-lg border bg-white px-4 py-2">Back</Link>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {variants.map((variant) => (
                        <div key={variant.id} className="break-inside-avoid rounded-lg border bg-white p-4 text-center">
                            <div className="font-bold">{variant.product?.name || "Product"}</div>
                            <div className="text-sm">{variant.name || variant.sku || `Variant #${variant.id}`}</div>
                            <div className="mt-2 font-mono text-xs">{variant.barcode || variant.sku || "—"}</div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

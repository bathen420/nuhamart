import { Head, useForm } from "@inertiajs/react";
import { Pencil } from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Badge, PageHeader } from "@/Components/Admin/UI";
import CustomerForm from "./Form";

export default function Edit({ customer }) {
    const form = useForm({
        name: customer?.name ?? "",
        phone: customer?.phone ?? "",
        email: customer?.email ?? "",
        address: customer?.address ?? "",
        opening_balance: String(customer?.opening_balance ?? 0),
        status: Boolean(customer?.status),
        notes: customer?.notes ?? "",
    });

    return (
        <AuthenticatedLayout>
            <Head title={`Edit ${customer.name}`} />

            <div className="space-y-6">
                <PageHeader
                    eyebrow="Customer relationship management"
                    title="Edit customer"
                    description="Update identity, contact, balance and CRM notes."
                >
                    <div className="mt-3 flex gap-2">
                        <Badge tone="brand">
                            <Pencil size={13} />
                            {customer.customer_code}
                        </Badge>
                        <Badge
                            tone={customer.status ? "success" : "neutral"}
                            dot
                        >
                            {customer.status ? "Active" : "Inactive"}
                        </Badge>
                    </div>
                </PageHeader>

                <CustomerForm
                    data={form.data}
                    setData={form.setData}
                    errors={form.errors}
                    processing={form.processing}
                    submitLabel="Update customer"
                    customerCode={customer.customer_code}
                    onSubmit={(event) => {
                        event.preventDefault();
                        form.patch(
                            route("admin.customers.update", customer.id),
                            { preserveScroll: true },
                        );
                    }}
                />
            </div>
        </AuthenticatedLayout>
    );
}

import { Head, useForm } from "@inertiajs/react";
import { UserPlus } from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Badge, PageHeader } from "@/Components/Admin/UI";
import CustomerForm from "./Form";

export default function Create() {
    const form = useForm({
        name: "",
        phone: "",
        email: "",
        address: "",
        opening_balance: "0",
        status: true,
        notes: "",
    });

    return (
        <AuthenticatedLayout>
            <Head title="Add Customer" />

            <div className="space-y-6">
                <PageHeader
                    eyebrow="Customer relationship management"
                    title="Add customer"
                    description="Create a customer profile for sales, orders, loyalty and wallet activity."
                >
                    <div className="mt-3 flex gap-2">
                        <Badge tone="brand">
                            <UserPlus size={13} />
                            New profile
                        </Badge>
                        <Badge tone="neutral">
                            Customer code is automatic
                        </Badge>
                    </div>
                </PageHeader>

                <CustomerForm
                    data={form.data}
                    setData={form.setData}
                    errors={form.errors}
                    processing={form.processing}
                    submitLabel="Create customer"
                    onSubmit={(event) => {
                        event.preventDefault();
                        form.post(route("admin.customers.store"), {
                            preserveScroll: true,
                        });
                    }}
                />
            </div>
        </AuthenticatedLayout>
    );
}

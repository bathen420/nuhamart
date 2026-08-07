import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import EntityForm from "@/Components/Admin/Catalog/EntityForm";

export default function Edit({ publisher }) {
    const form = useForm({
        name: publisher.name ?? "",
        name_bn: publisher.name_bn ?? "",
        description: publisher.description ?? "",
        description_bn: publisher.description_bn ?? "",
        status: publisher.status ? 1 : 0,
        sort_order: publisher.sort_order ?? 0,
    });

    return (
        <AuthenticatedLayout>
            <Head title={`Edit ${publisher.name}`} />
            <EntityForm
                entity="publisher"
                title="Edit publisher"
                description="Update publishing-house details and visibility."
                routeBase="admin.publishers"
                data={form.data}
                setData={form.setData}
                errors={form.errors}
                processing={form.processing}
                isEdit
                submit={(event) => {
                    event.preventDefault();
                    form.put(route("admin.publishers.update", publisher.id), {
                        preserveScroll: true,
                    });
                }}
                fields={[
                    { name: "name", label: "Name (English)", required: true },
                    { name: "name_bn", label: "Name (Bangla)" },
                    {
                        name: "description",
                        label: "Description (English)",
                        type: "textarea",
                        full: true,
                    },
                    {
                        name: "description_bn",
                        label: "Description (Bangla)",
                        type: "textarea",
                        full: true,
                    },
                    {
                        name: "sort_order",
                        label: "Display order",
                        type: "number",
                    },
                ]}
            />
        </AuthenticatedLayout>
    );
}

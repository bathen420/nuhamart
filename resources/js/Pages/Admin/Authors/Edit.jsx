import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import EntityForm from "@/Components/Admin/Catalog/EntityForm";

export default function Edit({ author }) {
    const form = useForm({
        name: author.name ?? "",
        name_bn: author.name_bn ?? "",
        biography: author.biography ?? "",
        biography_bn: author.biography_bn ?? "",
        status: author.status ? 1 : 0,
        sort_order: author.sort_order ?? 0,
    });

    return (
        <AuthenticatedLayout>
            <Head title={`Edit ${author.name}`} />
            <EntityForm
                entity="author"
                title="Edit author"
                description="Update author names, biography and storefront visibility."
                routeBase="admin.authors"
                data={form.data}
                setData={form.setData}
                errors={form.errors}
                processing={form.processing}
                isEdit
                submit={(event) => {
                    event.preventDefault();
                    form.put(route("admin.authors.update", author.id), {
                        preserveScroll: true,
                    });
                }}
                fields={[
                    { name: "name", label: "Name (English)", required: true },
                    { name: "name_bn", label: "Name (Bangla)" },
                    {
                        name: "biography",
                        label: "Biography (English)",
                        type: "textarea",
                        full: true,
                        rows: 7,
                    },
                    {
                        name: "biography_bn",
                        label: "Biography (Bangla)",
                        type: "textarea",
                        full: true,
                        rows: 7,
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

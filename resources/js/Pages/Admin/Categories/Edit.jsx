import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import EntityForm from "@/Components/Admin/Catalog/EntityForm";

export default function Edit({ category }) {
    const form = useForm({
        name: category.name ?? "",
        name_bn: category.name_bn ?? "",
        description: category.description ?? "",
        description_bn: category.description_bn ?? "",
        status: category.status ? 1 : 0,
        sort_order: category.sort_order ?? 0,
    });

    return (
        <AuthenticatedLayout>
            <Head title={`Edit ${category.name}`} />
            <EntityForm
                entity="category"
                title="Edit category"
                description="Update catalog naming, translations and display order."
                routeBase="admin.categories"
                data={form.data}
                setData={form.setData}
                errors={form.errors}
                processing={form.processing}
                isEdit
                submit={(event) => {
                    event.preventDefault();
                    form.put(route("admin.categories.update", category.id), {
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

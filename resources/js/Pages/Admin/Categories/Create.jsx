import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import EntityForm from "@/Components/Admin/Catalog/EntityForm";

export default function Create() {
    const form = useForm({
        name: "",
        name_bn: "",
        description: "",
        description_bn: "",
        status: 1,
        sort_order: 0,
    });

    return (
        <AuthenticatedLayout>
            <Head title="Add Category" />
            <EntityForm
                entity="category"
                title="Add category"
                description="Create a product or book classification for the catalog."
                routeBase="admin.categories"
                data={form.data}
                setData={form.setData}
                errors={form.errors}
                processing={form.processing}
                submit={(event) => {
                    event.preventDefault();
                    form.post(route("admin.categories.store"), {
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

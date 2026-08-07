import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import EntityForm from "@/Components/Admin/Catalog/EntityForm";

export default function Create() {
    const form = useForm({
        name: "",
        name_bn: "",
        biography: "",
        biography_bn: "",
        status: 1,
        sort_order: 0,
    });

    return (
        <AuthenticatedLayout>
            <Head title="Add Author" />
            <EntityForm
                entity="author"
                title="Add author"
                description="Create a bilingual author profile for book products."
                routeBase="admin.authors"
                data={form.data}
                setData={form.setData}
                errors={form.errors}
                processing={form.processing}
                submit={(event) => {
                    event.preventDefault();
                    form.post(route("admin.authors.store"), {
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

import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import EntityForm from "@/Components/Admin/Catalog/EntityForm";

export default function Create() {
    const form = useForm({
        name: "",
        description: "",
        status: 1,
        sort_order: 0,
    });

    return (
        <AuthenticatedLayout>
            <Head title="Add Brand" />
            <EntityForm
                entity="brand"
                title="Add brand"
                description="Create a manufacturer or product label."
                routeBase="admin.brands"
                data={form.data}
                setData={form.setData}
                errors={form.errors}
                processing={form.processing}
                submit={(event) => {
                    event.preventDefault();
                    form.post(route("admin.brands.store"), {
                        preserveScroll: true,
                    });
                }}
                fields={[
                    { name: "name", label: "Brand name", required: true },
                    {
                        name: "description",
                        label: "Description",
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

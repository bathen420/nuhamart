import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import EntityForm from "@/Components/Admin/Catalog/EntityForm";

export default function Edit({ brand }) {
    const form = useForm({
        name: brand.name ?? "",
        description: brand.description ?? "",
        status: brand.status ? 1 : 0,
        sort_order: brand.sort_order ?? 0,
    });

    return (
        <AuthenticatedLayout>
            <Head title={`Edit ${brand.name}`} />
            <EntityForm
                entity="brand"
                title="Edit brand"
                description="Update product-label details and visibility."
                routeBase="admin.brands"
                data={form.data}
                setData={form.setData}
                errors={form.errors}
                processing={form.processing}
                isEdit
                submit={(event) => {
                    event.preventDefault();
                    form.put(route("admin.brands.update", brand.id), {
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

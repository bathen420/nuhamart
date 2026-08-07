import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import EntityForm from "@/Components/Admin/Catalog/EntityForm";

export default function Form({ unit = null }) {
    const form = useForm({
        name: unit?.name ?? "",
        short_name: unit?.short_name ?? "",
        is_base: Boolean(unit?.is_base),
        status: unit?.status ?? true,
    });

    return (
        <AuthenticatedLayout>
            <Head title={unit ? `Edit ${unit.name}` : "Add Unit"} />
            <EntityForm
                entity="unit"
                title={unit ? "Edit unit" : "Add unit"}
                description="Define a measurement unit for inventory and products."
                routeBase="admin.units"
                data={form.data}
                setData={form.setData}
                errors={form.errors}
                processing={form.processing}
                isEdit={Boolean(unit)}
                submit={(event) => {
                    event.preventDefault();
                    unit
                        ? form.put(route("admin.units.update", unit.id), {
                              preserveScroll: true,
                          })
                        : form.post(route("admin.units.store"), {
                              preserveScroll: true,
                          });
                }}
                fields={[
                    { name: "name", label: "Unit name", required: true },
                    { name: "short_name", label: "Short name", required: true },
                    {
                        name: "is_base",
                        label: "Base unit",
                        type: "toggle",
                        description:
                            "Use this as a primary measurement reference.",
                    },
                ]}
            />
        </AuthenticatedLayout>
    );
}

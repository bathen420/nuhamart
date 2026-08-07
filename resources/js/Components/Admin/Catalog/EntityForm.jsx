import { Link } from "@inertiajs/react";
import {
    ArrowLeft,
    BookOpen,
    Building2,
    FolderTree,
    Save,
    Tags,
    Weight,
} from "lucide-react";
import {
    Alert,
    Badge,
    Button,
    Card,
    CardBody,
    CardHeader,
    FormField,
    Input,
    PageHeader,
    Textarea,
    Toggle,
} from "@/Components/Admin/UI";

const icons = {
    category: FolderTree,
    brand: Tags,
    author: BookOpen,
    publisher: Building2,
    unit: Weight,
};

export default function EntityForm({
    entity,
    title,
    description,
    routeBase,
    data,
    setData,
    errors,
    processing,
    submit,
    isEdit = false,
    fields = [],
}) {
    const Icon = icons[entity] || FolderTree;

    return (
        <div className="space-y-6">
            <PageHeader
                eyebrow="Catalog structure"
                title={title}
                description={description}
                actions={
                    <Button
                        as={Link}
                        href={route(`${routeBase}.index`)}
                        variant="secondary"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </Button>
                }
            >
                <div className="mt-3 flex gap-2">
                    <Badge tone="brand">
                        {isEdit ? "Editing" : "New record"}
                    </Badge>
                    <Badge tone={data.status ? "success" : "neutral"} dot>
                        {data.status ? "Active" : "Inactive"}
                    </Badge>
                </div>
            </PageHeader>

            {errors.error && (
                <Alert variant="danger" title="Unable to save">
                    {errors.error}
                </Alert>
            )}

            <form onSubmit={submit}>
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
                    <Card>
                        <CardHeader
                            title={`${entity.charAt(0).toUpperCase()}${entity.slice(1)} information`}
                            description="Public name, description and display settings."
                        />
                        <CardBody className="grid gap-5 md:grid-cols-2">
                            {fields.map((field) => {
                                if (field.type === "textarea") {
                                    return (
                                        <FormField
                                            key={field.name}
                                            label={field.label}
                                            error={errors[field.name]}
                                            className={
                                                field.full
                                                    ? "md:col-span-2"
                                                    : ""
                                            }
                                        >
                                            <Textarea
                                                rows={field.rows || 5}
                                                value={
                                                    data[field.name] ?? ""
                                                }
                                                onChange={(event) =>
                                                    setData(
                                                        field.name,
                                                        event.target.value,
                                                    )
                                                }
                                                invalid={Boolean(
                                                    errors[field.name],
                                                )}
                                            />
                                        </FormField>
                                    );
                                }

                                if (field.type === "toggle") {
                                    return (
                                        <Toggle
                                            key={field.name}
                                            checked={Boolean(
                                                data[field.name],
                                            )}
                                            onChange={(checked) =>
                                                setData(
                                                    field.name,
                                                    checked,
                                                )
                                            }
                                            label={field.label}
                                            description={field.description}
                                        />
                                    );
                                }

                                return (
                                    <FormField
                                        key={field.name}
                                        label={field.label}
                                        error={errors[field.name]}
                                        required={field.required}
                                        className={
                                            field.full
                                                ? "md:col-span-2"
                                                : ""
                                        }
                                    >
                                        <Input
                                            type={field.type || "text"}
                                            value={data[field.name] ?? ""}
                                            onChange={(event) =>
                                                setData(
                                                    field.name,
                                                    event.target.value,
                                                )
                                            }
                                            invalid={Boolean(
                                                errors[field.name],
                                            )}
                                        />
                                    </FormField>
                                );
                            })}

                            <Toggle
                                checked={Boolean(data.status)}
                                onChange={(checked) =>
                                    setData("status", checked ? 1 : 0)
                                }
                                label="Active"
                                description="Available for selection in product forms."
                            />
                        </CardBody>
                    </Card>

                    <aside className="h-fit xl:sticky xl:top-28">
                        <Card>
                            <CardHeader
                                title="Live preview"
                                description="How this record will appear."
                            />
                            <CardBody>
                                <div className="rounded-2xl border border-ink-200 bg-ink-50 p-5">
                                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-brand-700 shadow-sm">
                                        <Icon size={22} />
                                    </span>
                                    <h3 className="mt-4 text-lg font-black text-ink-950">
                                        {data.name || `${entity} name`}
                                    </h3>
                                    {data.name_bn && (
                                        <p className="mt-1 text-sm font-bold text-ink-500">
                                            {data.name_bn}
                                        </p>
                                    )}
                                    <p className="mt-3 line-clamp-4 text-sm leading-6 text-ink-500">
                                        {data.description ||
                                            data.biography ||
                                            "Add a description to preview it here."}
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <Badge
                                            tone={
                                                data.status
                                                    ? "success"
                                                    : "neutral"
                                            }
                                            dot
                                        >
                                            {data.status
                                                ? "Active"
                                                : "Inactive"}
                                        </Badge>
                                        {data.sort_order !== undefined && (
                                            <Badge tone="brand">
                                                Order {data.sort_order || 0}
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    loading={processing}
                                    className="mt-5 w-full"
                                >
                                    <Save size={16} />
                                    {isEdit ? "Update" : "Create"}{" "}
                                    {entity}
                                </Button>
                            </CardBody>
                        </Card>
                    </aside>
                </div>
            </form>
        </div>
    );
}

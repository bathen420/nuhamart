import { Head, Link, router } from "@inertiajs/react";
import {
    BookOpen,
    Building2,
    Edit3,
    FolderTree,
    Plus,
    Search,
    Tags,
    Trash2,
    Weight,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Badge,
    Button,
    Card,
    CardBody,
    PageHeader,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/Admin/UI";
import Input from "@/Components/Admin/UI/Input";

const icons = {
    categories: FolderTree,
    brands: Tags,
    authors: BookOpen,
    publishers: Building2,
    units: Weight,
};

export default function EntityIndex({
    entity,
    title,
    description,
    createLabel,
    items,
    filters = {},
    columns = [],
    routeBase,
    canDelete = true,
}) {
    const Icon = icons[entity] || FolderTree;
    const rows = items?.data || [];

    const search = (event) => {
        event.preventDefault();
        const value = new FormData(event.currentTarget).get("search") || "";

        router.get(
            route(`${routeBase}.index`),
            value ? { search: value } : {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const remove = (item) => {
        if (!window.confirm(`Delete "${item.name}"?`)) return;

        router.delete(route(`${routeBase}.destroy`, item.id), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={title} />

            <div className="space-y-6">
                <PageHeader
                    eyebrow="Catalog structure"
                    title={title}
                    description={description}
                    actions={
                        <Button
                            as={Link}
                            href={route(`${routeBase}.create`)}
                        >
                            <Plus size={16} />
                            {createLabel}
                        </Button>
                    }
                >
                    <div className="mt-3 flex flex-wrap gap-2">
                        <Badge tone="brand">
                            {items?.total ?? rows.length} total
                        </Badge>
                        <Badge tone="neutral">
                            Page {items?.current_page ?? 1}
                        </Badge>
                    </div>
                </PageHeader>

                <Card>
                    <CardBody>
                        <form
                            onSubmit={search}
                            className="flex flex-col gap-3 sm:flex-row"
                        >
                            <div className="relative flex-1">
                                <Search
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
                                />
                                <Input
                                    name="search"
                                    defaultValue={filters?.search || ""}
                                    placeholder={`Search ${title.toLowerCase()}...`}
                                    className="pl-9"
                                />
                            </div>
                            <Button type="submit" variant="secondary">
                                <Search size={15} />
                                Search
                            </Button>
                            <Button
                                as={Link}
                                href={route(`${routeBase}.index`)}
                                variant="ghost"
                            >
                                Reset
                            </Button>
                        </form>
                    </CardBody>
                </Card>

                <Card>
                    <div className="flex items-center gap-3 border-b border-ink-100 px-5 py-4 sm:px-6">
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700">
                            <Icon size={19} />
                        </span>
                        <div>
                            <h2 className="font-black text-ink-950">
                                {title} directory
                            </h2>
                            <p className="mt-0.5 text-xs text-ink-400">
                                Manage catalog classification and display order.
                            </p>
                        </div>
                    </div>

                    <div className="p-3 sm:p-4">
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <tr>
                                        <TableHeader>Name</TableHeader>
                                        {columns.map((column) => (
                                            <TableHeader key={column.key}>
                                                {column.label}
                                            </TableHeader>
                                        ))}
                                        <TableHeader>Status</TableHeader>
                                        <TableHeader className="text-right">
                                            Actions
                                        </TableHeader>
                                    </tr>
                                </TableHead>

                                <TableBody>
                                    {rows.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink-100 text-ink-500">
                                                        <Icon size={17} />
                                                    </span>
                                                    <div className="min-w-0">
                                                        <p className="max-w-64 truncate font-black text-ink-900">
                                                            {item.name}
                                                        </p>
                                                        {item.name_bn && (
                                                            <p className="mt-0.5 max-w-64 truncate text-[11px] text-ink-400">
                                                                {item.name_bn}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {columns.map((column) => (
                                                <TableCell key={column.key}>
                                                    {column.render
                                                        ? column.render(item)
                                                        : item[column.key] ??
                                                          "—"}
                                                </TableCell>
                                            ))}

                                            <TableCell>
                                                <Badge
                                                    tone={
                                                        item.status
                                                            ? "success"
                                                            : "neutral"
                                                    }
                                                    dot
                                                >
                                                    {item.status
                                                        ? "Active"
                                                        : "Inactive"}
                                                </Badge>
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        as={Link}
                                                        href={route(
                                                            `${routeBase}.edit`,
                                                            item.id,
                                                        )}
                                                        variant="ghost"
                                                        size="icon"
                                                        title="Edit"
                                                    >
                                                        <Edit3 size={16} />
                                                    </Button>

                                                    {canDelete && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            title="Delete"
                                                            className="text-rose-600 hover:bg-rose-50"
                                                            onClick={() =>
                                                                remove(item)
                                                            }
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {rows.length === 0 && (
                            <div className="py-14 text-center">
                                <Icon
                                    size={32}
                                    className="mx-auto text-ink-300"
                                />
                                <p className="mt-3 font-black text-ink-700">
                                    No records found
                                </p>
                                <p className="mt-1 text-xs text-ink-400">
                                    Create your first {entity.replace("-", " ")}.
                                </p>
                            </div>
                        )}

                        {(items?.links || []).length > 0 && (
                            <div className="mt-4 flex flex-wrap justify-center gap-2">
                                {items.links.map((link, index) =>
                                    link.url ? (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            preserveScroll
                                            preserveState
                                            className={`rounded-lg border px-3 py-2 text-xs font-black ${
                                                link.active
                                                    ? "border-brand-700 bg-brand-700 text-white"
                                                    : "border-ink-200 bg-white text-ink-600 hover:bg-ink-50"
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ) : (
                                        <span
                                            key={index}
                                            className="rounded-lg border border-ink-100 px-3 py-2 text-xs text-ink-300"
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ),
                                )}
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}

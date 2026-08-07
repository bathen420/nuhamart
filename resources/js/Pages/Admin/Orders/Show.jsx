import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import {
    ArrowLeft,
    CheckCircle2,
    Clock3,
    Download,
    FileText,
    MapPin,
    PackageCheck,
    Phone,
    Printer,
    RefreshCw,
    Save,
    ShoppingBag,
    Truck,
    UserRound,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
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
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableHeader,
    TableRow,
    Textarea,
} from "@/Components/Admin/UI";

const orderTones = {
    pending: "warning",
    confirmed: "info",
    processing: "brand",
    shipped: "purple",
    delivered: "success",
    cancelled: "danger",
};

const paymentTones = {
    pending: "warning",
    paid: "success",
    failed: "danger",
};

const formatStatus = (value) =>
    String(value || "n/a")
        .replaceAll("_", " ")
        .replace(/\b\w/g, (character) => character.toUpperCase());

export default function Show({ order }) {
    const { businessSettings = {} } = usePage().props;
    const currency = businessSettings.currency_symbol || "৳";
    const consignment = order.courier_consignments?.[0] || null;
    const histories = order.status_histories || [];

    const workflow = useForm({
        status: order.status || "pending",
        payment_status: order.payment_status || "pending",
        courier_name: order.courier_name || "",
        tracking_number: order.tracking_number || "",
        admin_note: order.admin_note || "",
    });

    const money = (value) =>
        `${currency}${new Intl.NumberFormat("en-BD", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(Number(value || 0))}`;

    const submitWorkflow = (event) => {
        event.preventDefault();
        workflow.patch(route("admin.orders.workflow.update", order.id), {
            preserveScroll: true,
        });
    };

    const address = [
        order.address,
        order.area,
        order.district,
        order.division,
    ]
        .filter(Boolean)
        .join(", ");

    return (
        <AuthenticatedLayout>
            <Head title={`Order ${order.order_no}`} />

            <div className="space-y-6">
                <PageHeader
                    eyebrow="Order workspace"
                    title={order.order_no || `Order #${order.id}`}
                    description="Review products, customer details, payment, fulfilment and courier history."
                    actions={
                        <>
                            <Button
                                as={Link}
                                href={route("admin.orders.index")}
                                variant="secondary"
                            >
                                <ArrowLeft size={16} />
                                Orders
                            </Button>
                            <Button
                                as="a"
                                href={route("admin.orders.pdf", order.id)}
                                target="_blank"
                                variant="secondary"
                            >
                                <Download size={16} />
                                Invoice PDF
                            </Button>
                            <Button
                                type="button"
                                onClick={() => window.print()}
                            >
                                <Printer size={16} />
                                Print
                            </Button>
                        </>
                    }
                >
                    <div className="mt-3 flex flex-wrap gap-2">
                        <Badge
                            tone={orderTones[order.status] || "neutral"}
                            dot
                        >
                            {formatStatus(order.status)}
                        </Badge>
                        <Badge
                            tone={
                                paymentTones[order.payment_status] || "neutral"
                            }
                            dot
                        >
                            {formatStatus(order.payment_status)}
                        </Badge>
                        <Badge tone="brand">
                            {order.items?.length || 0} item(s)
                        </Badge>
                    </div>
                </PageHeader>

                {order.cancellation_requested_at && (
                    <Alert
                        variant="warning"
                        title="Customer requested cancellation"
                    >
                        {order.cancellation_reason ||
                            "No cancellation reason was provided."}
                    </Alert>
                )}

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_390px]">
                    <main className="min-w-0 space-y-6">
                        <Card>
                            <CardHeader
                                title="Ordered products"
                                description="Items and quantities included in this order."
                            />
                            <CardBody className="p-3 sm:p-4">
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <tr>
                                                <TableHeader>
                                                    Product
                                                </TableHeader>
                                                <TableHeader className="text-center">
                                                    Qty
                                                </TableHeader>
                                                <TableHeader className="text-right">
                                                    Unit price
                                                </TableHeader>
                                                <TableHeader className="text-right">
                                                    Total
                                                </TableHeader>
                                            </tr>
                                        </TableHead>
                                        <TableBody>
                                            {(order.items || []).map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-xl bg-ink-100 text-ink-400">
                                                                {item.product
                                                                    ?.image ? (
                                                                    <img
                                                                        src={`/storage/${item.product.image}`}
                                                                        alt={
                                                                            item.product_name
                                                                        }
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <ShoppingBag
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                )}
                                                            </span>
                                                            <div>
                                                                <p className="font-black text-ink-900">
                                                                    {item.product_name ||
                                                                        item
                                                                            .product
                                                                            ?.name ||
                                                                        "Product"}
                                                                </p>
                                                                <p className="mt-1 text-[10px] text-ink-400">
                                                                    SKU:{" "}
                                                                    {item.sku ||
                                                                        item
                                                                            .product
                                                                            ?.sku ||
                                                                        "—"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center font-black">
                                                        {item.quantity}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {money(item.unit_price)}
                                                    </TableCell>
                                                    <TableCell className="text-right font-black text-ink-950">
                                                        {money(item.subtotal)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader
                                title="Workflow control"
                                description="Update fulfilment, payment and tracking details."
                            />
                            <CardBody>
                                <form
                                    onSubmit={submitWorkflow}
                                    className="grid gap-5 md:grid-cols-2"
                                >
                                    <FormField
                                        label="Order status"
                                        error={workflow.errors.status}
                                    >
                                        <Select
                                            value={workflow.data.status}
                                            onChange={(event) =>
                                                workflow.setData(
                                                    "status",
                                                    event.target.value,
                                                )
                                            }
                                        >
                                            {[
                                                "pending",
                                                "confirmed",
                                                "processing",
                                                "shipped",
                                                "delivered",
                                                "cancelled",
                                            ].map((value) => (
                                                <option
                                                    key={value}
                                                    value={value}
                                                >
                                                    {formatStatus(value)}
                                                </option>
                                            ))}
                                        </Select>
                                    </FormField>

                                    <FormField
                                        label="Payment status"
                                        error={
                                            workflow.errors.payment_status
                                        }
                                    >
                                        <Select
                                            value={
                                                workflow.data.payment_status
                                            }
                                            onChange={(event) =>
                                                workflow.setData(
                                                    "payment_status",
                                                    event.target.value,
                                                )
                                            }
                                        >
                                            {["pending", "paid", "failed"].map(
                                                (value) => (
                                                    <option
                                                        key={value}
                                                        value={value}
                                                    >
                                                        {formatStatus(value)}
                                                    </option>
                                                ),
                                            )}
                                        </Select>
                                    </FormField>

                                    <FormField label="Courier name">
                                        <Input
                                            value={workflow.data.courier_name}
                                            onChange={(event) =>
                                                workflow.setData(
                                                    "courier_name",
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Steadfast / Pathao"
                                        />
                                    </FormField>

                                    <FormField label="Tracking number">
                                        <Input
                                            value={
                                                workflow.data.tracking_number
                                            }
                                            onChange={(event) =>
                                                workflow.setData(
                                                    "tracking_number",
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </FormField>

                                    <FormField
                                        label="Internal admin note"
                                        className="md:col-span-2"
                                    >
                                        <Textarea
                                            value={workflow.data.admin_note}
                                            onChange={(event) =>
                                                workflow.setData(
                                                    "admin_note",
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </FormField>

                                    <div className="md:col-span-2 flex justify-end">
                                        <Button
                                            type="submit"
                                            loading={workflow.processing}
                                        >
                                            <Save size={16} />
                                            Save workflow
                                        </Button>
                                    </div>
                                </form>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader
                                title="Order timeline"
                                description="Status changes recorded for this order."
                            />
                            <CardBody>
                                {histories.length > 0 ? (
                                    <div className="relative space-y-1 before:absolute before:bottom-4 before:left-[19px] before:top-4 before:w-px before:bg-ink-200">
                                        {histories.map((history, index) => (
                                            <div
                                                key={history.id || index}
                                                className="relative flex gap-3 rounded-2xl py-3"
                                            >
                                                <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-brand-100 bg-brand-50 text-brand-700">
                                                    {index === 0 ? (
                                                        <Clock3 size={17} />
                                                    ) : (
                                                        <CheckCircle2
                                                            size={17}
                                                        />
                                                    )}
                                                </span>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <p className="font-black text-ink-800">
                                                            {history.title ||
                                                                formatStatus(
                                                                    history.status,
                                                                )}
                                                        </p>
                                                        <Badge
                                                            tone={
                                                                orderTones[
                                                                    history
                                                                        .status
                                                                ] || "neutral"
                                                            }
                                                        >
                                                            {formatStatus(
                                                                history.status,
                                                            )}
                                                        </Badge>
                                                    </div>
                                                    {history.note && (
                                                        <p className="mt-1 text-sm text-ink-500">
                                                            {history.note}
                                                        </p>
                                                    )}
                                                    <p className="mt-1 text-[10px] font-medium text-ink-400">
                                                        {history.recorded_at
                                                            ? new Date(
                                                                  history.recorded_at,
                                                              ).toLocaleString()
                                                            : ""}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-2xl border border-dashed border-ink-200 bg-ink-50 p-10 text-center">
                                        <Clock3
                                            size={28}
                                            className="mx-auto text-ink-300"
                                        />
                                        <p className="mt-3 font-black text-ink-600">
                                            No timeline entries
                                        </p>
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    </main>

                    <aside className="h-fit space-y-6 xl:sticky xl:top-28">
                        <Card>
                            <CardHeader title="Order summary" />
                            <CardBody className="space-y-3">
                                {[
                                    ["Subtotal", money(order.subtotal)],
                                    ["Discount", `− ${money(order.discount)}`],
                                    [
                                        "Shipping",
                                        money(order.shipping_charge),
                                    ],
                                ].map(([label, value]) => (
                                    <div
                                        key={label}
                                        className="flex items-center justify-between text-sm"
                                    >
                                        <span className="text-ink-500">
                                            {label}
                                        </span>
                                        <span className="font-black text-ink-800">
                                            {value}
                                        </span>
                                    </div>
                                ))}
                                <div className="border-t border-ink-200 pt-4">
                                    <div className="flex items-center justify-between">
                                        <span className="font-black text-ink-900">
                                            Grand total
                                        </span>
                                        <span className="text-2xl font-black text-brand-700">
                                            {money(order.total)}
                                        </span>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader
                                title="Customer & delivery"
                                description="Recipient and shipping location."
                            />
                            <CardBody className="space-y-4">
                                <div className="flex gap-3">
                                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                                        <UserRound size={18} />
                                    </span>
                                    <div>
                                        <p className="font-black text-ink-900">
                                            {order.customer_name}
                                        </p>
                                        <p className="mt-1 text-xs text-ink-400">
                                            {order.customer_email || "No email"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3 text-sm">
                                    <Phone
                                        size={16}
                                        className="mt-0.5 shrink-0 text-ink-400"
                                    />
                                    <span className="font-bold text-ink-700">
                                        {order.customer_phone}
                                    </span>
                                </div>
                                <div className="flex gap-3 text-sm">
                                    <MapPin
                                        size={16}
                                        className="mt-0.5 shrink-0 text-ink-400"
                                    />
                                    <span className="leading-6 text-ink-600">
                                        {address || "No address"}
                                    </span>
                                </div>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader
                                title="Courier delivery"
                                description="Book or synchronize parcel delivery."
                            />
                            <CardBody>
                                {consignment ? (
                                    <div className="space-y-4">
                                        <div className="rounded-2xl bg-brand-50 p-4">
                                            <div className="flex items-center gap-3">
                                                <Truck
                                                    size={20}
                                                    className="text-brand-700"
                                                />
                                                <div>
                                                    <p className="font-black capitalize text-ink-900">
                                                        {
                                                            consignment.provider
                                                        }
                                                    </p>
                                                    <p className="mt-1 text-xs text-ink-500">
                                                        {consignment.tracking_code ||
                                                            "Tracking pending"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex items-center justify-between">
                                                <Badge tone="brand" dot>
                                                    {formatStatus(
                                                        consignment.status,
                                                    )}
                                                </Badge>
                                                <span className="text-[10px] text-ink-400">
                                                    {consignment.last_synced_at
                                                        ? new Date(
                                                              consignment.last_synced_at,
                                                          ).toLocaleString()
                                                        : "Never synced"}
                                                </span>
                                            </div>
                                        </div>

                                        {consignment.last_error && (
                                            <Alert variant="danger">
                                                {consignment.last_error}
                                            </Alert>
                                        )}

                                        <Button
                                            type="button"
                                            variant="secondary"
                                            className="w-full"
                                            onClick={() =>
                                                router.post(
                                                    route(
                                                        "admin.courier-consignments.sync",
                                                        consignment.id,
                                                    ),
                                                    {},
                                                    {
                                                        preserveScroll: true,
                                                    },
                                                )
                                            }
                                        >
                                            <RefreshCw size={16} />
                                            Sync courier status
                                        </Button>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="rounded-2xl border border-dashed border-ink-200 bg-ink-50 p-6 text-center">
                                            <PackageCheck
                                                size={27}
                                                className="mx-auto text-ink-300"
                                            />
                                            <p className="mt-3 text-sm font-black text-ink-700">
                                                Not sent to courier
                                            </p>
                                        </div>
                                        <Button
                                            type="button"
                                            className="mt-4 w-full"
                                            onClick={() =>
                                                router.post(
                                                    route(
                                                        "admin.orders.courier-consignments.store",
                                                        order.id,
                                                    ),
                                                    {
                                                        provider: "steadfast",
                                                    },
                                                    {
                                                        preserveScroll: true,
                                                    },
                                                )
                                            }
                                        >
                                            <Truck size={16} />
                                            Send to Steadfast
                                        </Button>
                                    </div>
                                )}
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader title="Notes" />
                            <CardBody>
                                <p className="whitespace-pre-line text-sm leading-6 text-ink-600">
                                    {order.note || "No customer note."}
                                </p>
                                {order.admin_note && (
                                    <div className="mt-4 rounded-2xl bg-amber-50 p-4">
                                        <p className="text-xs font-black uppercase tracking-wider text-amber-700">
                                            Internal note
                                        </p>
                                        <p className="mt-2 text-sm leading-6 text-amber-900">
                                            {order.admin_note}
                                        </p>
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    </aside>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

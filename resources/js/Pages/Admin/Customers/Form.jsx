import { Link } from "@inertiajs/react";
import {
    Mail,
    MapPin,
    Phone,
    Save,
    StickyNote,
    UserRound,
    Wallet,
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
    Textarea,
    Toggle,
} from "@/Components/Admin/UI";

export default function Form({
    data,
    setData,
    errors,
    processing,
    submitLabel,
    onSubmit,
    customerCode,
}) {
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            {errors.error && (
                <Alert variant="danger" title="Unable to save customer">
                    {errors.error}
                </Alert>
            )}

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
                <main className="space-y-6">
                    <Card>
                        <CardHeader
                            title="Customer identity"
                            description="Primary contact and account information."
                        />
                        <CardBody className="grid gap-5 md:grid-cols-2">
                            <FormField
                                label="Full name"
                                required
                                error={errors.name}
                            >
                                <Input
                                    value={data.name}
                                    onChange={(event) =>
                                        setData("name", event.target.value)
                                    }
                                    invalid={Boolean(errors.name)}
                                    placeholder="Customer full name"
                                />
                            </FormField>

                            <FormField
                                label="Phone number"
                                required
                                error={errors.phone}
                            >
                                <Input
                                    value={data.phone}
                                    onChange={(event) =>
                                        setData("phone", event.target.value)
                                    }
                                    invalid={Boolean(errors.phone)}
                                    placeholder="01XXXXXXXXX"
                                />
                            </FormField>

                            <FormField
                                label="Email address"
                                error={errors.email}
                            >
                                <Input
                                    type="email"
                                    value={data.email}
                                    onChange={(event) =>
                                        setData("email", event.target.value)
                                    }
                                    invalid={Boolean(errors.email)}
                                    placeholder="customer@example.com"
                                />
                            </FormField>

                            <FormField
                                label="Opening balance"
                                error={errors.opening_balance}
                                description="Existing receivable balance when creating the customer."
                            >
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={data.opening_balance}
                                    onChange={(event) =>
                                        setData(
                                            "opening_balance",
                                            event.target.value,
                                        )
                                    }
                                    invalid={Boolean(errors.opening_balance)}
                                />
                            </FormField>

                            <FormField
                                label="Address"
                                error={errors.address}
                                className="md:col-span-2"
                            >
                                <Textarea
                                    rows={4}
                                    value={data.address}
                                    onChange={(event) =>
                                        setData("address", event.target.value)
                                    }
                                    invalid={Boolean(errors.address)}
                                    placeholder="Customer address"
                                />
                            </FormField>

                            <FormField
                                label="Internal notes"
                                error={errors.notes}
                                className="md:col-span-2"
                            >
                                <Textarea
                                    rows={5}
                                    value={data.notes}
                                    onChange={(event) =>
                                        setData("notes", event.target.value)
                                    }
                                    invalid={Boolean(errors.notes)}
                                    placeholder="Preferences, delivery instructions or internal notes"
                                />
                            </FormField>

                            <Toggle
                                checked={Boolean(data.status)}
                                onChange={(checked) =>
                                    setData("status", checked)
                                }
                                label="Active customer"
                                description="Inactive customers remain in historical records."
                                className="md:col-span-2"
                            />
                        </CardBody>
                    </Card>
                </main>

                <aside className="h-fit xl:sticky xl:top-28">
                    <Card>
                        <CardHeader
                            title="Profile preview"
                            description="CRM identity preview."
                        />
                        <CardBody>
                            <div className="rounded-3xl bg-gradient-to-br from-ink-950 to-brand-950 p-5 text-white">
                                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-lg font-black">
                                    {(data.name || "Customer")
                                        .split(/\s+/)
                                        .slice(0, 2)
                                        .map((part) => part.charAt(0))
                                        .join("")
                                        .toUpperCase()}
                                </span>
                                <h3 className="mt-4 text-xl font-black text-white">
                                    {data.name || "Customer name"}
                                </h3>
                                <p className="mt-1 text-xs font-bold text-brand-200">
                                    {customerCode || "Code generated automatically"}
                                </p>

                                <div className="mt-5 space-y-3 text-sm">
                                    <div className="flex items-center gap-3">
                                        <Phone size={15} className="text-brand-300" />
                                        <span>{data.phone || "Phone number"}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail size={15} className="text-brand-300" />
                                        <span className="truncate">
                                            {data.email || "No email"}
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin
                                            size={15}
                                            className="mt-0.5 text-brand-300"
                                        />
                                        <span className="line-clamp-2">
                                            {data.address || "No address"}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-5 flex gap-2">
                                    <Badge
                                        tone={data.status ? "success" : "neutral"}
                                        dot
                                    >
                                        {data.status ? "Active" : "Inactive"}
                                    </Badge>
                                    <Badge tone="brand">CRM</Badge>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                loading={processing}
                                className="mt-5 w-full"
                            >
                                <Save size={16} />
                                {submitLabel}
                            </Button>

                            <Button
                                as={Link}
                                href={route("admin.customers.index")}
                                variant="secondary"
                                className="mt-2 w-full"
                            >
                                Cancel
                            </Button>
                        </CardBody>
                    </Card>
                </aside>
            </div>
        </form>
    );
}

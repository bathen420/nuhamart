import { useMemo, useState } from "react";
import {
    BadgeDollarSign,
    BookOpen,
    Boxes,
    FileText,
    Image,
    Package,
    Save,
    Search,
    Settings2,
    Upload,
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
    Select,
    Textarea,
    Toggle,
} from "@/Components/Admin/UI";
import cn from "@/lib/cn";

const tabs = [
    ["general", "General", Package],
    ["pricing", "Pricing", BadgeDollarSign],
    ["inventory", "Inventory", Boxes],
    ["book", "Book & Digital", BookOpen],
    ["media", "Media", Image],
    ["seo", "SEO", Search],
    ["advanced", "Advanced", Settings2],
];

export default function Form({
    data,
    setData,
    errors,
    processing,
    submit,
    categories = [],
    brands = [],
    authors = [],
    publishers = [],
    buttonText,
    product = null,
}) {
    const [active, setActive] = useState("general");
    const [imagePreview, setImagePreview] = useState(
        product?.image ? `/storage/${product.image}` : null,
    );
    const [galleryPreviews, setGalleryPreviews] = useState(
        Array.isArray(product?.gallery_images)
            ? product.gallery_images.map((path) => `/storage/${path}`)
            : [],
    );

    const effectivePrice = Number(data.discount_price || data.price || 0);
    const stockTone =
        Number(data.stock_quantity || 0) <= 0
            ? "danger"
            : Number(data.stock_quantity || 0) <= 5
              ? "warning"
              : "success";

    const titlePreview = data.seo_title || data.name || "Product title";
    const descriptionPreview =
        data.seo_description ||
        data.short_description ||
        "Add a short description to preview search results.";

    const selectField = (name, label, options, placeholder = "Select") => (
        <FormField label={label} error={errors[name]}>
            <Select
                value={data[name] ?? ""}
                onChange={(event) => setData(name, event.target.value)}
                invalid={Boolean(errors[name])}
            >
                <option value="">{placeholder}</option>
                {options.map((item) => (
                    <option key={item.id} value={item.id}>
                        {item.name}
                    </option>
                ))}
            </Select>
        </FormField>
    );

    const textField = (name, label, type = "text", props = {}) => (
        <FormField label={label} error={errors[name]} {...props}>
            <Input
                type={type}
                value={data[name] ?? ""}
                onChange={(event) => setData(name, event.target.value)}
                invalid={Boolean(errors[name])}
            />
        </FormField>
    );

    return (
        <form onSubmit={submit} className="space-y-6">
            {errors.error && (
                <Alert variant="danger" title="Product could not be saved">
                    {errors.error}
                </Alert>
            )}

            <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] 2xl:grid-cols-[220px_minmax(0,1fr)_340px]">
                <aside className="h-fit lg:sticky lg:top-28">
                    <Card>
                        <CardBody className="p-3">
                            <nav className="space-y-1">
                                {tabs.map(([key, label, Icon]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setActive(key)}
                                        className={cn(
                                            "flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left text-sm font-black transition",
                                            active === key
                                                ? "border-brand-200 bg-brand-50 text-brand-800"
                                                : "border-transparent text-ink-600 hover:bg-ink-50",
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "grid h-9 w-9 place-items-center rounded-xl",
                                                active === key
                                                    ? "bg-white text-brand-700 shadow-sm"
                                                    : "bg-ink-50 text-ink-500",
                                            )}
                                        >
                                            <Icon size={18} />
                                        </span>
                                        {label}
                                    </button>
                                ))}
                            </nav>
                        </CardBody>
                    </Card>
                </aside>

                <main className="min-w-0 space-y-6">
                    {active === "general" && (
                        <Card>
                            <CardHeader
                                title="General information"
                                description="Core identity and catalog placement."
                            />
                            <CardBody className="grid gap-5 md:grid-cols-2">
                                {textField("name", "Product name")}
                                {textField("name_bn", "Product name (Bangla)")}
                                {selectField(
                                    "category_id",
                                    "Category",
                                    categories,
                                    "Select category",
                                )}
                                {selectField(
                                    "brand_id",
                                    "Brand",
                                    brands,
                                    "Select brand",
                                )}
                                {textField("sku", "SKU")}
                                {textField("sort_order", "Sort order", "number")}
                                <FormField
                                    label="Short description"
                                    error={errors.short_description}
                                    className="md:col-span-2"
                                >
                                    <Textarea
                                        value={data.short_description ?? ""}
                                        onChange={(event) =>
                                            setData(
                                                "short_description",
                                                event.target.value,
                                            )
                                        }
                                    />
                                </FormField>
                                <FormField
                                    label="Short description (Bangla)"
                                    error={errors.short_description_bn}
                                    className="md:col-span-2"
                                >
                                    <Textarea
                                        value={data.short_description_bn ?? ""}
                                        onChange={(event) =>
                                            setData(
                                                "short_description_bn",
                                                event.target.value,
                                            )
                                        }
                                    />
                                </FormField>
                                <FormField
                                    label="Full description"
                                    error={errors.description}
                                    className="md:col-span-2"
                                >
                                    <Textarea
                                        rows={7}
                                        value={data.description ?? ""}
                                        onChange={(event) =>
                                            setData(
                                                "description",
                                                event.target.value,
                                            )
                                        }
                                    />
                                </FormField>
                                <FormField
                                    label="Full description (Bangla)"
                                    error={errors.description_bn}
                                    className="md:col-span-2"
                                >
                                    <Textarea
                                        rows={7}
                                        value={data.description_bn ?? ""}
                                        onChange={(event) =>
                                            setData(
                                                "description_bn",
                                                event.target.value,
                                            )
                                        }
                                    />
                                </FormField>
                            </CardBody>
                        </Card>
                    )}

                    {active === "pricing" && (
                        <Card>
                            <CardHeader
                                title="Pricing"
                                description="Selling price and promotional pricing."
                            />
                            <CardBody className="grid gap-5 md:grid-cols-2">
                                {textField("price", "Regular price", "number")}
                                {textField(
                                    "discount_price",
                                    "Discount price",
                                    "number",
                                )}
                                {textField(
                                    "ebook_price",
                                    "Ebook price",
                                    "number",
                                )}
                                <div className="rounded-2xl border border-brand-100 bg-brand-50 p-4">
                                    <p className="text-xs font-black uppercase tracking-wider text-brand-700">
                                        Effective storefront price
                                    </p>
                                    <p className="mt-2 text-2xl font-black text-ink-950">
                                        ৳
                                        {effectivePrice.toLocaleString("en-BD", {
                                            minimumFractionDigits: 2,
                                        })}
                                    </p>
                                </div>
                            </CardBody>
                        </Card>
                    )}

                    {active === "inventory" && (
                        <Card>
                            <CardHeader
                                title="Inventory & barcode"
                                description="Stock quantity, SKU and barcode controls."
                            />
                            <CardBody className="grid gap-5 md:grid-cols-2">
                                {textField(
                                    "stock_quantity",
                                    "Stock quantity",
                                    "number",
                                )}
                                {textField("barcode", "Barcode")}
                                <FormField label="Barcode type">
                                    <Select
                                        value={data.barcode_type ?? "code128"}
                                        onChange={(event) =>
                                            setData(
                                                "barcode_type",
                                                event.target.value,
                                            )
                                        }
                                    >
                                        <option value="code128">Code 128</option>
                                        <option value="ean13">EAN-13</option>
                                    </Select>
                                </FormField>
                                <div className="flex items-center">
                                    <Badge tone={stockTone} dot>
                                        {Number(data.stock_quantity || 0) <= 0
                                            ? "Out of stock"
                                            : `${data.stock_quantity || 0} in stock`}
                                    </Badge>
                                </div>
                            </CardBody>
                        </Card>
                    )}

                    {active === "book" && (
                        <Card>
                            <CardHeader
                                title="Book & digital details"
                                description="Publishing metadata and digital-delivery options."
                            />
                            <CardBody className="grid gap-5 md:grid-cols-2">
                                <FormField label="Product type">
                                    <Select
                                        value={data.product_type ?? "physical"}
                                        onChange={(event) =>
                                            setData(
                                                "product_type",
                                                event.target.value,
                                            )
                                        }
                                    >
                                        <option value="physical">
                                            Physical / hardcopy
                                        </option>
                                        <option value="ebook">Ebook</option>
                                        <option value="both">
                                            Physical + Ebook
                                        </option>
                                    </Select>
                                </FormField>
                                {textField("isbn", "ISBN")}
                                {selectField(
                                    "author_id",
                                    "Author",
                                    authors,
                                    "Not applicable",
                                )}
                                {selectField(
                                    "publisher_id",
                                    "Publisher",
                                    publishers,
                                    "Not applicable",
                                )}
                                {textField("edition", "Edition")}
                                {textField("language", "Language")}
                                {textField("pages", "Pages", "number")}
                                {textField(
                                    "publication_year",
                                    "Publication year",
                                    "number",
                                )}
                                {textField("binding", "Binding")}
                                {textField("weight", "Weight (kg)", "number")}
                                {textField("dimensions", "Dimensions")}
                                <FormField
                                    label="Sample PDF"
                                    error={errors.sample_file}
                                >
                                    <Input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(event) =>
                                            setData(
                                                "sample_file",
                                                event.target.files?.[0] || null,
                                            )
                                        }
                                    />
                                </FormField>
                            </CardBody>
                        </Card>
                    )}

                    {active === "media" && (
                        <Card>
                            <CardHeader
                                title="Product media"
                                description="Primary cover image and gallery."
                            />
                            <CardBody className="space-y-6">
                                <div className="grid gap-5 md:grid-cols-2">
                                    <FormField
                                        label="Primary image"
                                        error={errors.image}
                                    >
                                        <label className="grid min-h-52 cursor-pointer place-items-center rounded-2xl border border-dashed border-ink-300 bg-ink-50 p-4 transition hover:border-brand-300 hover:bg-brand-50/40">
                                            {imagePreview ? (
                                                <img
                                                    src={imagePreview}
                                                    alt="Product preview"
                                                    className="max-h-44 object-contain"
                                                />
                                            ) : (
                                                <div className="text-center">
                                                    <Upload
                                                        size={28}
                                                        className="mx-auto text-ink-300"
                                                    />
                                                    <p className="mt-3 text-sm font-black text-ink-600">
                                                        Upload cover image
                                                    </p>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/png,image/jpeg,image/webp"
                                                className="hidden"
                                                onChange={(event) => {
                                                    const file =
                                                        event.target.files?.[0] ||
                                                        null;
                                                    setData("image", file);
                                                    if (file) {
                                                        setImagePreview(
                                                            URL.createObjectURL(
                                                                file,
                                                            ),
                                                        );
                                                    }
                                                }}
                                            />
                                        </label>
                                    </FormField>

                                    <FormField
                                        label="Gallery images"
                                        error={
                                            errors.gallery_images ||
                                            errors["gallery_images.0"]
                                        }
                                    >
                                        <label className="grid min-h-52 cursor-pointer place-items-center rounded-2xl border border-dashed border-ink-300 bg-ink-50 p-4 transition hover:border-brand-300 hover:bg-brand-50/40">
                                            <div className="text-center">
                                                <Image
                                                    size={28}
                                                    className="mx-auto text-ink-300"
                                                />
                                                <p className="mt-3 text-sm font-black text-ink-600">
                                                    Select up to 6 images
                                                </p>
                                            </div>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/png,image/jpeg,image/webp"
                                                className="hidden"
                                                onChange={(event) => {
                                                    const files = Array.from(
                                                        event.target.files || [],
                                                    );
                                                    setData(
                                                        "gallery_images",
                                                        files,
                                                    );
                                                    setGalleryPreviews(
                                                        files.map((file) =>
                                                            URL.createObjectURL(
                                                                file,
                                                            ),
                                                        ),
                                                    );
                                                }}
                                            />
                                        </label>
                                    </FormField>
                                </div>

                                {galleryPreviews.length > 0 && (
                                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                                        {galleryPreviews.map((src, index) => (
                                            <div
                                                key={`${src}-${index}`}
                                                className="grid aspect-square place-items-center overflow-hidden rounded-xl border border-ink-200 bg-ink-50 p-2"
                                            >
                                                <img
                                                    src={src}
                                                    alt={`Gallery ${index + 1}`}
                                                    className="h-full w-full object-contain"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    )}

                    {active === "seo" && (
                        <Card>
                            <CardHeader
                                title="Search engine preview"
                                description="Control how the product appears in search results."
                            />
                            <CardBody className="space-y-5">
                                {textField("seo_title", "SEO title")}
                                <FormField
                                    label="SEO description"
                                    error={errors.seo_description}
                                >
                                    <Textarea
                                        value={data.seo_description ?? ""}
                                        onChange={(event) =>
                                            setData(
                                                "seo_description",
                                                event.target.value,
                                            )
                                        }
                                    />
                                </FormField>

                                <div className="rounded-2xl border border-ink-200 bg-white p-5">
                                    <p className="text-lg font-medium text-blue-700">
                                        {titlePreview}
                                    </p>
                                    <p className="mt-1 text-sm text-emerald-700">
                                        /products/product-slug
                                    </p>
                                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink-600">
                                        {descriptionPreview}
                                    </p>
                                </div>
                            </CardBody>
                        </Card>
                    )}

                    {active === "advanced" && (
                        <Card>
                            <CardHeader
                                title="Publishing controls"
                                description="Visibility and merchandising flags."
                            />
                            <CardBody className="grid gap-4 md:grid-cols-2">
                                <Toggle
                                    checked={Boolean(data.status)}
                                    onChange={(checked) =>
                                        setData("status", checked ? 1 : 0)
                                    }
                                    label="Active product"
                                    description="Visible in admin workflows and storefront."
                                />
                                <Toggle
                                    checked={Boolean(data.is_featured)}
                                    onChange={(checked) =>
                                        setData(
                                            "is_featured",
                                            checked ? 1 : 0,
                                        )
                                    }
                                    label="Featured"
                                />
                                <Toggle
                                    checked={Boolean(data.is_new_arrival)}
                                    onChange={(checked) =>
                                        setData(
                                            "is_new_arrival",
                                            checked ? 1 : 0,
                                        )
                                    }
                                    label="New arrival"
                                />
                                <Toggle
                                    checked={Boolean(data.is_best_seller)}
                                    onChange={(checked) =>
                                        setData(
                                            "is_best_seller",
                                            checked ? 1 : 0,
                                        )
                                    }
                                    label="Best seller"
                                />
                            </CardBody>
                        </Card>
                    )}
                </main>

                <aside className="hidden h-fit 2xl:sticky 2xl:top-28 2xl:block">
                    <Card>
                        <CardHeader
                            title="Product preview"
                            description="Approximate storefront appearance."
                        />
                        <CardBody>
                            <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white">
                                <div className="grid aspect-[4/3] place-items-center bg-ink-50 p-5">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt={data.name || "Product"}
                                            className="h-full w-full object-contain"
                                        />
                                    ) : (
                                        <Package
                                            size={44}
                                            className="text-ink-300"
                                        />
                                    )}
                                </div>
                                <div className="p-4">
                                    <div className="flex flex-wrap gap-2">
                                        {Boolean(data.is_featured) && (
                                            <Badge tone="brand">Featured</Badge>
                                        )}
                                        {Boolean(data.is_new_arrival) && (
                                            <Badge tone="success">New</Badge>
                                        )}
                                    </div>
                                    <h3 className="mt-3 text-lg font-black text-ink-950">
                                        {data.name || "Product name"}
                                    </h3>
                                    <p className="mt-1 line-clamp-2 text-sm text-ink-500">
                                        {data.short_description ||
                                            "Short product description"}
                                    </p>
                                    <div className="mt-4 flex items-end gap-2">
                                        <span className="text-xl font-black text-brand-700">
                                            ৳
                                            {effectivePrice.toLocaleString(
                                                "en-BD",
                                            )}
                                        </span>
                                        {data.discount_price && (
                                            <span className="text-sm text-ink-400 line-through">
                                                ৳
                                                {Number(
                                                    data.price || 0,
                                                ).toLocaleString("en-BD")}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </aside>
            </div>

            <div className="sticky bottom-4 z-20 flex justify-end">
                <Button type="submit" loading={processing} size="lg">
                    <Save size={17} />
                    {buttonText}
                </Button>
            </div>
        </form>
    );
}

import { useState } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";



export default function Form({
    data,
    setData,
    errors,
    processing,
    submit,
    categories,
    brands,
    authors = [],
    publishers = [],
    buttonText,
    product = null,
}) {

    const [preview, setPreview] = useState(
        product?.image ? `/storage/${product.image}` : null
    );

    return (
        <form onSubmit={submit} className="space-y-6">

            {/* Category */}
            <div>
                <InputLabel htmlFor="category_id" value="Category" />

                <select
                    id="category_id"
                    value={data.category_id}
                    onChange={(e) => setData("category_id", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300"
                >
                    <option value="">Select Category</option>

                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>

                <InputError message={errors.category_id} className="mt-2" />
            </div>

            {/* Brand */}
            <div>
                <InputLabel htmlFor="brand_id" value="Brand" />

                <select
                    id="brand_id"
                    value={data.brand_id}
                    onChange={(e) => setData("brand_id", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300"
                >
                    <option value="">Select Brand</option>

                    {brands.map((brand) => (
                        <option key={brand.id} value={brand.id}>
                            {brand.name}
                        </option>
                    ))}
                </select>

                <InputError message={errors.brand_id} className="mt-2" />
            </div>


            <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-5">
                <h3 className="mb-4 text-lg font-bold text-slate-900">Book & Digital Product Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                    <div><InputLabel value="Product Type"/><select className="mt-1 block w-full rounded-md border-gray-300" value={data.product_type} onChange={e=>setData("product_type",e.target.value)}><option value="physical">Physical Product / Hardcopy</option><option value="ebook">Ebook</option><option value="both">Physical + Ebook</option></select><InputError className="mt-2" message={errors.product_type}/></div>
                    <div><InputLabel value="ISBN"/><TextInput className="mt-1 block w-full" value={data.isbn ?? ""} onChange={e=>setData("isbn",e.target.value)}/><InputError className="mt-2" message={errors.isbn}/></div>
                    <div><InputLabel value="Author"/><select className="mt-1 block w-full rounded-md border-gray-300" value={data.author_id ?? ""} onChange={e=>setData("author_id",e.target.value)}><option value="">Not applicable</option>{authors.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></div>
                    <div><InputLabel value="Publisher"/><select className="mt-1 block w-full rounded-md border-gray-300" value={data.publisher_id ?? ""} onChange={e=>setData("publisher_id",e.target.value)}><option value="">Not applicable</option>{publishers.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></div>
                    {[["edition","Edition"],["language","Language"],["pages","Pages"],["publication_year","Publication Year"],["binding","Binding"],["weight","Weight (kg)"],["dimensions","Dimensions"],["ebook_price","Ebook Price"]].map(([field,label])=><div key={field}><InputLabel value={label}/><TextInput type={["pages","publication_year","weight","ebook_price"].includes(field)?"number":"text"} className="mt-1 block w-full" value={data[field] ?? ""} onChange={e=>setData(field,e.target.value)}/><InputError className="mt-2" message={errors[field]}/></div>)}
                </div>
                <div className="mt-4 flex flex-wrap gap-5">{[["is_featured","Featured"],["is_new_arrival","New Arrival"],["is_best_seller","Best Seller"]].map(([field,label])=><label key={field} className="flex items-center gap-2"><input type="checkbox" checked={Boolean(data[field])} onChange={e=>setData(field,e.target.checked?1:0)}/><span>{label}</span></label>)}</div>
            </div>

            {/* Product Name */}
            <div>
                <InputLabel htmlFor="name" value="Product Name" />

                <TextInput
                    id="name"
                    className="mt-1 block w-full"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                />

                <InputError message={errors.name} className="mt-2" />
            </div>

            <div><InputLabel value="Product Name (Bangla)"/><TextInput className="mt-1 block w-full" value={data.name_bn ?? ""} onChange={(e)=>setData("name_bn",e.target.value)}/><InputError message={errors.name_bn} className="mt-2"/></div>

            {/* SKU */}
            <div>
                <InputLabel htmlFor="sku" value="SKU" />

                <TextInput
                    id="sku"
                    className="mt-1 block w-full"
                    value={data.sku}
                    onChange={(e) => setData("sku", e.target.value)}
                />

                <InputError message={errors.sku} className="mt-2" />
            </div>

            {/* Barcode */}
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <InputLabel htmlFor="barcode" value="Barcode (optional)" />
                    <TextInput
                        id="barcode"
                        className="mt-1 block w-full"
                        value={data.barcode ?? ""}
                        onChange={(e) => setData("barcode", e.target.value)}
                        placeholder="Leave blank to generate later"
                    />
                    <InputError message={errors.barcode} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="barcode_type" value="Barcode Type" />
                    <select
                        id="barcode_type"
                        value={data.barcode_type ?? "code128"}
                        onChange={(e) => setData("barcode_type", e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300"
                    >
                        <option value="code128">Code 128</option>
                        <option value="ean13">EAN-13</option>
                    </select>
                    <InputError message={errors.barcode_type} className="mt-2" />
                </div>
            </div>

            {/* Price */}
            <div>
                <InputLabel htmlFor="price" value="Price" />

                <TextInput
                    id="price"
                    type="number"
                    className="mt-1 block w-full"
                    value={data.price}
                    onChange={(e) => setData("price", e.target.value)}
                />

                <InputError message={errors.price} className="mt-2" />
            </div>

            {/* Discount Price */}
            <div>
                <InputLabel
                    htmlFor="discount_price"
                    value="Discount Price"
                />

                <TextInput
                    id="discount_price"
                    type="number"
                    className="mt-1 block w-full"
                    value={data.discount_price}
                    onChange={(e) =>
                        setData("discount_price", e.target.value)
                    }
                />

                <InputError
                    message={errors.discount_price}
                    className="mt-2"
                />
            </div>

            {/* Stock */}
            <div>
                <InputLabel
                    htmlFor="stock_quantity"
                    value="Stock Quantity"
                />

                <TextInput
                    id="stock_quantity"
                    type="number"
                    className="mt-1 block w-full"
                    value={data.stock_quantity}
                    onChange={(e) =>
                        setData("stock_quantity", e.target.value)
                    }
                />

                <InputError
                    message={errors.stock_quantity}
                    className="mt-2"
                />
            </div>

            {/* Short Description */}
            <div>
                <InputLabel
                    htmlFor="short_description"
                    value="Short Description"
                />

                <textarea
                    id="short_description"
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300"
                    value={data.short_description}
                    onChange={(e) =>
                        setData("short_description", e.target.value)
                    }
                />

                <InputError
                    message={errors.short_description}
                    className="mt-2"
                />
            </div>

            {/* Description */}
            <div>
                <InputLabel
                    htmlFor="description"
                    value="Description"
                />

                <textarea
                    id="description"
                    rows="6"
                    className="mt-1 block w-full rounded-md border-gray-300"
                    value={data.description}
                    onChange={(e) =>
                        setData("description", e.target.value)
                    }
                />

                <InputError
                    message={errors.description}
                    className="mt-2"
                />
            </div>

            <div><InputLabel value="Short Description (Bangla)"/><textarea rows="3" className="mt-1 block w-full rounded-md border-gray-300" value={data.short_description_bn ?? ""} onChange={(e)=>setData("short_description_bn",e.target.value)}/><InputError message={errors.short_description_bn} className="mt-2"/></div>
            <div><InputLabel value="Description (Bangla)"/><textarea rows="6" className="mt-1 block w-full rounded-md border-gray-300" value={data.description_bn ?? ""} onChange={(e)=>setData("description_bn",e.target.value)}/><InputError message={errors.description_bn} className="mt-2"/></div>

            {/* Status */}
            <div className="flex items-center gap-2">
                <input
                    id="status"
                    type="checkbox"
                    checked={Boolean(data.status)}
                    onChange={(e) =>
                        setData("status", e.target.checked ? 1 : 0)
                    }
                />

                <label htmlFor="status">Active</label>
            </div>


            {/* Product Image */}
            
            <div>
                <InputLabel htmlFor="image" value="Product Image" />

                <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    className="mt-1 block w-full"
                    onChange={(e) => {
                        const file = e.target.files[0];

                        setData("image", file);

                        if (file) {
                            setPreview(URL.createObjectURL(file));
                        }
                    }}
                />

                {preview && (
                    <div className="mt-4">
                        <img
                            src={preview}
                            alt="Preview"
                            className="h-32 w-32 rounded-lg border object-cover"
                        />
                    </div>
                )}

                <InputError
                    message={errors.image}
                    className="mt-2"
                />
            </div>

            {/* Sort Order */}
            <div>
                <InputLabel htmlFor="sort_order" value="Sort Order" />

                <TextInput
                    id="sort_order"
                    type="number"
                    className="mt-1 block w-full"
                    value={data.sort_order}
                    onChange={(e) =>
                        setData("sort_order", e.target.value)
                    }
                />
                

                <InputError
                    message={errors.sort_order}
                    className="mt-2"
                />
            </div>

            <PrimaryButton disabled={processing}>
                {buttonText}
            </PrimaryButton>
        </form>
    );
}
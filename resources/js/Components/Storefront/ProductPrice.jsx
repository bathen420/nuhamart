function money(value) {
    return new Intl.NumberFormat("en-BD").format(value);
}

export default function ProductPrice({
    price,
    salePrice,
}) {
    const finalPrice = salePrice || price;

    return (
        <div className="space-y-1">
            <div className="flex items-end gap-2">
                <span className="text-2xl font-black text-indigo-600">
                    ৳{money(finalPrice)}
                </span>

                {salePrice && (
                    <span className="text-sm text-gray-400 line-through">
                        ৳{money(price)}
                    </span>
                )}
            </div>
        </div>
    );
}
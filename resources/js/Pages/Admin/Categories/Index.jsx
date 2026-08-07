import EntityIndex from "@/Components/Admin/Catalog/EntityIndex";

export default function Index({ categories, filters = {} }) {
    return (
        <EntityIndex
            entity="categories"
            title="Categories"
            description="Organize products and books into clear storefront collections."
            createLabel="Add category"
            items={categories}
            filters={filters}
            routeBase="admin.categories"
            columns={[
                {
                    key: "sort_order",
                    label: "Display order",
                    render: (item) => (
                        <span className="font-black text-ink-700">
                            {item.sort_order ?? 0}
                        </span>
                    ),
                },
            ]}
        />
    );
}

import EntityIndex from "@/Components/Admin/Catalog/EntityIndex";

export default function Index({ brands, filters = {} }) {
    return (
        <EntityIndex
            entity="brands"
            title="Brands"
            description="Manage product manufacturers, labels and storefront brand filters."
            createLabel="Add brand"
            items={brands}
            filters={filters}
            routeBase="admin.brands"
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

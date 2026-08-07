import EntityIndex from "@/Components/Admin/Catalog/EntityIndex";

export default function Index({ units, filters = {} }) {
    return (
        <EntityIndex
            entity="units"
            title="Units"
            description="Manage measurement units used by inventory and product variants."
            createLabel="Add unit"
            items={units}
            filters={filters}
            routeBase="admin.units"
            canDelete={false}
            columns={[
                {
                    key: "short_name",
                    label: "Short name",
                    render: (item) => (
                        <span className="font-black text-ink-700">
                            {item.short_name || "—"}
                        </span>
                    ),
                },
                {
                    key: "is_base",
                    label: "Base unit",
                    render: (item) => (
                        <Badge tone={item.is_base ? "brand" : "neutral"}>
                            {item.is_base ? "Yes" : "No"}
                        </Badge>
                    ),
                },
            ]}
        />
    );
}

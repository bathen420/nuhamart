import EntityIndex from "@/Components/Admin/Catalog/EntityIndex";

export default function Index({ publishers, filters = {} }) {
    return (
        <EntityIndex
            entity="publishers"
            title="Publishers"
            description="Manage publishing houses used by book products."
            createLabel="Add publisher"
            items={publishers}
            filters={filters}
            routeBase="admin.publishers"
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

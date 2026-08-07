import EntityIndex from "@/Components/Admin/Catalog/EntityIndex";

export default function Index({ authors, filters = {} }) {
    return (
        <EntityIndex
            entity="authors"
            title="Authors"
            description="Manage author identities and bilingual biographies."
            createLabel="Add author"
            items={authors}
            filters={filters}
            routeBase="admin.authors"
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

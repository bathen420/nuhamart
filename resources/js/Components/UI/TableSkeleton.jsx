export default function TableSkeleton({ columns = 6, rows = 8 }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead className="bg-slate-50">
                        <tr>
                            {Array.from({ length: columns }).map((_, index) => (
                                <th key={index} className="border-b border-slate-200 px-5 py-4">
                                    <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {Array.from({ length: rows }).map((_, rowIndex) => (
                            <tr key={rowIndex}>
                                {Array.from({ length: columns }).map((__, columnIndex) => (
                                    <td key={columnIndex} className="px-5 py-4">
                                        <div className="h-4 animate-pulse rounded bg-slate-100" />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

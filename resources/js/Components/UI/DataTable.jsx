import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
} from "lucide-react";

import EmptyState from "@/Components/UI/EmptyState";
import TableSkeleton from "@/Components/UI/TableSkeleton";

export default function DataTable({
    columns = [],
    data = [],
    loading = false,
    emptyTitle = "No data found",
    emptyDescription = "There are no records to display.",
    emptyIcon = null,
    rowKey = "id",
    sortColumn = "",
    sortDirection = "asc",
    onSort = null,
    className = "",
}) {
    const getRowKey = (row, index) => {
        if (typeof rowKey === "function") {
            return rowKey(row, index);
        }

        return row?.[rowKey] ?? index;
    };

    const getColumnValue = (row, column) => {
        if (typeof column.accessor === "function") {
            return column.accessor(row);
        }

        if (column.accessor) {
            return row?.[column.accessor];
        }

        if (column.key) {
            return row?.[column.key];
        }

        return null;
    };

    const handleSort = (column) => {
        if (!column.sortable || !onSort) {
            return;
        }

        const columnKey = column.sortKey || column.key || column.accessor;

        if (typeof columnKey !== "string") {
            return;
        }

        const nextDirection =
            sortColumn === columnKey && sortDirection === "asc"
                ? "desc"
                : "asc";

        onSort(columnKey, nextDirection);
    };

    const renderSortIcon = (column) => {
        const columnKey = column.sortKey || column.key || column.accessor;

        if (!column.sortable || typeof columnKey !== "string") {
            return null;
        }

        if (sortColumn !== columnKey) {
            return (
                <ArrowUpDown className="h-4 w-4 text-slate-400" />
            );
        }

        if (sortDirection === "desc") {
            return (
                <ArrowDown className="h-4 w-4 text-indigo-600" />
            );
        }

        return (
            <ArrowUp className="h-4 w-4 text-indigo-600" />
        );
    };

    const renderCell = (row, column, rowIndex) => {
        const value = getColumnValue(row, column);

        if (typeof column.render === "function") {
            return column.render(value, row, rowIndex);
        }

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return (
                <span className="text-slate-400">
                    —
                </span>
            );
        }

        return value;
    };

    if (loading) {
        return <TableSkeleton columns={Math.max(columns.length, 1)} />;
    }

    if (!data.length) {
        return (
            <div
                className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}
            >
                <EmptyState
                    icon={emptyIcon}
                    title={emptyTitle}
                    description={emptyDescription}
                />
            </div>
        );
    }

    return (
        <div
            className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}
        >
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead className="bg-slate-50">
                        <tr>
                            {columns.map((column, columnIndex) => {
                                const columnKey =
                                    column.key ??
                                    column.accessor ??
                                    columnIndex;

                                const alignment =
                                    column.align === "center"
                                        ? "text-center"
                                        : column.align === "right"
                                          ? "text-right"
                                          : "text-left";

                                return (
                                    <th
                                        key={columnKey}
                                        scope="col"
                                        className={`
                                            whitespace-nowrap
                                            border-b
                                            border-slate-200
                                            px-5
                                            py-4
                                            text-xs
                                            font-bold
                                            uppercase
                                            tracking-wider
                                            text-slate-600
                                            ${alignment}
                                            ${column.headerClassName ?? ""}
                                        `}
                                        style={{
                                            width: column.width,
                                            minWidth:
                                                column.minWidth,
                                        }}
                                    >
                                        {column.sortable ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleSort(
                                                        column
                                                    )
                                                }
                                                className={`
                                                    inline-flex
                                                    items-center
                                                    gap-2
                                                    transition
                                                    hover:text-indigo-600
                                                    ${
                                                        column.align ===
                                                        "center"
                                                            ? "justify-center"
                                                            : column.align ===
                                                                "right"
                                                              ? "justify-end"
                                                              : "justify-start"
                                                    }
                                                `}
                                            >
                                                <span>
                                                    {column.label}
                                                </span>

                                                {renderSortIcon(
                                                    column
                                                )}
                                            </button>
                                        ) : (
                                            column.label
                                        )}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {data.map((row, rowIndex) => (
                            <tr
                                key={getRowKey(row, rowIndex)}
                                className="transition hover:bg-slate-50/80"
                            >
                                {columns.map(
                                    (
                                        column,
                                        columnIndex
                                    ) => {
                                        const columnKey =
                                            column.key ??
                                            column.accessor ??
                                            columnIndex;

                                        const alignment =
                                            column.align ===
                                            "center"
                                                ? "text-center"
                                                : column.align ===
                                                    "right"
                                                  ? "text-right"
                                                  : "text-left";

                                        return (
                                            <td
                                                key={columnKey}
                                                className={`
                                                    px-5
                                                    py-4
                                                    text-sm
                                                    text-slate-700
                                                    ${alignment}
                                                    ${
                                                        column
                                                            .cellClassName ??
                                                        ""
                                                    }
                                                `}
                                            >
                                                {renderCell(
                                                    row,
                                                    column,
                                                    rowIndex
                                                )}
                                            </td>
                                        );
                                    }
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
import { Link } from "@inertiajs/react";
import { ArrowUpRight, ReceiptText } from "lucide-react";
import Badge from "@/Components/Admin/UI/Badge";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/Admin/UI/Table";

const paymentTone = {
    paid: "success",
    partial: "warning",
    unpaid: "danger",
    due: "danger",
};

export default function EnterpriseRecentSales({
    sales = [],
    currencySymbol = "৳",
}) {
    const money = (value) =>
        `${currencySymbol}${new Intl.NumberFormat("en-GB", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(Number(value || 0))}`;

    return (
        <section className="rounded-3xl border border-ink-200 bg-white shadow-soft">
            <div className="flex items-start justify-between gap-4 border-b border-ink-100 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700">
                        <ReceiptText size={19} />
                    </span>
                    <div>
                        <h2 className="font-black text-ink-950">Recent sales</h2>
                        <p className="mt-0.5 text-xs text-ink-400">
                            Latest completed POS transactions
                        </p>
                    </div>
                </div>

                <Link
                    href={route("admin.sales.index")}
                    className="inline-flex items-center gap-1.5 text-xs font-black text-brand-700 transition hover:text-brand-900"
                >
                    View all
                    <ArrowUpRight size={14} />
                </Link>
            </div>

            <div className="p-3 sm:p-4">
                {sales.length > 0 ? (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <tr>
                                    <TableHeader>Invoice</TableHeader>
                                    <TableHeader>Customer</TableHeader>
                                    <TableHeader className="text-right">
                                        Total
                                    </TableHeader>
                                    <TableHeader>Status</TableHeader>
                                </tr>
                            </TableHead>
                            <TableBody>
                                {sales.slice(0, 7).map((sale) => (
                                    <TableRow key={sale.id}>
                                        <TableCell>
                                            <Link
                                                href={route(
                                                    "admin.sales.show",
                                                    sale.id,
                                                )}
                                                className="font-black text-brand-700 hover:text-brand-900"
                                            >
                                                {sale.sale_number}
                                            </Link>
                                            <p className="mt-1 text-[10px] font-medium text-ink-400">
                                                {sale.created_at}
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-bold text-ink-700">
                                                {sale.customer || "Walk-in"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right font-black text-ink-950">
                                            {money(sale.total)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                tone={
                                                    paymentTone[
                                                        sale.payment_status
                                                    ] || "neutral"
                                                }
                                                dot
                                            >
                                                {sale.payment_status || "N/A"}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <div className="rounded-2xl border border-dashed border-ink-200 bg-ink-50/60 px-6 py-12 text-center">
                        <ReceiptText
                            className="mx-auto text-ink-300"
                            size={28}
                        />
                        <p className="mt-3 text-sm font-black text-ink-600">
                            No recent sales
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}

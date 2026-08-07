import {
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { TrendingUp } from "lucide-react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler,
);

export default function EnterpriseRevenueChart({
    labels = [],
    sales = [],
    purchases = [],
    currencySymbol = "৳",
}) {
    const money = (value) =>
        `${currencySymbol}${new Intl.NumberFormat("en-GB", {
            maximumFractionDigits: 0,
        }).format(Number(value || 0))}`;

    const data = {
        labels,
        datasets: [
            {
                label: "Sales",
                data: sales,
                borderColor: "rgb(13, 148, 136)",
                backgroundColor: "rgba(20, 184, 166, 0.12)",
                pointBackgroundColor: "rgb(13, 148, 136)",
                pointBorderColor: "#ffffff",
                pointBorderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 6,
                borderWidth: 2.5,
                tension: 0.38,
                fill: true,
            },
            {
                label: "Purchases",
                data: purchases,
                borderColor: "rgb(245, 158, 11)",
                backgroundColor: "rgba(245, 158, 11, 0.05)",
                pointBackgroundColor: "rgb(245, 158, 11)",
                pointBorderColor: "#ffffff",
                pointBorderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 6,
                borderWidth: 2.5,
                tension: 0.38,
                fill: false,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: "index",
            intersect: false,
        },
        plugins: {
            legend: {
                position: "top",
                align: "end",
                labels: {
                    usePointStyle: true,
                    pointStyle: "circle",
                    boxWidth: 8,
                    boxHeight: 8,
                    color: "rgb(71, 85, 105)",
                    font: {
                        size: 11,
                        weight: "600",
                    },
                },
            },
            tooltip: {
                backgroundColor: "rgb(15, 23, 42)",
                padding: 12,
                cornerRadius: 12,
                titleFont: { weight: "700" },
                callbacks: {
                    label: (context) =>
                        ` ${context.dataset.label}: ${money(
                            context.parsed.y,
                        )}`,
                },
            },
        },
        scales: {
            x: {
                border: { display: false },
                grid: { display: false },
                ticks: {
                    color: "rgb(148, 163, 184)",
                    font: { size: 10, weight: "600" },
                    maxRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 7,
                },
            },
            y: {
                beginAtZero: true,
                border: { display: false },
                grid: {
                    color: "rgba(226, 232, 240, 0.75)",
                    drawTicks: false,
                },
                ticks: {
                    color: "rgb(148, 163, 184)",
                    font: { size: 10, weight: "600" },
                    padding: 10,
                    callback: (value) => money(value),
                },
            },
        },
    };

    return (
        <section className="rounded-3xl border border-ink-200 bg-white p-5 shadow-soft sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-700">
                            <TrendingUp size={18} />
                        </span>
                        <div>
                            <h2 className="font-black text-ink-950">
                                Sales performance
                            </h2>
                            <p className="mt-0.5 text-xs text-ink-400">
                                Sales versus purchases over the last 12 months
                            </p>
                        </div>
                    </div>
                </div>

                <span className="w-fit rounded-full bg-ink-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-ink-500">
                    Monthly trend
                </span>
            </div>

            <div className="mt-5 h-[320px]">
                {labels.length > 0 ? (
                    <Line data={data} options={options} />
                ) : (
                    <div className="grid h-full place-items-center rounded-2xl border border-dashed border-ink-200 bg-ink-50/60">
                        <div className="text-center">
                            <TrendingUp
                                className="mx-auto text-ink-300"
                                size={30}
                            />
                            <p className="mt-3 text-sm font-black text-ink-600">
                                No chart data yet
                            </p>
                            <p className="mt-1 text-xs text-ink-400">
                                Sales activity will appear here.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

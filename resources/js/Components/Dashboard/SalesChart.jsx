import {
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
);

function formatCurrency(value) {
    return new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
        maximumFractionDigits: 0,
    }).format(Number(value ?? 0));
}

export default function SalesChart({ labels = [], values = [] }) {
    const data = {
        labels,
        datasets: [
            {
                label: "Monthly Sales",
                data: values,
                borderWidth: 2,
                tension: 0.35,
                fill: true,
                pointRadius: 3,
                pointHoverRadius: 5,
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
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context) =>
                        `Sales: ${formatCurrency(context.parsed.y)}`,
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    maxRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 6,
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => formatCurrency(value),
                },
            },
        },
    };

    return (
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <div className="mb-5">
                <h2 className="text-lg font-semibold text-gray-900">
                    Monthly Sales
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    সর্বশেষ ১২ মাসের বিক্রয়
                </p>
            </div>

            <div className="h-80">
                {labels.length > 0 ? (
                    <Line data={data} options={options} />
                ) : (
                    <div className="flex h-full items-center justify-center rounded-xl bg-gray-50">
                        <p className="text-sm text-gray-500">
                            Sales chart data পাওয়া যায়নি।
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
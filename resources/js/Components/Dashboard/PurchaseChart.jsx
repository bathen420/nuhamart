import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
);

function formatCurrency(value) {
    return new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
        maximumFractionDigits: 0,
    }).format(Number(value ?? 0));
}

export default function PurchaseChart({ labels = [], values = [] }) {
    const data = {
        labels,
        datasets: [
            {
                label: "Monthly Purchases",
                data: values,
                borderWidth: 1,
                borderRadius: 8,
                maxBarThickness: 42,
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
                        `Purchase: ${formatCurrency(context.parsed.y)}`,
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
                    Monthly Purchases
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    সর্বশেষ ১২ মাসের ক্রয়
                </p>
            </div>

            <div className="h-80">
                {labels.length > 0 ? (
                    <Bar data={data} options={options} />
                ) : (
                    <div className="flex h-full items-center justify-center rounded-xl bg-gray-50">
                        <p className="text-sm text-gray-500">
                            Purchase chart data পাওয়া যায়নি।
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
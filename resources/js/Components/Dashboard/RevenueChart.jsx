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

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler,
);

const money = (value) =>
    new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "BDT",
        maximumFractionDigits: 0,
    }).format(Number(value || 0));

export default function RevenueChart({ labels = [], sales = [], purchases = [] }) {
    const data = {
        labels,
        datasets: [
            {
                label: "Sales",
                data: sales,
                borderColor: "rgb(37, 99, 235)",
                backgroundColor: "rgba(37, 99, 235, 0.10)",
                pointBackgroundColor: "rgb(37, 99, 235)",
                borderWidth: 2.5,
                tension: 0.35,
                fill: true,
            },
            {
                label: "Purchases",
                data: purchases,
                borderColor: "rgb(245, 158, 11)",
                backgroundColor: "rgba(245, 158, 11, 0.06)",
                pointBackgroundColor: "rgb(245, 158, 11)",
                borderWidth: 2.5,
                tension: 0.35,
                fill: false,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
            legend: {
                position: "top",
                align: "end",
                labels: { usePointStyle: true, boxWidth: 8 },
            },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.dataset.label}: ${money(context.parsed.y)}`,
                },
            },
        },
        scales: {
            x: { grid: { display: false } },
            y: {
                beginAtZero: true,
                ticks: { callback: (value) => money(value) },
            },
        },
    };

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
                <h2 className="text-lg font-bold text-slate-900">
                    Sales & Purchase Overview
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Last 12 months
                </p>
            </div>

            <div className="mt-5 h-80">
                <Line data={data} options={options} />
            </div>
        </section>
    );
}

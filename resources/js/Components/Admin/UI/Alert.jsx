import {
    AlertCircle,
    CheckCircle2,
    Info,
    TriangleAlert,
} from "lucide-react";
import cn from "@/lib/cn";

const variants = {
    info: {
        wrap: "border-sky-200 bg-sky-50 text-sky-800",
        icon: Info,
    },
    success: {
        wrap: "border-emerald-200 bg-emerald-50 text-emerald-800",
        icon: CheckCircle2,
    },
    warning: {
        wrap: "border-amber-200 bg-amber-50 text-amber-800",
        icon: TriangleAlert,
    },
    danger: {
        wrap: "border-rose-200 bg-rose-50 text-rose-800",
        icon: AlertCircle,
    },
};

export default function Alert({
    variant = "info",
    title,
    children,
    className = "",
}) {
    const config = variants[variant] || variants.info;
    const Icon = config.icon;

    return (
        <div
            className={cn(
                "flex items-start gap-3 rounded-2xl border p-4",
                config.wrap,
                className,
            )}
            role={variant === "danger" ? "alert" : "status"}
        >
            <Icon className="mt-0.5 h-5 w-5 shrink-0" />
            <div className="min-w-0">
                {title && <p className="font-black">{title}</p>}
                <div className={cn("text-sm leading-6", title && "mt-1")}>
                    {children}
                </div>
            </div>
        </div>
    );
}

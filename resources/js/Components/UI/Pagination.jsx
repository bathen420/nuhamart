import { Link } from "@inertiajs/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ links = [] }) {
    if (!links.length) return null;

    return (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {links.map((link, index) => {
                const isPrev = link.label.includes("Previous");
                const isNext = link.label.includes("Next");

                let label = link.label;

                if (isPrev) {
                    label = (
                        <>
                            <ChevronLeft className="h-4 w-4" />
                            Prev
                        </>
                    );
                }

                if (isNext) {
                    label = (
                        <>
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </>
                    );
                }

                const classes = `
                    inline-flex items-center gap-1
                    rounded-xl
                    px-4
                    py-2
                    text-sm
                    font-medium
                    transition
                    ${
                        link.active
                            ? "bg-indigo-600 text-white shadow"
                            : "bg-white border border-slate-300 text-slate-600 hover:bg-slate-100"
                    }
                    ${
                        !link.url
                            ? "cursor-not-allowed opacity-40"
                            : ""
                    }
                `;

                if (!link.url) {
                    return (
                        <span
                            key={index}
                            className={classes}
                            dangerouslySetInnerHTML={{
                                __html:
                                    typeof label === "string"
                                        ? label
                                        : "",
                            }}
                        >
                            {typeof label !== "string" && label}
                        </span>
                    );
                }

                return (
                    <Link
                        key={index}
                        href={link.url}
                        preserveScroll
                        className={classes}
                    >
                        {label}
                    </Link>
                );
            })}
        </div>
    );
}
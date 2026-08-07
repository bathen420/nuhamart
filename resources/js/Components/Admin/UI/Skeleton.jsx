import cn from "@/lib/cn";

export default function Skeleton({ className = "" }) {
    return (
        <div
            className={cn(
                "animate-pulse-soft rounded-xl bg-ink-200",
                className,
            )}
            aria-hidden="true"
        />
    );
}

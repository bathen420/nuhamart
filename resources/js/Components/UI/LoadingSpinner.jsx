export default function LoadingSpinner({
    size = "md",
    text = "",
    fullScreen = false,
}) {
    const sizes = {
        sm: "h-5 w-5 border-2",
        md: "h-8 w-8 border-[3px]",
        lg: "h-12 w-12 border-4",
    };

    const spinner = (
        <div className="flex flex-col items-center justify-center gap-3">
            <div
                className={`
                    ${sizes[size]}
                    animate-spin
                    rounded-full
                    border-indigo-600
                    border-t-transparent
                `}
            />

            {text && (
                <p className="text-sm text-slate-500">
                    {text}
                </p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                {spinner}
            </div>
        );
    }

    return spinner;
}
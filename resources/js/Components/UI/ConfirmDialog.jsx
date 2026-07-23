import { AlertTriangle, Loader2 } from "lucide-react";

export default function ConfirmDialog({
    open = false,
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmText = "Delete",
    cancelText = "Cancel",
    confirmVariant = "danger",
    processing = false,
    onConfirm,
    onCancel,
}) {
    if (!open) return null;

    const buttonClasses = {
        danger:
            "bg-rose-600 hover:bg-rose-700 focus:ring-rose-500",
        primary:
            "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500",
        success:
            "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500",
    };

    return (
        <>
            {/* Backdrop */}

            <div
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Modal */}

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

                    {/* Header */}

                    <div className="flex flex-col items-center px-6 pt-8">

                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                            <AlertTriangle className="h-8 w-8" />
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-slate-900">
                            {title}
                        </h2>

                        <p className="mt-2 text-center text-sm leading-6 text-slate-500">
                            {message}
                        </p>

                    </div>

                    {/* Footer */}

                    <div className="mt-8 flex gap-3 border-t border-slate-200 p-6">

                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={processing}
                            className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                            {cancelText}
                        </button>

                        <button
                            type="button"
                            disabled={processing}
                            onClick={onConfirm}
                            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition focus:outline-none focus:ring-4 ${
                                buttonClasses[confirmVariant]
                            }`}
                        >
                            {processing && (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            )}

                            {confirmText}
                        </button>

                    </div>

                </div>
            </div>
        </>
    );
}
export default function InputError({
    message,
    className = "",
    ...props
}) {
    return message ? (
        <p
            {...props}
            className={`mt-1.5 text-xs font-semibold text-rose-600 ${className}`}
        >
            {message}
        </p>
    ) : null;
}

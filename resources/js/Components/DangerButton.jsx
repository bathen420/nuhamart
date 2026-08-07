import Button from "@/Components/Admin/UI/Button";

export default function DangerButton({
    className = "",
    disabled,
    children,
    ...props
}) {
    return (
        <Button
            variant="danger"
            disabled={disabled}
            className={className}
            {...props}
        >
            {children}
        </Button>
    );
}

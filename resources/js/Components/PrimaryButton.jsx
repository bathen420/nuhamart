import Button from "@/Components/Admin/UI/Button";

export default function PrimaryButton({
    className = "",
    disabled,
    children,
    ...props
}) {
    return (
        <Button
            type="submit"
            disabled={disabled}
            className={className}
            {...props}
        >
            {children}
        </Button>
    );
}

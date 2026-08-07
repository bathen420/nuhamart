import { usePage } from "@inertiajs/react";
import { Heart, LoaderCircle } from "lucide-react";
import useWishlist from "@/hooks/useWishlist";

export default function WishlistButton({ product, className = "" }) {
    const { auth = {} } = usePage().props;
    const wishlist = useWishlist(auth?.user ?? null);

    const liked = wishlist.has(product?.id);
    const processing = wishlist.isProcessing(product?.id);

    const handleClick = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        try {
            await wishlist.toggle(product);
        } catch {
            // Keep the existing state and allow the next click to retry.
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={processing}
            aria-label={
                liked
                    ? `Remove ${product?.name ?? "product"} from wishlist`
                    : `Add ${product?.name ?? "product"} to wishlist`
            }
            aria-pressed={liked}
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-white shadow transition hover:scale-105 disabled:cursor-wait disabled:opacity-70 ${className}`}
            type="button"
        >
            {processing ? (
                <LoaderCircle
                    size={18}
                    className="animate-spin text-teal-700"
                />
            ) : (
                <Heart
                    size={18}
                    fill={liked ? "currentColor" : "none"}
                    className={liked ? "text-rose-500" : "text-slate-500"}
                />
            )}
        </button>
    );
}

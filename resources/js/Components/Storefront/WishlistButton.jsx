import { Heart } from "lucide-react";
import { useState } from "react";

export default function WishlistButton() {
    const [liked, setLiked] = useState(false);

    return (
        <button
            onClick={() => setLiked(!liked)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow hover:scale-105 transition"
            type="button"
        >
            <Heart
                size={18}
                fill={liked ? "currentColor" : "none"}
                className={
                    liked
                        ? "text-red-500"
                        : "text-gray-500"
                }
            />
        </button>
    );
}
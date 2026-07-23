import { Star } from "lucide-react";

export default function ProductRating({
    rating = 0,
    reviews = 0,
}) {
    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-yellow-500">
                <Star
                    size={16}
                    fill="currentColor"
                />

                <span className="font-semibold">
                    {rating}
                </span>
            </div>

            <span className="text-sm text-gray-500">
                ({reviews})
            </span>
        </div>
    );
}
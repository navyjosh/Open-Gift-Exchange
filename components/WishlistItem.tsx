'use client'
import { WishlistItem as Item } from "@/lib/wishlistStore"
import { useWishlistStore } from "@/lib/wishlistStore"

export default function WishlistItem({ item }: { item: Item }) {
    const removeItem = useWishlistStore((state) => state.removeItem)

    return (
        <div className="border p-4 rounded mb-2 flex justify-between items-center">
            <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                {item.link && (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        View
                    </a>
                )}
            </div>
            <button
                onClick={() => removeItem(item.id)}
                className="text-red-600 hover:underline"
            >
                Remove
            </button>
        </div>
    )
}
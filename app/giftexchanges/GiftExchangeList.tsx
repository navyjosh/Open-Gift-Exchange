// app/giftexchanges/GiftExchangeList.tsx
'use client'
import { MoreVertical } from "lucide-react"
import * as DropDownMenu from '@radix-ui/react-dropdown-menu'
import { deleteGiftExchange } from "@/lib/api"
import { useTransition } from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ExpandableCard } from "@/components/ExpandableCard"


export default function GiftExchangeList({ exchanges }: { exchanges: any[] }) {
    const router = useRouter()
    const [deleting, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    function handleDelete(name: string, id: string): void {
        if (!confirm(`Delete "${name}"?`)) return

        startTransition(async () => {
            try {
                await deleteGiftExchange(id)
                router.refresh()
            } catch {
                setError('Failed to delete')
            }
        })
    }

    return (
        <div className="space-y-6">

            {exchanges.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">
                    You are not a member of any gift exchanges yet.
                </p>
            ) : (
                <ul className="space-y-4">
                    {exchanges.map((exchange) => (                        
                        <ExpandableCard
    key={exchange.id}
    header={
        <>
            <p className="font-medium">{exchange.name}</p>
            <span className="text-sm text-gray-500">{exchange.date}</span>
            <div className="flex items-center gap-2">
                <DropDownMenu.Root>
                    <DropDownMenu.Trigger asChild>
                        <button
                            onClick={(e) => e.stopPropagation()}
                            className="text-gray-500 hover:text-gray-700 p-2"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>
                    </DropDownMenu.Trigger>
                    <DropDownMenu.Portal>
                        <DropDownMenu.Content
                            sideOffset={4}
                            className="z-50 min-w-[120px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-md text-sm"
                        >
                            <DropDownMenu.Item
                                onSelect={() => handleDelete(exchange.name, exchange.id)}
                                className="px-3 py-2 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 cursor-pointer"
                            >Delete</DropDownMenu.Item>
                        </DropDownMenu.Content>
                    </DropDownMenu.Portal>
                </DropDownMenu.Root>
            </div>
        </>
    }
>
    <div>
        <p>Placeholder for details of Gift Exchange</p>
    </div>
</ExpandableCard>
                    ))}

                </ul>
            )}
        </div>
    )
}



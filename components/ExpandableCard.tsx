import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

interface ExpandableCardProps {
    header: React.ReactNode
    children: React.ReactNode
    borderColor?: string
    defaultExpanded?: boolean
    onExpand?: () => void
}

export function ExpandableCard({
    header,
    children,
    borderColor = 'border-gray-300 hover:border-blue-400',
    defaultExpanded = false,
    onExpand,
}: ExpandableCardProps) {
    const [expanded, setExpanded] = useState(defaultExpanded)

    const toggle = () => {
        const next = !expanded
        if (next && onExpand) onExpand()
        setExpanded(next)
    }

    return (
        <li
            className={`border rounded p-4 transition-colors ${expanded ? 'border-blue-500' : borderColor}`}
        >
            <div
                className="flex items-center justify-between w-full cursor-pointer"
                onClick={() => setExpanded(!expanded)}
            >
                {header}
            </div>

            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden mt-4"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </li>
    )
}

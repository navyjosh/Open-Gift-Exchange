'use client'

import { useEffect, useRef } from 'react'
import React from 'react'

interface DialogProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
}

export function Dialog({ isOpen, onClose, title, children }: DialogProps) {
    const dialogRef = useRef<HTMLDivElement>(null)
    const didFocusRef = useRef(false)

    useEffect(() => {
        if (!isOpen) {
            didFocusRef.current = false
            return
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose()
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        if (!didFocusRef.current) {
            // Only focus once per open
            const firstInput = dialogRef.current?.querySelector('input')
            firstInput?.focus()
            didFocusRef.current = true
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                ref={dialogRef}
                className="bg-white text-black dark:bg-gray-900 dark:text-white p-6 rounded shadow-lg w-full max-w-sm"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-semibold mb-4">{title}</h2>
                {children}
            </div>
        </div>
    )
}

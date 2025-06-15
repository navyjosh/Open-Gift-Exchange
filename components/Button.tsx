'use client'

import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, children, variant = 'default', size = 'md', ...props }, ref) => {
        const base =
            'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'

        const variants: Record<string, string> = {
            default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
            outline:
                'border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-400 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700',
            ghost: 'bg-transparent text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800',
        }

        const sizes: Record<string, string> = {
            sm: 'px-3 py-1 text-sm',
            md: 'px-4 py-2 text-sm',
            lg: 'px-6 py-3 text-base',
        }

        return (
            <button
                ref={ref}
                className={cn(base, variants[variant], sizes[size], className)}
                {...props}
            >
                {children}
            </button>
        )
    }
)

Button.displayName = 'Button'

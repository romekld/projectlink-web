'use client'

import React from 'react'
import { ChevronRight, House, UsersRound } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface ListItemProps {
    icon: React.ReactNode
    title: string
    subtitle: string
    status?: string
    statusVariant?: 'default' | 'secondary' | 'destructive' | 'outline'
    amount: string | number
    onClick?: () => void
    className?: string
}

export function ListItem({
    icon,
    title,
    subtitle,
    status,
    statusVariant = 'secondary',
    amount,
    onClick,
    className,
}: ListItemProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                'w-full p-3 flex items-start gap-3 border-b last:border-b-0 bg-background hover:bg-accent/50 transition-colors duration-200 active:bg-accent',
                className
            )}
        >
            {/* Icon Container */}
            <div className="flex-shrink-0 size-12 rounded-full bg-accent flex items-center justify-center">
                {icon}
            </div>

            <div className="flex-1 gap-1 flex-col flex">
                <div className="flex w-full justify-between items-start">
                    {/* Content */}
                    <div className="flex-1 min-w-0 text-left">

                        {/* Title */}
                        <div className="font-semibold text-foreground truncate text-sm">
                            {title}
                        </div>
                        {/* Subtitle and Status */}
                        <span className="text-muted-foreground text-xs truncate">
                            {subtitle}
                        </span>
                    </div>

                    {/* Amount */}
                    <div className="flex-shrink-0 flex items-center gap-1">
                        {status && (
                            <Badge variant={statusVariant} className="text-xs py-0 px-2 flex-shrink-0">
                                {status}
                            </Badge>
                        )}
                        <ChevronRight className="size-4 text-muted-foreground flex-shrink-0" />
                    </div>
                </div>
                <div className="flex gap-2">
                    {/* Content */}
                    <Badge variant="ghost" className='text-muted-foreground text-xs truncate p-0'>
                        <House /> Blk 4 Lot 44 Purok 1
                    </Badge>
                    <Badge variant="ghost" className='text-muted-foreground text-xs truncate p-0'>
                        <UsersRound /> 5 Members
                    </Badge>
                </div>
            </div>

        </button >
    )
}

/**
 * ListItemContainer - Wrapper for grouped list items
 * Creates the stacked appearance with proper spacing
 */
export function ListItemContainer({
    children,
    className,
}: {
    children: React.ReactNode
    className?: string
}) {
    return (
        <div
            className={cn(
                'w-full rounded-xl border border-border overflow-hidden bg-card',
                className
            )}
        >
            {children}
        </div>
    )
}

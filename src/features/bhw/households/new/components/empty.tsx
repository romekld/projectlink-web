"use client"

import { PlusIcon } from "lucide-react"

import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"

import { DrawerAddMember } from "./drawer-add-member"

export function EmptyState() {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <PlusIcon />
                </EmptyMedia>
                <EmptyTitle className="text-lg font-semibold">
                    No Household Members
                </EmptyTitle>
                <EmptyDescription>
                    Start by adding the first member of this household.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <DrawerAddMember />
            </EmptyContent>
        </Empty>
    )
}

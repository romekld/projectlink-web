import { UserRoundPlus } from "lucide-react"

import { AddDrawerScrollable } from "./add-drawer-scrollable";

import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"

export function EmptyMembers() {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <UserRoundPlus />
                </EmptyMedia>
                <EmptyTitle>No Household Members Yet</EmptyTitle>
                <EmptyDescription>
                    Start by adding the <span className="font-bold">household head</span>. Then add the spouse, son/daughter (eldest to youngest), and other members
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="flex-row justify-center gap-2">
                <AddDrawerScrollable />
            </EmptyContent>

        </Empty>
    )
}

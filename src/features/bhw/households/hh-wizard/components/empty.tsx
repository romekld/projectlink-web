import { IconFolderCode } from "@tabler/icons-react"
import { ArrowUpRightIcon, Plus, UserRoundPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AddDrawerScrollable } from "./add-drawer-scrollable";

import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { IconUserPlus } from "@tabler/icons-react"

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
